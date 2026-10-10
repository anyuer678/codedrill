/**
 * ph2drill 转换器单测（scripts/ph2drill.mjs）
 * 覆盖：代码块提取 / 语言映射 / 模块推断 / 难度映射 / 状态过滤 / schemaVersion 契约
 */
import { describe, it, expect } from "vitest";
import { extractCodeBlock, inferModule, convertSolutions, SCHEMA_VERSION } from "../../scripts/ph2drill.mjs";

describe("extractCodeBlock", () => {
  it("提取带语言标注的围栏代码块", () => {
    const r = extractCodeBlock("思路如下：\n\n```python\ns = input()\nprint(s[::-1])\n```\n\n注意边界。");
    expect(r).not.toBeNull();
    expect(r.lang).toBe("python");
    expect(r.code).toBe("s = input()\nprint(s[::-1])\n");
  });

  it("无语言标注时 lang 为 null", () => {
    const r = extractCodeBlock("```\nprint(1)\n```");
    expect(r.lang).toBeNull();
    expect(r.code).toBe("print(1)\n");
  });

  it("无代码块返回 null（诚实跳过的依据）", () => {
    expect(extractCodeBlock("只有文字，没有代码")).toBeNull();
    expect(extractCodeBlock(null)).toBeNull();
    expect(extractCodeBlock(undefined)).toBeNull();
  });

  it("容忍 CRLF 行尾", () => {
    const r = extractCodeBlock("```py\r\na = 1\r\nb = 2\r\n```");
    expect(r.code).toBe("a = 1\nb = 2\n");
  });

  it("只取第一个代码块", () => {
    const r = extractCodeBlock("```py\nfirst\n```\n中间文字\n```py\nsecond\n```");
    expect(r.code).toBe("first\n");
  });
});

describe("inferModule", () => {
  it("循环", () => {
    expect(inferModule("for i in range(10):\n    print(i)")).toBe("loop");
  });
  it("条件", () => {
    expect(inferModule("if x > 0:\n    print(x)")).toBe("condition");
  });
  it("数组", () => {
    expect(inferModule("nums.append(1)\nprint(nums[0])")).toBe("array");
  });
  it("字符串", () => {
    expect(inferModule('s = input()\nprint(" ".join(s.split()[::-1]))')).toBe("string");
  });
  it("函数", () => {
    expect(inferModule("def solve(x):\n    return x")).toBe("function");
  });
  it("兜底 string", () => {
    expect(inferModule("x = 1\ny = x + 1")).toBe("string");
  });
});

describe("convertSolutions", () => {
  const sol = (over = {}) => ({
    id: 7,
    problem_id: 3,
    title: "岛屿数量的 DFS 写法",
    status: "approved",
    problem_difficulty: "MEDIUM",
    problem_title: "岛屿数量",
    language: "python",
    content: "用栈避免递归爆栈：\n\n```python\ngrid = [list(row) for row in lines]\nprint(len(grid))\n```",
    ...over,
  });

  it("approved 题解 → 完整题目对象（契约逐字段断言）", () => {
    const { questions, skipped } = convertSolutions([sol()]);
    expect(questions).toHaveLength(1);
    expect(skipped).toHaveLength(0);
    const q = questions[0];
    expect(q.schemaVersion).toBe(SCHEMA_VERSION);
    expect(q.id).toBe("ph_3_7");
    expect(q.language).toBe("Python");
    expect(q.module).toBe("array");
    expect(q.type).toBe("copy");
    expect(q.difficulty).toBe(2);
    expect(q.code).toContain("grid");
    expect(q.explanation).toContain("岛屿数量的 DFS 写法");
    expect(q.explanation).toContain("#3 岛屿数量");
    expect(q.source).toBe("polycodehub");
    expect(q.source_ref).toBe("polycodehub://solutions/7");
  });

  it("非 approved 默认跳过，--include-pending 放行", () => {
    const pending = sol({ id: 8, status: "pending" });
    expect(convertSolutions([pending]).skipped[0].reason).toContain("pending");
    expect(convertSolutions([pending], { includePending: true }).questions).toHaveLength(1);
  });

  it("无代码块的题解跳过并给出原因", () => {
    const { questions, skipped } = convertSolutions([sol({ content: "纯文字题解" })]);
    expect(questions).toHaveLength(0);
    expect(skipped[0].reason).toContain("代码块");
  });

  it("语言优先级：--lang 强制 > 围栏 > 字段 > 兜底", () => {
    const base = { content: "```\nx = 1\n```" };
    expect(convertSolutions([{ ...base, id: 1 }]).questions[0].language).toBe("Python");
    expect(convertSolutions([{ ...base, id: 2 }], { forceLang: "cpp" }).questions[0].language).toBe("C++");
    expect(convertSolutions([{ content: "```bash\necho hi\n```", id: 3 }]).questions[0].language).toBe("Bash");
  });

  it("未知难度回退 1，未知语言回退 fallbackLang", () => {
    const q = convertSolutions([{ id: 9, problem_id: 1, content: "```kotlin\nfun a(){}\n```" }]).questions[0];
    expect(q.difficulty).toBe(1);
    expect(q.language).toBe("Python");
  });

  it("缺 problem_id 时 id 兜底不炸", () => {
    const q = convertSolutions([{ id: 10, content: "```py\na=1\n```" }]).questions[0];
    expect(q.id).toBe("ph_x_10");
  });

  it("CLI --problem-id 补全 /problems/:id/solutions 导出缺失的字段（真实端点实测）", () => {
    // 该端点 items 不带 problem_id/problem_difficulty —— 与线上实测一致
    const { questions } = convertSolutions(
      [{ id: 1, title: "反转字符串：Python 切片一行解", content: "```python\ns = input()\nprint(s[::-1])\n```" }],
      { problemId: 5 }
    );
    expect(questions[0].id).toBe("ph_5_1");
    expect(questions[0].explanation).toContain("#5");
  });

  it("题解自带 problem_id 优先于 CLI --problem-id", () => {
    const { questions } = convertSolutions(
      [{ id: 2, problem_id: 9, content: "```py\na=1\n```" }],
      { problemId: 5 }
    );
    expect(questions[0].id).toBe("ph_9_2");
  });

  it("非数组输入直接抛 TypeError", () => {
    expect(() => convertSolutions({ id: 1 })).toThrow(TypeError);
  });
});
