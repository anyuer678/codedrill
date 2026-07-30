import { describe, it, expect } from "vitest";
import { classifyLineError, classifyCodeError } from "@/lib/errorClassifier";

describe("classifyLineError", () => {
  it("相同代码应该返回 null dimension", () => {
    const result = classifyLineError("int x = 1;", "int x = 1;");
    expect(result.dimension).toBeNull();
  });

  it("缺少分号应该返回 syntax", () => {
    const result = classifyLineError("int x = 1", "int x = 1;");
    expect(result.dimension).toBe("syntax");
  });

  it("单字符差异应该返回 typo", () => {
    const result = classifyLineError("int x = 1;", "int y = 1;");
    expect(result.dimension).toBe("typo");
  });
});

describe("classifyCodeError", () => {
  it("相同代码应该返回零错误", () => {
    const code = "int x = 1;\nint y = 2;";
    const result = classifyCodeError(code, code);
    expect(result.totalErrors).toBe(0);
    expect(result.primaryType).toBeNull();
  });

  it("应该统计多行错误", () => {
    const submitted = "int x = 1\nint y = 2";
    const reference = "int x = 1;\nint y = 2;";
    const result = classifyCodeError(submitted, reference);
    expect(result.totalErrors).toBe(2);
    expect(result.primaryType).toBe("syntax");
  });

  it("应该返回详细信息", () => {
    const submitted = "int x = 1";
    const reference = "int x = 1;";
    const result = classifyCodeError(submitted, reference);
    expect(result.details).toHaveLength(1);
    expect(result.details[0].line).toBe(1);
    expect(result.details[0].dimension).toBe("syntax");
  });

  it("空代码应该返回零错误", () => {
    const result = classifyCodeError("", "");
    expect(result.totalErrors).toBe(0);
  });
});
