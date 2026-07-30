/**
 * CodeDrill 工具库入口
 */

/**
 * 标准化代码字符串（智能比较模式）
 * - 忽略首尾空白
 * - 将连续空白压缩为单个空格
 * - 可选忽略换行差异
 */
export function normalizeCode(code, options = {}) {
  const { collapseNewlines = false } = options;

  let normalized = code
    .replace(/\r\n/g, "\n")     // 统一换行符
    .replace(/\t/g, "  ")       // Tab转空格
    .trim();                    // 去除首尾空白

  if (collapseNewlines) {
    // 将换行替换为空格，然后压缩空白
    normalized = normalized.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  } else {
    // 保留换行，压缩每行内的空白
    normalized = normalized
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter((line) => line.length > 0)
      .join("\n");
  }

  return normalized;
}

/**
 * 比较两段代码是否等价（智能比较）
 */
export function compareCode(submitted, expected, options = {}) {
  return normalizeCode(submitted, options) === normalizeCode(expected, options);
}

/**
 * 格式化时间（秒 -> mm:ss）
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * 计算正确率
 */
export function calcAccuracy(correct, total) {
  if (total === 0) {return 0;}
  return Math.round((correct / total) * 100);
}

/**
 * 本地存储封装
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(`codedrill_${key}`);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`codedrill_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    localStorage.removeItem(`codedrill_${key}`);
  },
};

/**
 * 防抖函数
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 生成唯一ID
 */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
