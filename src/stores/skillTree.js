import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { storage } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";

const SKILL_TREE = {
  loop: {
    label: "循环",
    bg: "#3B82F6",
    maxLevel: 10,
    prerequisites: [],
    subSkills: [
      { id: "for_loop", label: "for循环" },
      { id: "while_loop", label: "while循环" },
      { id: "nested_loop", label: "嵌套循环" },
      { id: "loop_control", label: "break/continue" },
    ],
    levels: {
      1: { title: "入门", exp: 100 },
      2: { title: "基础", exp: 300 },
      3: { title: "进阶", exp: 600 },
      4: { title: "熟练", exp: 1000 },
      5: { title: "精通", exp: 1500 },
      6: { title: "专家", exp: 2200 },
      7: { title: "大师", exp: 3000 },
      8: { title: "宗师", exp: 4000 },
      9: { title: "传说", exp: 5500 },
      10: { title: "神话", exp: 8000 },
    },
  },
  condition: {
    label: "条件分支",
    bg: "#8B5CF6",
    maxLevel: 10,
    prerequisites: [],
    subSkills: [
      { id: "if_else", label: "if-else" },
      { id: "switch_case", label: "switch-case" },
      { id: "ternary", label: "三元运算" },
    ],
    levels: {
      1: { title: "入门", exp: 100 },
      2: { title: "基础", exp: 300 },
      3: { title: "进阶", exp: 600 },
      4: { title: "熟练", exp: 1000 },
      5: { title: "精通", exp: 1500 },
    },
  },
  array: {
    label: "数组",
    bg: "#10B981",
    maxLevel: 10,
    prerequisites: ["loop"],
    subSkills: [
      { id: "declaration", label: "数组声明" },
      { id: "traversal", label: "遍历" },
      { id: "sort", label: "排序" },
      { id: "search", label: "查找" },
    ],
    levels: {
      1: { title: "入门", exp: 100 },
      2: { title: "基础", exp: 300 },
      3: { title: "进阶", exp: 600 },
      4: { title: "熟练", exp: 1000 },
      5: { title: "精通", exp: 1500 },
    },
  },
  string: {
    label: "字符串",
    bg: "#F59E0B",
    maxLevel: 10,
    prerequisites: ["array"],
    subSkills: [
      { id: "basic", label: "基础操作" },
      { id: "methods", label: "常用方法" },
      { id: "regex", label: "正则表达式" },
    ],
    levels: {
      1: { title: "入门", exp: 100 },
      2: { title: "基础", exp: 300 },
      3: { title: "进阶", exp: 600 },
      4: { title: "熟练", exp: 1000 },
      5: { title: "精通", exp: 1500 },
    },
  },
  function: {
    label: "函数",
    bg: "#EF4444",
    maxLevel: 10,
    prerequisites: ["condition"],
    subSkills: [
      { id: "definition", label: "函数定义" },
      { id: "parameters", label: "参数传递" },
      { id: "recursion", label: "递归" },
    ],
    levels: {
      1: { title: "入门", exp: 100 },
      2: { title: "基础", exp: 300 },
      3: { title: "进阶", exp: 600 },
      4: { title: "熟练", exp: 1000 },
      5: { title: "精通", exp: 1500 },
    },
  },
  class: {
    label: "类与对象",
    bg: "#06B6D4",
    maxLevel: 10,
    prerequisites: ["function"],
    subSkills: [
      { id: "definition", label: "类定义" },
      { id: "inheritance", label: "继承" },
      { id: "polymorphism", label: "多态" },
      { id: "encapsulation", label: "封装" },
    ],
    levels: {
      1: { title: "入门", exp: 100 },
      2: { title: "基础", exp: 300 },
      3: { title: "进阶", exp: 600 },
      4: { title: "熟练", exp: 1000 },
      5: { title: "精通", exp: 1500 },
    },
  },
  io: {
    label: "输入输出",
    bg: "#EC4899",
    maxLevel: 10,
    prerequisites: ["function"],
    subSkills: [
      { id: "console", label: "控制台IO" },
      { id: "file", label: "文件IO" },
      { id: "stream", label: "流操作" },
    ],
    levels: {
      1: { title: "入门", exp: 100 },
      2: { title: "基础", exp: 300 },
      3: { title: "进阶", exp: 600 },
      4: { title: "熟练", exp: 1000 },
      5: { title: "精通", exp: 1500 },
    },
  },
};

