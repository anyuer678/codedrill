import { describe, it, expect } from "vitest";
import { tokenizeLine } from "@/lib/trainTyping";

describe("trainTyping tokenizeLine", () => {
  it("空行返回 empty token", () => {
    const t = tokenizeLine("", "Java");
    expect(t[0].type).toBe("empty");
  });

  it("关键字识别为 keyword", () => {
    const t = tokenizeLine("public class Foo", "Java").filter((x) => x.type !== "space");
    expect(t.some((x) => x.text === "public" && x.type === "keyword")).toBe(true);
  });

  it("字符串 token", () => {
    const t = tokenizeLine('String s = "hi";', "Java").filter((x) => x.type === "string");
    expect(t.length).toBeGreaterThan(0);
  });
});
