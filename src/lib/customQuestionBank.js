/**
 * 自定义题库服务
 * 用户添加、管理自己的题目
 */

import { storage } from "./utils";

const CUSTOM_KEY = "custom_questions";
const MAX_CUSTOM = 200;

/**
 * 获取自定义题库
 */
export function getCustomQuestions(options = {}) {
  const { language, module, limit = 50 } = options;
  let list = storage.get(CUSTOM_KEY, []);

  if (language) {
    list = list.filter((q) => q.language === language);
  }
  if (module) {
    list = list.filter((q) => q.module === module);
  }

  return list.slice(0, limit);
}

/**
 * 添加自定义题目
 */
export function addCustomQuestion(question) {
  const list = storage.get(CUSTOM_KEY, []);

  const newQuestion = {
    id: `custom_${Date.now()}`,
    ...question,
    createdAt: new Date().toISOString(),
    isCustom: true,
  };

  list.unshift(newQuestion);

  if (list.length > MAX_CUSTOM) {
    list.length = MAX_CUSTOM;
  }

  storage.set(CUSTOM_KEY, list);
  return newQuestion;
}

/**
 * 更新自定义题目
 */
export function updateCustomQuestion(id, updates) {
  const list = storage.get(CUSTOM_KEY, []);
  const index = list.findIndex((q) => q.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    storage.set(CUSTOM_KEY, list);
    return list[index];
  }
  return null;
}

/**
 * 删除自定义题目
 */
export function deleteCustomQuestion(id) {
  const list = storage.get(CUSTOM_KEY, []);
  const filtered = list.filter((q) => q.id !== id);
  storage.set(CUSTOM_KEY, filtered);
}

/**
 * 导出题库为 JSON
 */
export function exportCustomQuestions() {
  const list = storage.get(CUSTOM_KEY, []);
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `codedrill_custom_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 导入题库
 */
export function importCustomQuestions(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      return { success: false, message: "格式错误：需要数组" };
    }

    const existing = storage.get(CUSTOM_KEY, []);
    const merged = [...data.map((q) => ({ ...q, id: `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`, isCustom: true })), ...existing];

    if (merged.length > MAX_CUSTOM) {
      merged.length = MAX_CUSTOM;
    }

    storage.set(CUSTOM_KEY, merged);
    return { success: true, message: `成功导入 ${data.length} 道题目` };
  } catch {
    return { success: false, message: "JSON 格式错误" };
  }
}

/**
 * 获取自定义题库统计
 */
export function getCustomStats() {
  const list = storage.get(CUSTOM_KEY, []);
  const byLang = {};
  const byModule = {};

  for (const q of list) {
    byLang[q.language] = (byLang[q.language] || 0) + 1;
    byModule[q.module] = (byModule[q.module] || 0) + 1;
  }

  return {
    total: list.length,
    byLang,
    byModule,
  };
}

export default {
  getCustomQuestions,
  addCustomQuestion,
  updateCustomQuestion,
  deleteCustomQuestion,
  exportCustomQuestions,
  importCustomQuestions,
  getCustomStats,
};
