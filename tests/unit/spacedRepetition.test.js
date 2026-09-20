import { describe, it, expect, beforeEach, vi } from "vitest";
import { sm2, addCard, reviewCard, getDueCards, getSrsStats, removeCard } from "@/lib/spacedRepetition";

// mock localStorage via utils.storage if needed
beforeEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});

describe("sm2", () => {
  it("首答正确 interval=1", () => {
    const r = sm2(4, 0, 2.5, 0);
    expect(r.repetitions).toBe(1);
    expect(r.interval).toBe(1);
  });

  it("第二次正确 interval=6", () => {
    const r = sm2(4, 1, 2.5, 1);
    expect(r.repetitions).toBe(2);
    expect(r.interval).toBe(6);
  });

  it("多次正确按 ease 递增", () => {
    const r = sm2(5, 2, 2.0, 6);
    expect(r.repetitions).toBe(3);
    expect(r.interval).toBe(Math.round(6 * 2.0));
  });

  it("答错重置 repetitions 且 interval=1", () => {
    const r = sm2(1, 3, 2.5, 12);
    expect(r.repetitions).toBe(0);
    expect(r.interval).toBe(1);
  });

  it("easeFactor 下限 1.3", () => {
    const r = sm2(0, 0, 1.3, 1);
    expect(r.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe("srs store", () => {
  it("addCard 写入并可 getDueCards", () => {
    addCard("q1", "Java", "loop", "for(;;){}", "exp");
    const due = getDueCards();
    expect(due.some((c) => c.questionId === "q1")).toBe(true);
  });

  it("reviewCard 更新统计", () => {
    addCard("q2", "Python", "if", "if x:", "e");
    const c = reviewCard("q2", 4);
    expect(c.reviewCount).toBe(1);
    expect(c.repetitions).toBe(1);
    const s = getSrsStats();
    expect(s.total).toBeGreaterThanOrEqual(1);
  });

  it("removeCard 删除", () => {
    addCard("q3", "Java", "loop", "", "");
    removeCard("q3");
    const s = getSrsStats();
    // q1/q2 may remain
    expect(getDueCards().some((c) => c.questionId === "q3")).toBe(false);
  });
});
