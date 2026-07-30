/**
 * 数据导出工具
 */

import { getHistory } from "./recordManager";
import { storage } from "./utils";
import { STORAGE_KEYS } from "./constants";

const WRONG_KEY = "wrong_questions";
const FAVORITES_KEY = "favorite_questions";
const SRS_KEY = "srs_cards";

/**
 * 导出训练记录为 JSON
 */
export function exportToJSON() {
  const history = getHistory(1000);
  const stats = storage.get(STORAGE_KEYS.STATS, {});
  const skills = storage.get(STORAGE_KEYS.SKILLS, {});
  const achievements = storage.get(STORAGE_KEYS.ACHIEVEMENTS, {});
  const wrong = storage.get(WRONG_KEY, []);
  const favorites = storage.get(FAVORITES_KEY, []);
  const srs = storage.get(SRS_KEY, []);

  const data = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    stats,
    skills,
    achievements,
    history,
    wrong,
    favorites,
    srs,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, `codedrill_export_${getDateStr()}.json`);
}

/**
 * 导出训练记录为 CSV
 */
export function exportToCSV() {
  const history = getHistory(1000);

  const headers = ["时间", "模式", "语言", "模块", "总数", "正确", "正确率", "用时"];
  const rows = history.map((r) => [
    r.timestamp,
    r.mode,
    r.language,
    r.module || "",
    r.total || 0,
    r.correct || 0,
    r.accuracy || 0,
    r.totalTime ? r.totalTime.toFixed(1) : "0",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([`\ufeff${  csv}`], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, `codedrill_records_${getDateStr()}.csv`);
}

/**
 * 导入 JSON 数据
 */
export function importFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    if (data.stats) {
      storage.set(STORAGE_KEYS.STATS, data.stats);
    }
    if (data.skills) {
      storage.set(STORAGE_KEYS.SKILLS, data.skills);
    }
    if (data.achievements) {
      storage.set(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
    }
    if (data.history) {
      storage.set(STORAGE_KEYS.HISTORY, data.history);
    }
    if (data.wrong) {
      storage.set(WRONG_KEY, data.wrong);
    }
    if (data.favorites) {
      storage.set(FAVORITES_KEY, data.favorites);
    }
    if (data.srs) {
      storage.set(SRS_KEY, data.srs);
    }

    return { success: true, message: "导入成功" };
  } catch {
    return { success: false, message: "JSON格式错误" };
  }
}

/**
 * 清除所有数据
 */
export function clearAllData() {
  storage.remove(STORAGE_KEYS.STATS);
  storage.remove(STORAGE_KEYS.SKILLS);
  storage.remove(STORAGE_KEYS.ACHIEVEMENTS);
  storage.remove(STORAGE_KEYS.HISTORY);
  storage.remove(STORAGE_KEYS.SETTINGS);
  storage.remove(WRONG_KEY);
  storage.remove(FAVORITES_KEY);
  storage.remove(SRS_KEY);
}

function downloadBlob(blob, filename) {
  // 检测是否在移动端 WebView 中
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 移动端：使用 FileReader 转为 data URL 然后打开
    const reader = new FileReader();
    reader.onload = function() {
      const a = document.createElement("a");
      a.href = reader.result;
      a.download = filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    reader.readAsDataURL(blob);
  } else {
    // 桌面端：使用标准方式
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

function getDateStr() {
  const d = new Date();
  return `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${d.getDate().toString().padStart(2, "0")}`;
}

export default {
  exportToJSON,
  exportToCSV,
  importFromJSON,
  clearAllData,
};
