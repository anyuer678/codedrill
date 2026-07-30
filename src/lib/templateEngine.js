/**
 * 模板变量填充引擎
 * 负责从模板生成不重复的代码题目
 */

const IDENTIFIERS = ["i", "j", "k", "x", "y", "n", "count", "index", "sum", "result", "temp", "value", "item", "num", "total"];
const CLASS_NAMES = ["Student", "User", "Item", "Product", "Animal", "Car", "Book", "Player", "Order", "Task"];
const METHOD_NAMES = ["calculate", "process", "handle", "validate", "convert", "init", "update", "check", "get", "set"];
const FIELD_NAMES = ["name", "id", "age", "score", "price", "count", "status", "type", "value", "data"];
const STRING_VALUES = ["hello", "world", "test", "input", "output", "error", "success", "default", "result", "message"];

let seed = Date.now();

function random() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(random() * arr.length)];
}

/**
 * 填充模板中的变量
 */
export function fillTemplate(template, variableDefs = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const rule = variableDefs[key];
    if (!rule) {return match;}

    switch (rule.type) {
      case "identifier":
        return randomChoice(rule.pool || IDENTIFIERS);
      case "number":
        return randomInt(rule.range[0], rule.range[1]).toString();
      case "operator":
        return randomChoice(rule.pool || ["<", "<=", "==", "!="]);
      case "step":
        return randomChoice(rule.pool || ["++", "--", "+= 1", "-= 1"]);
      case "boolean":
        return randomChoice(["true", "false"]);
      case "string":
        return `"${randomChoice(rule.pool || STRING_VALUES)}"`;
      case "class_name":
        return randomChoice(rule.pool || CLASS_NAMES);
      case "method_name":
        return randomChoice(rule.pool || METHOD_NAMES);
      case "field_name":
        return randomChoice(rule.pool || FIELD_NAMES);
      case "type":
        return randomChoice(rule.pool || ["int", "double", "String", "boolean"]);
      case "array_type":
        return randomChoice(rule.pool || ["int[]", "String[]", "double[]"]);
      case "code_block":
        return generateCodeBlock(rule.templates);
      default:
        return match;
    }
  });
}

/**
 * 生成代码块
 */
function generateCodeBlock(templates) {
  if (!templates || templates.length === 0) {return "// TODO";}
  return randomChoice(templates);
}

/**
 * 从模板生成题目
 */
export function generateQuestion(templateDef, overrides = {}) {
  const code = fillTemplate(templateDef.template, templateDef.variables);

  return {
    id: `gen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    language: templateDef.language,
    module: templateDef.module,
    subSkill: templateDef.subSkill,
    type: templateDef.type || "copy",
    difficulty: templateDef.difficulty || 1,
    code,
    explanation: templateDef.explanation || "",
    ...overrides,
  };
}

/**
 * 批量生成不重复题目
 */
export function generateQuestions(templateDefs, count = 10) {
  const questions = [];
  const seen = new Set();
  let attempts = 0;
  const maxAttempts = count * 10;

  while (questions.length < count && attempts < maxAttempts) {
    const template = randomChoice(templateDefs);
    const question = generateQuestion(template);

    if (!seen.has(question.code)) {
      seen.add(question.code);
      questions.push(question);
    }
    attempts++;
  }

  return questions;
}

/**
 * 为填空题创建空白
 */
export function createBlanks(code, blankPositions) {
  let result = code;
  const answers = [];

  for (const pos of blankPositions) {
    const pattern = getBlankPattern(pos.type);
    if (!pattern) {continue;}

    const match = result.match(pattern.regex);
    if (match) {
      answers.push({ type: pos.type, answer: match[pattern.group] });
      result = result.replace(match[pattern.group], "___");
    }
  }

  return { code: result, answers };
}

function getBlankPattern(type) {
  const patterns = {
    variable: { regex: /(?:int|String|double|boolean|var|let)\s+(\w+)/, group: 1 },
    condition: { regex: /(?:if|while)\s*\((.+?)\)/, group: 1 },
    operator: { regex: /([+\-*/%&|^<>=!]+)/, group: 1 },
    number: { regex: /\b(\d+)\b/, group: 1 },
    method_call: { regex: /\.(\w+)\(/, group: 1 },
    return_value: { regex: /return\s+(.+?);/, group: 1 },
  };
  return patterns[type] || null;
}

/**
 * 注入错误到代码
 */
export function injectError(code, errorType) {
  switch (errorType) {
    case "missing_semicolon":
      return code.replace(/;(\s*$)/m, "$1");
    case "wrong_operator":
      return code.replace(/<([^=])/, "<=$1").replace(/>([^=])/, ">=$1");
    case "off_by_one":
      return code.replace(/<\s*(\w+)/, "<= $1");
    case "wrong_braces":
      return code.replace(/\{\s*\n/g, "\n").replace(/\n\s*\}/g, "");
    case "missing_return":
      return code.replace(/return\s+/, "");
    case "wrong_variable":
      return code.replace(/\b(\w+)\b/, (m) => `${m  }_wrong`);
    default:
      return code;
  }
}

export default {
  fillTemplate,
  generateQuestion,
  generateQuestions,
  createBlanks,
  injectError,
};
