/**
 * 最小稳定历史存储 — recordManager 单测
 * 覆盖：写入/列表/上限/损坏数据/清空/导出 JSON
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  recordSession,
  getHistory,
  getHistoryCount,
  filterHistory,
  clearHistory,
  clearAll,
  buildHistoryExport,
  exportHistoryJSON,
  getOverviewStats,
  HISTORY_SCHEMA_VERSION,
  EXPORT_FORMAT_VERSION,
} from "@/lib/recordManager";
import { storage } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";

function sample(overrides = {}) {
  return {
    mode: "copy",
    language: "Java",
    module: "loop",
    total: 10,
    correct: 8,
    accuracy: 80,
    totalTime: 120,
    avgTime: "12.0",
    questions: [{ correct: true }, { correct: false }],
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("recordSession", () => {
  it("写入一条记录并带 schemaVersion/id/timestamp", () => {
    const rec = recordSession(sample());
    expect(rec).toBeTruthy();
    expect(rec.schemaVersion).toBe(HISTORY_SCHEMA_VERSION);
    expect(rec.id).toMatch(/^session_/);
    expect(rec.timestamp).toMatch(/^\d{4}-/);
  });

  it("新记录插到最前", () => {
    recordSession(sample({ total: 1 }));
    recordSession(sample({ total: 2 }));
    const h = getHistory();
    expect(h[0].total).toBe(2);
    expect(h[1].total).toBe(1);
  });

  it("超过 500 条丢弃最旧", () => {
    for (let i = 0; i < 505; i++) {
      recordSession(sample({ total: i }));
    }
    const h = getHistory(1000);
    expect(h.length).toBe(500);
    expect(h[0].total).toBe(504);
    expect(h[h.length - 1].total).toBe(5);
  });

  it("同步累加 stats 汇总", () => {
    recordSession(sample({ total: 10, correct: 8, totalTime: 50 }));
    recordSession(sample({ total: 5, correct: 5, totalTime: 25 }));
    const ov = getOverviewStats();
    expect(ov.totalSessions).toBe(2);
    expect(ov.totalQuestions).toBe(15);
    expect(ov.totalCorrect).toBe(13);
    expect(ov.accuracy).toBe(87);
  });
});

describe("getHistory / getHistoryCount", () => {
  it("空存储返回空数组", () => {
    expect(getHistory()).toEqual([]);
    expect(getHistoryCount()).toBe(0);
  });

  it("尊重 limit 参数", () => {
    for (let i = 0; i < 5; i++) {
      recordSession(sample({ total: i }));
    }
    expect(getHistory(2).length).toBe(2);
    expect(getHistoryCount()).toBe(5);
  });

  it("跳过损坏条目（非对象 / 无 timestamp）", () => {
    storage.set(STORAGE_KEYS.HISTORY, [
      sample({ total: 1, timestamp: "2026-01-01T00:00:00.000Z" }),
      "not-an-object",
      { total: 9 },
      null,
      sample({ total: 2, timestamp: "2026-01-02T00:00:00.000Z" }),
    ]);
    const h = getHistory(10);
    expect(h.length).toBe(2);
    expect(h.map((r) => r.total).sort()).toEqual([1, 2]);
    expect(getHistoryCount()).toBe(2);
  });

  it("history 存的不是数组时返回空", () => {
    storage.set(STORAGE_KEYS.HISTORY, { broken: true });
    expect(getHistory()).toEqual([]);
  });

  it("归一化缺失数值字段为 0 / 空数组", () => {
    storage.set(STORAGE_KEYS.HISTORY, [
      { timestamp: "2026-01-01T00:00:00.000Z", mode: "copy" },
    ]);
    const h = getHistory();
    expect(h[0].total).toBe(0);
    expect(h[0].correct).toBe(0);
    expect(h[0].questions).toEqual([]);
    expect(h[0].schemaVersion).toBe(HISTORY_SCHEMA_VERSION);
  });
});

describe("filterHistory", () => {
  beforeEach(() => {
    recordSession(sample({ mode: "copy", language: "Java", module: "loop" }));
    recordSession(sample({ mode: "fill", language: "Python", module: "array" }));
  });

  it("按 mode 过滤", () => {
    expect(filterHistory({ mode: "copy" }).length).toBe(1);
  });

  it("按 language 过滤", () => {
    expect(filterHistory({ language: "Python" }).length).toBe(1);
  });

  it("按 module 过滤", () => {
    expect(filterHistory({ module: "array" }).length).toBe(1);
  });

  it("组合过滤", () => {
    expect(filterHistory({ mode: "copy", language: "Java" }).length).toBe(1);
    expect(filterHistory({ mode: "copy", language: "Python" }).length).toBe(0);
  });
});

describe("clearHistory / clearAll", () => {
  it("clearHistory 只清 history，保留 stats", () => {
    recordSession(sample());
    recordSession(sample());
    expect(getHistoryCount()).toBe(2);

    const removed = clearHistory();
    expect(removed).toBe(2);
    expect(getHistoryCount()).toBe(0);
    // stats 汇总仍在
    expect(getOverviewStats().totalSessions).toBe(2);
  });

  it("clearAll 同时清 history 与 stats", () => {
    recordSession(sample());
    clearAll();
    expect(getHistoryCount()).toBe(0);
    expect(getOverviewStats().totalSessions).toBe(0);
  });
});

describe("buildHistoryExport / exportHistoryJSON", () => {
  it("导出对象含 kind/version/count/limits/history", () => {
    recordSession(sample());
    recordSession(sample());
    const exp = buildHistoryExport();
    expect(exp.kind).toBe("codedrill.history");
    expect(exp.version).toBe(EXPORT_FORMAT_VERSION);
    expect(exp.schemaVersion).toBe(HISTORY_SCHEMA_VERSION);
    expect(exp.count).toBe(2);
    expect(exp.history.length).toBe(2);
    expect(exp.limits.storage).toBe("localStorage");
    expect(exp.limits.maxRecords).toBe(500);
    expect(typeof exp.exportedAt).toBe("string");
    expect(exp.stats.totalSessions).toBe(2);
  });

  it("exportHistoryJSON 可 JSON.parse 且回读等价", () => {
    recordSession(sample({ total: 3 }));
    const parsed = JSON.parse(exportHistoryJSON());
    expect(parsed.count).toBe(1);
    expect(parsed.history[0].total).toBe(3);
  });

  it("空历史也可导出", () => {
    const exp = buildHistoryExport();
    expect(exp.count).toBe(0);
    expect(exp.history).toEqual([]);
  });
});
