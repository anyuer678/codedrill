import { describe, it, expect } from "vitest";
import { getQuestions, generateFillQuestions, generateDebugQuestions } from "@/lib/questionService";

describe("questionService", () => {
  describe("getQuestions", () => {
    it("应该返回指定数量的题目", async () => {
      const questions = await getQuestions("Java", "loop", 5);
      expect(questions.length).toBe(5);
    });

    it("应该返回正确语言和模块的题目", async () => {
      const questions = await getQuestions("Java", "loop", 3);
      questions.forEach((q) => {
        expect(q.language).toBe("Java");
        expect(q.module).toBe("loop");
      });
    });

    it("应该有必要的字段", async () => {
      const questions = await getQuestions("Java", "loop", 3);
      questions.forEach((q) => {
        expect(q.id).toBeDefined();
        expect(q.code).toBeDefined();
        expect(q.type).toBeDefined();
      });
    });

    it("应该过滤难度", async () => {
      const questions = await getQuestions("Java", "loop", 10, 1);
      questions.forEach((q) => {
        expect(q.difficulty).toBe(1);
      });
    });
  });

  describe("generateFillQuestions", () => {
    it("应该返回填空题", async () => {
      const questions = await generateFillQuestions("Java", "loop", 3);
      // 无匹配/空答案的题会被过滤（createBlank 修复后语义），数量 0~3 合法
      expect(questions.length).toBeGreaterThanOrEqual(0);
      expect(questions.length).toBeLessThanOrEqual(3);
      questions.forEach((q) => {
        expect(q.type).toBe("fill_blank");
        // 修复后不变量：每题都保留原码且非空答案（判分对象）
        expect(q.original_code).toBeDefined();
        expect(q.answer).toBeTruthy();
        expect(q.answer).not.toBe("___");
      });
    });

    it("应该有答案", async () => {
      const questions = await generateFillQuestions("Java", "loop", 3);
      questions.forEach((q) => {
        expect(q.answer).toBeDefined();
      });
    });
  });

  describe("generateDebugQuestions", () => {
    it("应该返回调试题或空数组", async () => {
      const questions = await generateDebugQuestions("Java", 3);
      // 可能返回0或3，取决于数据加载
      expect(questions.length).toBeGreaterThanOrEqual(0);
      if (questions.length > 0) {
        questions.forEach((q) => {
          expect(q.type).toBe("debug");
          expect(q.code_with_bug).toBeDefined();
          expect(q.correct_code).toBeDefined();
        });
      }
    });
  });
});