const EXP_REWARDS = {
  copy_correct: 10,
  fill_correct: 20,
  debug_correct: 30,
  reflex_correct: 15,
  combo_bonus: 5,
  perfect_bonus: 50,
};

export const useSkillTreeStore = defineStore("skillTree", () => {
  const skillTree = ref({});
  const totalExp = ref(0);

  function load() {
    const saved = storage.get(STORAGE_KEYS.SKILLS, null);
    if (saved) {
      skillTree.value = saved;
    } else {
      initSkillTree();
    }
    calculateTotalExp();
  }

  function initSkillTree() {
    const tree = {};
    for (const [key, skill] of Object.entries(SKILL_TREE)) {
      tree[key] = {
        level: 1,
        exp: 0,
        unlocked: skill.prerequisites.length === 0,
      };
    }
    skillTree.value = tree;
    save();
  }

  function save() {
    storage.set(STORAGE_KEYS.SKILLS, skillTree.value);
  }

  function calculateTotalExp() {
    let total = 0;
    for (const skill of Object.values(skillTree.value)) {
      total += skill.exp || 0;
    }
    totalExp.value = total;
  }

  function addExp(module, amount) {
    if (!skillTree.value[module]) {
      skillTree.value[module] = { level: 1, exp: 0, unlocked: true };
    }

    const skill = skillTree.value[module];
    skill.exp += amount;

    const skillDef = SKILL_TREE[module];
    if (skillDef) {
      const nextLevel = skill.level + 1;
      const nextLevelDef = skillDef.levels[nextLevel];
      if (nextLevelDef && skill.exp >= nextLevelDef.exp) {
        skill.level = nextLevel;
        checkUnlocks();
      }
    }

    calculateTotalExp();
    save();
  }

  function checkUnlocks() {
    for (const [key, skillDef] of Object.entries(SKILL_TREE)) {
      if (skillDef.prerequisites.length > 0) {
        const allMet = skillDef.prerequisites.every((pre) => {
          return skillTree.value[pre]?.level >= 3;
        });
        if (allMet && !skillTree.value[key]?.unlocked) {
          skillTree.value[key] = {
            ...skillTree.value[key],
            unlocked: true,
          };
        }
      }
    }
  }

  function getSkillLevel(module) {
    return skillTree.value[module]?.level || 0;
  }

  function getSkillExp(module) {
    return skillTree.value[module]?.exp || 0;
  }

  function getNextLevelExp(module) {
    const skill = skillTree.value[module];
    if (!skill) {return 0;}
    const skillDef = SKILL_TREE[module];
    const nextLevelDef = skillDef?.levels[skill.level + 1];
    return nextLevelDef?.exp || 0;
  }

  function isUnlocked(module) {
    return skillTree.value[module]?.unlocked || false;
  }

  function getProgress(module) {
    const skill = skillTree.value[module];
    if (!skill) {return 0;}
    const nextExp = getNextLevelExp(module);
    if (nextExp === 0) {return 100;}
    const prevExp = SKILL_TREE[module]?.levels[skill.level]?.exp || 0;
    return Math.min(100, Math.round(((skill.exp - prevExp) / (nextExp - prevExp)) * 100));
  }

  function getLevelTitle(module) {
    const skill = skillTree.value[module];
    if (!skill) {return "";}
    return SKILL_TREE[module]?.levels[skill.level]?.title || "";
  }

  function recordSessionReward(mode, module, correct, total, combo = 0) {
    const baseExp = EXP_REWARDS[mode] || 10;
    const exp = correct * baseExp;
    const comboExp = combo > 1 ? (combo - 1) * EXP_REWARDS.combo_bonus : 0;
    const perfectExp = correct === total ? EXP_REWARDS.perfect_bonus : 0;
    const totalReward = exp + comboExp + perfectExp;

    addExp(module, totalReward);
    return totalReward;
  }

  const overallLevel = computed(() => {
    const levels = Object.values(skillTree.value).map((s) => s.level || 0);
    return levels.length > 0 ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : 0;
  });

  load();

  return {
    skillTree,
    totalExp,
    overallLevel,
    getSkillLevel,
    getSkillExp,
    getNextLevelExp,
    isUnlocked,
    getProgress,
    getLevelTitle,
    recordSessionReward,
    addExp,
    SKILL_TREE,
  };
});
