/**
 * Coding Reflex 常量定义
 */

export const APP_NAME = "Coding Reflex";
export const APP_VERSION = "1.0.0";

export const LANGUAGES = ["Java", "Python", "C++", "JavaScript", "TypeScript", "Bash", "SQL"];

export const LANGUAGE_MAP = {
  Java: { id: "java", ext: ".java", icon: "J" },
  Python: { id: "python", ext: ".py", icon: "P" },
  "C++": { id: "cpp", ext: ".cpp", icon: "C" },
  JavaScript: { id: "javascript", ext: ".js", icon: "JS" },
  TypeScript: { id: "typescript", ext: ".ts", icon: "TS" },
  Bash: { id: "bash", ext: ".sh", icon: "B" },
  SQL: { id: "sql", ext: ".sql", icon: "S" },
};

export const MODULES = [
  { id: "loop", label: "循环", icon: "🔄", description: "for/while/do-while 循环结构" },
  { id: "condition", label: "条件分支", icon: "🔀", description: "if-else/switch 条件判断" },
  { id: "array", label: "数组/列表", icon: "📊", description: "数组声明、遍历、操作" },
  { id: "string", label: "字符串", icon: "📝", description: "字符串处理与操作" },
  { id: "function", label: "函数", icon: "⚡", description: "函数定义、调用、参数" },
  { id: "class", label: "类与对象", icon: "🏗️", description: "类定义、继承、多态" },
  { id: "io", label: "输入输出", icon: "📥", description: "控制台/文件IO操作" },
];

export const MODES = [
  { id: "copy", label: "代码临摹", icon: "📋", description: "照抄代码片段，强化语法肌肉记忆" },
  { id: "fill", label: "代码填空", icon: "✏️", description: "补全关键语法点，训练核心考点" },
  { id: "debug", label: "BUG修复", icon: "🐛", description: "识别并修复真实代码错误" },
  { id: "reflex", label: "限时速写", icon: "⚡", description: "限时快速输出代码，训练反射" },
  { id: "arena", label: "反射竞技场", icon: "🎮", description: "60秒挑战，连击Combo" },
  { id: "challenge", label: "限时挑战", icon: "🏆", description: "多题型限时混合挑战" },
  { id: "boss", label: "Boss挑战", icon: "👑", description: "综合工程场景考核" },
];

export const DIFFICULTY_LEVELS = [
  { id: 1, label: "入门", color: "#4ec9b0" },
  { id: 2, label: "基础", color: "#569cd6" },
  { id: 3, label: "进阶", color: "#dcdcaa" },
  { id: 4, label: "熟练", color: "#ce9178" },
  { id: 5, label: "精通", color: "#c586c0" },
  { id: 6, label: "专家", color: "#d16969" },
  { id: 7, label: "大师", color: "#4ec9b0" },
  { id: 8, label: "宗师", color: "#b5cea8" },
  { id: 9, label: "传说", color: "#dcdcaa" },
  { id: 10, label: "神话", color: "#ff6b6b" },
];

export const QUESTION_COUNTS = [5, 10, 15, 20];

export const ERROR_DIMENSIONS = {
  syntax: { label: "语法错误", icon: "🔴", color: "var(--accent-red)" },
  structure: { label: "结构错误", icon: "🟠", color: "var(--accent-orange)" },
  api: { label: "API错误", icon: "🟡", color: "var(--accent-yellow)" },
  logic: { label: "逻辑错误", icon: "🔵", color: "var(--accent-blue)" },
  typo: { label: "手速错误", icon: "⚪", color: "var(--text-secondary)" },
};

export const BUG_TYPES = {
  syntax: { label: "语法错误", color: "var(--accent-red)" },
  logic: { label: "逻辑错误", color: "var(--accent-orange)" },
  boundary: { label: "边界错误", color: "var(--accent-yellow)" },
  structure: { label: "结构错误", color: "var(--accent-blue)" },
  api: { label: "API错误", color: "var(--accent-purple)" },
};

export const STORAGE_KEYS = {
  PROFILE: "profile",
  STATS: "stats",
  SETTINGS: "settings",
  HISTORY: "history",
  SKILLS: "skills",
  ACHIEVEMENTS: "achievements",
};

export const EXP_REWARDS = {
  copy_correct: 10,
  fill_correct: 20,
  debug_correct: 30,
  reflex_correct: 15,
  boss_complete: 100,
  combo_bonus: 5,
  streak_bonus: 20,
  perfect_bonus: 50,
};

export const COMBO_THRESHOLDS = {
  5: { label: "5连击", multiplier: 1.5 },
  10: { label: "10连击", multiplier: 2.0 },
  20: { label: "20连击", multiplier: 3.0 },
  50: { label: "50连击", multiplier: 5.0 },
};

export const REFLEX_TIME_LIMITS = [15, 30, 45, 60, 90];

export const ARENA_CONFIG = {
  timeLimit: 60,
  questionsPerArena: 20,
  comboDecayTime: 5000,
  speedBonusThreshold: 5,
};
