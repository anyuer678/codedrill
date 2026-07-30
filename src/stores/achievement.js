import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { storage } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";

const ACHIEVEMENTS = [
  // 训练类
  { id: "first_session", name: "初次训练", desc: "完成第一次训练", icon: "🎯", condition: (s) => s.totalSessions >= 1 },
  { id: "session_10", name: "训练达人", desc: "完成10次训练", icon: "📚", condition: (s) => s.totalSessions >= 10 },
  { id: "session_50", name: "训练大师", desc: "完成50次训练", icon: "🏆", condition: (s) => s.totalSessions >= 50 },
  { id: "session_100", name: "百炼成钢", desc: "完成100次训练", icon: "💎", condition: (s) => s.totalSessions >= 100 },

  // 正确率类
  { id: "perfect_10", name: "完美十题", desc: "连续10题全对", icon: "✨", condition: (s) => s.maxStreak >= 10 },
  { id: "perfect_50", name: "完美五十题", desc: "连续50题全对", icon: "⭐", condition: (s) => s.maxStreak >= 50 },
  { id: "accuracy_90", name: "九成把握", desc: "整体正确率达到90%", icon: "🎯", condition: (s) => s.accuracy >= 90 && s.totalQuestions >= 50 },
  { id: "accuracy_95", name: "精准打击", desc: "整体正确率达到95%", icon: "💯", condition: (s) => s.accuracy >= 95 && s.totalQuestions >= 100 },

  // 速度类
  { id: "speed_demon", name: "手速惊人", desc: "单题用时少于3秒", icon: "⚡", condition: (s) => s.fastestTime <= 3 },
  { id: "speed_master", name: "极速编码", desc: "平均用时少于10秒", icon: "🚀", condition: (s) => s.avgTime < 10 && s.totalQuestions >= 20 },

  // 连击类
  { id: "combo_5", name: "五连击", desc: "达成5连击", icon: "🔥", condition: (s) => s.maxCombo >= 5 },
  { id: "combo_10", name: "十连击", desc: "达成10连击", icon: "💥", condition: (s) => s.maxCombo >= 10 },
  { id: "combo_20", name: "二十连击", desc: "达成20连击", icon: "🌟", condition: (s) => s.maxCombo >= 20 },

  // 技能类
  { id: "skill_lv5", name: "技能进阶", desc: "任一技能达到5级", icon: "📈", condition: (s) => s.maxSkillLevel >= 5 },
  { id: "skill_lv10", name: "技能精通", desc: "任一技能达到10级", icon: "👑", condition: (s) => s.maxSkillLevel >= 10 },
  { id: "all_skills", name: "全面发展", desc: "所有技能都解锁", icon: "🌈", condition: (s) => s.unlockedSkills >= 5 },

  // 语言类
  { id: "java_master", name: "Java高手", desc: "Java题目完成50道", icon: "☕", condition: (s) => s.javaCount >= 50 },
  { id: "python_master", name: "Python高手", desc: "Python题目完成50道", icon: "🐍", condition: (s) => s.pythonCount >= 50 },
  { id: "cpp_master", name: "C++高手", desc: "C++题目完成50道", icon: "⚙️", condition: (s) => s.cppCount >= 50 },
  { id: "polyglot", name: "多语言达人", desc: "三种语言各完成10道", icon: "🌐", condition: (s) => s.javaCount >= 10 && s.pythonCount >= 10 && s.cppCount >= 10 },

  // 特殊类
  { id: "night_owl", name: "夜猫子", desc: "在凌晨0-5点训练", icon: "🦉", condition: () => { const h = new Date().getHours(); return h >= 0 && h < 5; } },
  { id: "early_bird", name: "早起鸟", desc: "在早上5-7点训练", icon: "🐦", condition: () => { const h = new Date().getHours(); return h >= 5 && h < 7; } },
  { id: "weekend_warrior", name: "周末战士", desc: "在周末训练", icon: "⚔️", condition: () => { const d = new Date().getDay(); return d === 0 || d === 6; } },
];

export const useAchievementStore = defineStore("achievement", () => {
  const unlocked = ref([]);
  const stats = ref({
    totalSessions: 0,
    totalQuestions: 0,
    accuracy: 0,
    maxStreak: 0,
    maxCombo: 0,
    fastestTime: Infinity,
    avgTime: 0,
    maxSkillLevel: 0,
    unlockedSkills: 0,
    javaCount: 0,
    pythonCount: 0,
    cppCount: 0,
  });

  const newAchievements = ref([]);

  function load() {
    const saved = storage.get(STORAGE_KEYS.ACHIEVEMENTS, null);
    if (saved) {
      unlocked.value = saved.unlocked || [];
      stats.value = { ...stats.value, ...saved.stats };
    }
  }

  function save() {
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, {
      unlocked: unlocked.value,
      stats: stats.value,
    });
  }

  function updateStats(newStats) {
    stats.value = { ...stats.value, ...newStats };
    checkAchievements();
    save();
  }

  function checkAchievements() {
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlocked.value.includes(achievement.id)) {continue;}

      try {
        if (achievement.condition(stats.value)) {
          unlocked.value.push(achievement.id);
          newlyUnlocked.push(achievement);
        }
      } catch {
        // ignore
      }
    }

    if (newlyUnlocked.length > 0) {
      newAchievements.value.push(...newlyUnlocked);
      save();
    }

    return newlyUnlocked;
  }

  function dismissNew(index) {
    newAchievements.value.splice(index, 1);
  }

  function dismissAllNew() {
    newAchievements.value = [];
  }

  const allAchievements = computed(() => {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlocked: unlocked.value.includes(a.id),
    }));
  });

  const unlockedCount = computed(() => unlocked.value.length);
  const totalCount = computed(() => ACHIEVEMENTS.length);
  const progress = computed(() => Math.round((unlockedCount.value / totalCount.value) * 100));

  load();

  return {
    unlocked,
    stats,
    newAchievements,
    allAchievements,
    unlockedCount,
    totalCount,
    progress,
    updateStats,
    checkAchievements,
    dismissNew,
    dismissAllNew,
  };
});
