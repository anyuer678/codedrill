import { describe, it, expect } from "vitest";
import { createBlanks, injectError } from "@/lib/templateEngine";

describe("createBlanks", () => {
  it("变量名与关键字同字符时不挖错位置（int i 回归）", () => {
    const code = "int i = 0;";
    const { code: blanked, answers } = createBlanks(code, [{ type: "variable" }]);
    // 修复前：replace("i","___") 命中 int 的 i → "___nt i = 0;"
    expect(blanked).toBe("int ___ = 0;");
    expect(answers).toEqual([{ type: "variable", answer: "i" }]);
  });

  it("变量名是关键字前缀时同样不挖错（String name）", () => {
    const code = "String name = \"x\";";
    const { code: blanked, answers } = createBlanks(code, [{ type: "variable" }]);
    expect(blanked).toBe("String ___ = \"x\";");
    expect(answers[0].answer).toBe("name");
  });

  it("连续多空按各自捕获组位置挖", () => {
    const code = "for (int i = 0; i < 10; i++)";
    const { code: blanked, answers } = createBlanks(code, [
      { type: "variable" },
      { type: "condition" },
    ]);
    // 第一空挖变量名，第二空挖 if/while 条件体（此处无 if/while，应跳过）
    expect(blanked).toBe("for (int ___ = 0; i < 10; i++)");
    expect(answers.map((a) => a.type)).toEqual(["variable"]);
  });

  it("pattern 不匹配时跳过（Python 无 int/def 声明）", () => {
    const code = "print(total)";
    const { code: blanked, answers } = createBlanks(code, [{ type: "variable" }]);
    expect(blanked).toBe(code);
    expect(answers).toEqual([]);
  });

  it("return_value 挖空精确到捕获组", () => {
    const code = "return total;";
    const { code: blanked, answers } = createBlanks(code, [{ type: "return_value" }]);
    expect(blanked).toBe("return ___;");
    expect(answers[0].answer).toBe("total");
  });
});

describe("injectError（外部审查回归：8 个 pattern id 全部命中）", () => {
  // 每个 pattern 用与其结构匹配的代码（实现按结构替换，结构缺失时原样返回属预期）
  const cases = [
    ["missing_semicolon", "int x = 1;"],           // 行尾分号被删
    ["wrong_operator", "if (a < b) {}"],           // < → <=
    ["loop_boundary_off_by_one", "for (int i = 0; i < n; i++) {}"], // < → <=
    ["missing_braces", "if (a) {\n  b();\n}\n"],   // 花括号被剥
    ["undefined_variable", "int count = 0; count = count + 1;"],   // 后续使用改未定义名
    ["comparison_logic_error", "if (x === y) {}"], // === → !==
    ["index_out_of_bounds", "int t = arr[i];"],    // [i] → [i + 1]
    ["infinite_loop", "while (i < n) { i++; }"],   // 去自增
  ];

  for (const [id, code] of cases) {
    it(`${id} 产生实际变化（非死代码）`, () => {
      expect(injectError(code, id)).not.toBe(code);
    });
  }

  it("未知 pattern id 原样返回", () => {
    expect(injectError("int x = 1;", "no_such_pattern")).toBe("int x = 1;");
  });
});
