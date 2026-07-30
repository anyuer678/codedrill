import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { storage } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";
import { analyzeWeaknesses } from "@/lib/weaknessAnalyzer";
import { calculateSkillScore, recommendTrainingMode } from "@/lib/adaptiveEngine";

export const useProfileStore = defineStore("profile", () => {
  const settings = ref({
    language: "Java",
    difficulty: "auto",
    dailyGoal: 20,
    timeLimit: 60,
  });

  const weaknesses = ref({ hasData: false, modules: {}, errorTypes: {}, recommendations: [] });
  const skillScore = ref({ overall: 0, byModule: {}, byErrorType: {} });
  const recommendation = ref({ mode: "copy", reason: "从临摹模式开始" });

  function load() {
    const saved = storage.get(STORAGE_KEYS.SETTINGS, {});
    settings.value = { ...settings.value, ...saved };
    refreshAnalysis();
  }

  function save() {
    storage.set(STORAGE_KEYS.SETTINGS, settings.value);
  }

  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings };
    save();
  }

  function refreshAnalysis() {
    weaknesses.value = analyzeWeaknesses(50);
    skillScore.value = calculateSkillScore([]);
    recommendation.value = recommendTrainingMode(skillScore.value, weaknesses.value);
  }

  const dailyProgress = computed(() => {
    const history = storage.get(STORAGE_KEYS.HISTORY, []);
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = history.filter((h) => h.timestamp?.startsWith(today));
    const todayQuestions = todaySessions.reduce((sum, s) => sum + (s.total || 0), 0);
    return {
      completed: todayQuestions,
      goal: settings.value.dailyGoal,
      percentage: Math.min(100, Math.round((todayQuestions / settings.value.dailyGoal) * 100)),
    };
  });

  load();

  return {
    settings,
    weaknesses,
    skillScore,
    recommendation,
    dailyProgress,
    updateSettings,
    refreshAnalysis,
  };
});
