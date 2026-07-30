/**
 * 五维错误分类器
 * 维度：语法、结构、API、逻辑、手速
 */

const ERROR_DIMENSIONS = {
  syntax: {
    label: "语法错误",
    description: "缺少分号、括号、关键字拼写错误",
    patterns: [
      { id: "missing_semicolon", regex: /[^;]\s*$/, check: (line) => !line.trim().endsWith(";") && !line.trim().endsWith("{") && !line.trim().endsWith("}") },
      { id: "missing_bracket", regex: /[({]/, check: (line) => { const open = (line.match(/[({]/g) || []).length; const close = (line.match(/[)}]/g) || []).length; return open !== close; } },
      { id: "typo_keyword", keywords: ["pubilc", "viod", "retrun", "flase", "ture", "clss", "staitc"], check: (line) => { const words = line.split(/\s+/); return words.some(w => ["pubilc", "viod", "retrun", "flase", "ture", "clss", "staitc"].includes(w.toLowerCase())); } },
    ],
  },
  structure: {
    label: "结构错误",
    description: "代码块嵌套、缩进、作用域问题",
    patterns: [
      { id: "wrong_nesting", check: (line, prevLine) => { const indent = line.search(/\S/); const prevIndent = prevLine ? prevLine.search(/\S/) : 0; return indent - prevIndent > 4 && !prevLine?.trim().endsWith("{"); } },
      { id: "missing_block", check: (line) => { return /(if|for|while|else)\s*[^{]*$/.test(line.trim()) && !line.includes("//"); } },
    ],
  },
  api: {
    label: "API错误",
    description: "方法名、参数、返回类型错误",
    patterns: [
      { id: "wrong_method", check: (line) => { return /\.(legth|lenght|sizee|pritn|toStirng)\s*\(/.test(line); } },
      { id: "wrong_params", check: (line) => { return /\.(substring|indexOf)\s*\(\s*\)/.test(line); } },
    ],
  },
  logic: {
    label: "逻辑错误",
    description: "条件判断、运算符、循环逻辑错误",
    patterns: [
      { id: "wrong_comparison", check: (line) => { return /if\s*\([^)]*=[^=][^)]*\)/.test(line); } },
      { id: "off_by_one", check: (line) => { return /<=\s*(\.length|\.size\(\))/.test(line); } },
      { id: "wrong_return", check: (line) => { return /return\s+(null|0|false)\s*;/.test(line) && line.includes("boolean"); } },
    ],
  },
  typo: {
    label: "手速错误",
    description: "单字符偏差、多余/缺失字符",
    patterns: [
      { id: "wrong_char", check: (line, refLine) => { if (!refLine || line.length !== refLine.length) {return false;} let diff = 0; for (let i = 0; i < line.length; i++) { if (line[i] !== refLine[i]) {diff++;} } return diff === 1; } },
      { id: "extra_char", check: (line, refLine) => { return refLine && line.length === refLine.length + 1; } },
      { id: "missing_char", check: (line, refLine) => { return refLine && line.length === refLine.length - 1; } },
    ],
  },
};

/**
 * 分类单行错误
 */
export function classifyLineError(submittedLine, referenceLine) {
  const submitted = submittedLine.trim();
  const reference = referenceLine.trim();

  if (submitted === reference) {
    return { dimension: null, confidence: 1, detail: null };
  }

  const scores = {};

  for (const [dimKey, dim] of Object.entries(ERROR_DIMENSIONS)) {
    scores[dimKey] = 0;
    for (const pattern of dim.patterns) {
      try {
        if (pattern.check(submitted, reference)) {
          scores[dimKey] += 1;
        }
      } catch {
        // ignore
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return { dimension: "typo", confidence: 0.5, detail: "unknown_difference" };
  }

  const dimension = Object.entries(scores).find(([, s]) => s === maxScore)[0];
  return {
    dimension,
    confidence: Math.min(maxScore / 2, 1),
    detail: ERROR_DIMENSIONS[dimension].patterns[0]?.id || null,
  };
}

/**
 * 分类整段代码错误
 */
export function classifyCodeError(submittedCode, referenceCode) {
  const submittedLines = submittedCode.split("\n");
  const referenceLines = referenceCode.split("\n");

  const results = [];
  const maxLines = Math.max(submittedLines.length, referenceLines.length);

  for (let i = 0; i < maxLines; i++) {
    const submitted = submittedLines[i] || "";
    const reference = referenceLines[i] || "";

    if (submitted.trim() !== reference.trim()) {
      const classification = classifyLineError(submitted, reference);
      results.push({
        line: i + 1,
        submitted,
        reference,
        ...classification,
      });
    }
  }

  return aggregateErrors(results);
}

/**
 * 聚合错误统计
 */
function aggregateErrors(lineResults) {
  const breakdown = {
    syntax: { count: 0, lines: [] },
    structure: { count: 0, lines: [] },
    api: { count: 0, lines: [] },
    logic: { count: 0, lines: [] },
    typo: { count: 0, lines: [] },
  };

  for (const result of lineResults) {
    if (result.dimension && breakdown[result.dimension]) {
      breakdown[result.dimension].count++;
      breakdown[result.dimension].lines.push(result.line);
    }
  }

  const primaryError = Object.entries(breakdown)
    .filter(([, v]) => v.count > 0)
    .sort(([, a], [, b]) => b.count - a.count)[0];

  return {
    totalErrors: lineResults.length,
    primaryType: primaryError ? primaryError[0] : null,
    primaryLabel: primaryError ? ERROR_DIMENSIONS[primaryError[0]].label : null,
    breakdown,
    details: lineResults,
  };
}

/**
 * 获取错误维度信息
 */
export function getErrorDimensions() {
  return ERROR_DIMENSIONS;
}

export default {
  classifyLineError,
  classifyCodeError,
  getErrorDimensions,
};
