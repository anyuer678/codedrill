import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTrainingStore } from "@/stores/training";

describe("trainingStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("初始状态应该正确", () => {
    const store = useTrainingStore();
    expect(store.questions).toEqual([]);
    expect(store.currentIndex).toBe(0);
    expect(store.results).toEqual([]);
    expect(store.isRunning).toBe(false);
    expect(store.isComplete).toBe(false);
    expect(store.elapsedTime).toBe(0);
  });

  it("sessionCorrect 应该计算正确数", () => {
    const store = useTrainingStore();
    store.results = [
      { correct: true },
      { correct: false },
      { correct: true },
      null,
    ];
    expect(store.sessionCorrect).toBe(2);
  });

  it("sessionWrong 应该计算错误数", () => {
    const store = useTrainingStore();
    store.results = [
      { correct: true },
      { correct: false },
      { correct: true },
      null,
    ];
    expect(store.sessionWrong).toBe(1);
  });

  it("sessionAccuracy 应该计算正确率", () => {
    const store = useTrainingStore();
    store.results = [
      { correct: true },
      { correct: false },
      { correct: true },
      { correct: true },
    ];
    expect(store.sessionAccuracy).toBe(75);
  });

  it("progress 应该计算进度", () => {
    const store = useTrainingStore();
    store.questions = [{}, {}, {}, {}];
    store.currentIndex = 1;
    expect(store.progress).toBe(50);
  });

  it("currentQuestion 应该返回当前题目", () => {
    const store = useTrainingStore();
    store.questions = [{ id: 1 }, { id: 2 }, { id: 3 }];
    store.currentIndex = 1;
    expect(store.currentQuestion).toEqual({ id: 2 });
  });

  it("goToQuestion 应该跳转到指定题目", () => {
    const store = useTrainingStore();
    store.questions = [{}, {}, {}];
    store.goToQuestion(2);
    expect(store.currentIndex).toBe(2);
  });

  it("goToQuestion 应该限制范围", () => {
    const store = useTrainingStore();
    store.questions = [{}, {}, {}];
    store.goToQuestion(-1);
    expect(store.currentIndex).toBe(0);
    store.goToQuestion(10);
    expect(store.currentIndex).toBe(0);
  });

  it("reset 应该重置状态", () => {
    const store = useTrainingStore();
    store.questions = [{}, {}];
    store.currentIndex = 1;
    store.results = [{ correct: true }];
    store.isRunning = true;
    store.reset();
    expect(store.questions).toEqual([]);
    expect(store.currentIndex).toBe(0);
    expect(store.results).toEqual([]);
    expect(store.isRunning).toBe(false);
  });
});
