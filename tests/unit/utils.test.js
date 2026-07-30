import { describe, it, expect } from "vitest";
import { normalizeCode, compareCode, calcAccuracy, uid } from "@/lib/utils";

describe("normalizeCode", () => {
  it("应该去除多余空格", () => {
    expect(normalizeCode("  hello   world  ")).toBe("hello world");
  });

  it("应该保留换行符（默认）", () => {
    expect(normalizeCode("hello\n\nworld")).toBe("hello\nworld");
  });

  it("可以折叠换行符", () => {
    expect(normalizeCode("hello\n\nworld", { collapseNewlines: true })).toBe("hello world");
  });

  it("应该去除制表符", () => {
    expect(normalizeCode("hello\t\tworld")).toBe("hello world");
  });

  it("处理空字符串", () => {
    expect(normalizeCode("")).toBe("");
  });

  it("处理只有空格的字符串", () => {
    expect(normalizeCode("   ")).toBe("");
  });

  it("多行代码标准化", () => {
    const code = "  int x = 1;  \n  int y = 2;  ";
    expect(normalizeCode(code)).toBe("int x = 1;\nint y = 2;");
  });
});

describe("compareCode", () => {
  it("相同代码应该返回 true", () => {
    expect(compareCode("int x = 1;", "int x = 1;")).toBe(true);
  });

  it("不同空格应该返回 true", () => {
    expect(compareCode("int x = 1;", "int  x  =  1;")).toBe(true);
  });

  it("不同代码应该返回 false", () => {
    expect(compareCode("int x = 1;", "int y = 2;")).toBe(false);
  });

  it("不同换行应该返回 true（使用 collapseNewlines）", () => {
    expect(compareCode(
      "int x = 1;\nint y = 2;",
      "int x = 1; int y = 2;",
      { collapseNewlines: true }
    )).toBe(true);
  });

  it("不同换行默认保留换行", () => {
    expect(compareCode(
      "int x = 1;\nint y = 2;",
      "int x = 1; int y = 2;"
    )).toBe(false);
  });
});

describe("calcAccuracy", () => {
  it("计算正确率", () => {
    expect(calcAccuracy(8, 10)).toBe(80);
    expect(calcAccuracy(0, 10)).toBe(0);
    expect(calcAccuracy(10, 10)).toBe(100);
  });

  it("处理零总数", () => {
    expect(calcAccuracy(0, 0)).toBe(0);
  });

  it("四舍五入", () => {
    expect(calcAccuracy(1, 3)).toBe(33);
    expect(calcAccuracy(2, 3)).toBe(67);
  });
});

describe("uid", () => {
  it("生成非空字符串", () => {
    const id = uid();
    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
  });

  it("生成唯一ID", () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(uid());
    }
    expect(ids.size).toBe(100);
  });
});
