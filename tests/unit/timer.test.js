import { describe, it, expect } from "vitest";
import { formatTime, getSpeedRating } from "@/lib/timer";

describe("formatTime", () => {
  it("格式化秒数为 mm:ss", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(3661)).toBe("61:01");
  });

  it("处理小数", () => {
    expect(formatTime(5.5)).toBe("00:05");
  });
});

describe("getSpeedRating", () => {
  it("快速应该返回 S", () => {
    expect(getSpeedRating(3, 1)).toBe("S");
  });

  it("正常应该返回 A", () => {
    expect(getSpeedRating(10, 1)).toBe("A");
  });

  it("慢速应该返回 B", () => {
    expect(getSpeedRating(20, 1)).toBe("B");
  });

  it("很慢应该返回 C", () => {
    expect(getSpeedRating(40, 1)).toBe("C");
  });

  it("不同难度阈值不同", () => {
    expect(getSpeedRating(20, 2)).toBe("A");
    expect(getSpeedRating(20, 3)).toBe("A");
  });
});
