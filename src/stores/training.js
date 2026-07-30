import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Timer, formatTime, getSpeedRating } from "@/lib/timer";
import { recordSession } from "@/lib/recordManager";
import { getQuestions, generateFillQuestions, generateDebugQuestions } from "@/lib/questionService";
import { normalizeCode, storage } from "@/lib/utils";
import { useAchievementStore } from "./achievement";
import { useSkillTreeStore } from "./skillTree";
import { useBehaviorTracking } from "@/lib/behaviorTracking";
import { addWrongQuestion, markWrongMastered } from "@/lib/questionBank";

const PROGRESS_KEY = "training_progress";

export const useTrainingStore = defineStore("training", () => {
  const questions = ref([]);
  const currentIndex = ref(0);
  const results = ref([]);
  const isRunning = ref(false);
  const isComplete = ref(false);

  const behavior = useBehaviorTracking();
  const elapsedTime = ref(0);
  const mode = ref("copy");
  const language = ref("Java");
  const module = ref("loop");
  const difficulty = ref(null);

  const timer = new Timer();
  const questionTimer = new Timer();
  let intervalId = null;

  const currentQuestion = computed(() => questions.value[currentIndex.value] || null);
  const progress = computed(() => {
    if (questions.value.length === 0) {return 0;}
    return Math.round(((currentIndex.value + 1) / questions.value.length) * 100);
  });
  const sessionCorrect = computed(() => results.value.filter((r) => r?.correct).length);
  const sessionWrong = computed(() => results.value.filter((r) => r && !r.correct).length);
  const sessionAccuracy = computed(() => {
    const total = results.value.filter(Boolean).length;
    if (total === 0) {return 0;}
    return Math.round((sessionCorrect.value / total) * 100);
  });
  const avgTime = computed(() => {
    const times = results.value.filter(Boolean).map((r) => r.timeSpent || 0);
    if (times.length === 0) {return "0.0";}
    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  });

  async function startSession(config) {
    mode.value = config.mode || "copy";
    language.value = config.language || "Java";
    module.value = config.module || "loop";
    difficulty.value = config.difficulty || null;

    let qs;
    const count = config.count || 10;

    switch (mode.value) {
      case "fill":
        qs = await generateFillQuestions(language.value, module.value, count);
        break;
      case "debug":
        qs = await generateDebugQuestions(language.value, count);
        break;
      default:
        qs = await getQuestions(language.value, module.value, count, difficulty.value);
    }

    questions.value = qs;
    currentIndex.value = 0;
    results.value = new Array(qs.length).fill(null);
    isRunning.value = true;
    isComplete.value = false;
    elapsedTime.value = 0;

    // 开始行为追踪
    behavior.startTracking(`${mode.value}_${language.value}_${Date.now()}`);

    timer.start();
    questionTimer.start();
    startInterval();
  }

  function resumeSession(savedProgress) {
    mode.value = savedProgress.mode;
    language.value = savedProgress.language;
    module.value = savedProgress.module;
    currentIndex.value = savedProgress.currentIndex;
    results.value = savedProgress.results;
    elapsedTime.value = savedProgress.elapsedTime;
    isRunning.value = true;
    isComplete.value = false;

    timer.start();
    questionTimer.start();
    startInterval();
  }

  function startInterval() {
    stopInterval();
    intervalId = setInterval(() => {
      elapsedTime.value = timer.getElapsed();
    }, 100);
  }

  function stopInterval() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function submitAnswer(answer) {
    if (!currentQuestion.value || !isRunning.value) {return null;}

    const timeSpent = questionTimer.getElapsed();
    const q = currentQuestion.value;
    let correct = false;

    // 智能对比选项：忽略多余空白
    const compareOptions = { ignoreWhitespace: true };

    switch (mode.value) {
      case "copy":
        correct = normalizeCode(answer, compareOptions) === normalizeCode(q.code, compareOptions);
        break;
      case "fill":
        correct = normalizeCode(answer, compareOptions) === normalizeCode(q.answer, compareOptions);
        break;
      case "debug":
        correct = normalizeCode(answer, compareOptions) === normalizeCode(q.correct_code, compareOptions);
        break;
      default:
        correct = normalizeCode(answer, compareOptions) === normalizeCode(q.code, compareOptions);
    }

    const result = {
      questionId: q.id,
      correct,
      timeSpent,
      speedRating: getSpeedRating(timeSpent, q.difficulty || 1),
      submitted: answer,
      expected: mode.value === "debug" ? q.correct_code : q.code,
      explanation: q.explanation,
    };

    // 记录行为
    behavior.recordSubmit(correct, timeSpent);
    behavior.recordInput(answer.length, answer.split("\n").length);

    // 集成错题本
    if (!correct) {
      const errorType = classifyError(answer, mode.value === "debug" ? q.correct_code : q.code);
      addWrongQuestion(q, errorType, answer);
    } else if (q.id) {
      markWrongMastered(q.id);
    }

    results.value[currentIndex.value] = result;
    questionTimer.reset();
    questionTimer.start();

    // 自动保存进度
    saveProgress();

    return result;
  }

  function saveProgress() {
    if (!isRunning.value) {return;}
    storage.set(PROGRESS_KEY, {
      mode: mode.value,
      language: language.value,
      module: module.value,
      currentIndex: currentIndex.value,
      results: results.value,
      elapsedTime: elapsedTime.value,
      timestamp: Date.now(),
    });
  }

  function loadProgress() {
    const saved = storage.get(PROGRESS_KEY, null);
    if (!saved) {return null;}
    // 超过24小时的进度自动清除
    if (Date.now() - saved.timestamp > 24 * 60 * 60 * 1000) {
      storage.remove(PROGRESS_KEY);
      return null;
    }
    return saved;
  }

  function clearProgress() {
    storage.remove(PROGRESS_KEY);
  }

  function nextQuestion() {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
      return false;
    }
    completeSession();
    return true;
  }

  function goToQuestion(index) {
    if (index >= 0 && index < questions.value.length) {
      currentIndex.value = index;
      questionTimer.reset();
      questionTimer.start();
    }
  }

  function completeSession() {
    isRunning.value = false;
    isComplete.value = true;
    timer.stop();
    stopInterval();

    const totalTime = timer.getElapsed();
    const sessionData = {
      mode: mode.value,
      language: language.value,
      module: module.value,
      total: questions.value.length,
      correct: sessionCorrect.value,
      accuracy: sessionAccuracy.value,
      totalTime,
      avgTime: parseFloat(avgTime.value),
      questions: results.value.filter(Boolean),
    };

    // 记录训练数据
    recordSession(sessionData);

    // 清除保存的进度
    clearProgress();

    // 结束行为追踪
    const behaviorReport = behavior.endTracking();
    sessionData.behaviorReport = behaviorReport;

    // 更新技能树经验
    try {
      const skillTree = useSkillTreeStore();
      skillTree.recordSessionReward(
        mode.value,
        module.value,
        sessionCorrect.value,
        questions.value.length,
        0,
      );
    } catch {
      // ignore if store not available
    }

    // 更新成就系统
    try {
      const achievementStore = useAchievementStore();
      const fastestTime = Math.min(
        ...results.value.filter(Boolean).map((r) => r.timeSpent || Infinity),
      );
      achievementStore.updateStats({
        totalSessions: (achievementStore.stats.totalSessions || 0) + 1,
        totalQuestions: (achievementStore.stats.totalQuestions || 0) + questions.value.length,
        accuracy: sessionAccuracy.value,
        fastestTime: isFinite(fastestTime) ? fastestTime : achievementStore.stats.fastestTime,
        avgTime: parseFloat(avgTime.value),
        [`${language.value.toLowerCase()}Count`]:
          (achievementStore.stats[`${language.value.toLowerCase()}Count`] || 0) + questions.value.length,
      });
    } catch {
      // ignore if store not available
    }
  }

  function reset() {
    questions.value = [];
    currentIndex.value = 0;
    results.value = [];
    isRunning.value = false;
    isComplete.value = false;
    elapsedTime.value = 0;
    timer.reset();
    questionTimer.reset();
    stopInterval();
  }

  function getSessionSummary() {
    return {
      mode: mode.value,
      language: language.value,
      module: module.value,
      total: questions.value.length,
      correct: sessionCorrect.value,
      wrong: sessionWrong.value,
      accuracy: sessionAccuracy.value,
      totalTime: formatTime(elapsedTime.value),
      avgTime: avgTime.value,
      results: results.value.filter(Boolean),
    };
  }

  return {
    questions,
    currentIndex,
    results,
    isRunning,
    isComplete,
    elapsedTime,
    mode,
    language,
    module,
    difficulty,
    currentQuestion,
    progress,
    sessionCorrect,
    sessionWrong,
    sessionAccuracy,
    avgTime,
    startSession,
    resumeSession,
    submitAnswer,
    nextQuestion,
    goToQuestion,
    completeSession,
    reset,
    getSessionSummary,
    loadProgress,
    saveProgress,
    clearProgress,
  };
});

function classifyError(submitted, expected) {
  const sub = submitted.trim();
  const exp = expected.trim();

  if (sub.length !== exp.length) {
    if (sub.length < exp.length) {return "structure";}
    return "typo";
  }

  let diffCount = 0;
  for (let i = 0; i < sub.length; i++) {
    if (sub[i] !== exp[i]) {diffCount++;}
  }

  if (diffCount <= 2) {return "typo";}
  if (diffCount <= 5) {return "syntax";}
  return "logic";
}
