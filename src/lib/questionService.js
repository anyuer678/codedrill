/**
 * 题目数据服务
 * 负责加载题库、生成题目、管理本地数据
 * 
 * 题库 JSON 按需动态加载（Vite 自动 code-split），避免全量打进首屏。
 */

import codeDb from "../../core/code_db.json";
import templates from "../../core/templates.json";
import errorPatterns from "../../core/error_patterns.json";
import fillPoints from "../../core/fill_points.json";
import { injectError } from "./templateEngine";

// ---- 懒加载：动态 import 映射 ----

const importMap = {
  Java: {
    loop: () => import("../../core/questions/java_loop.json"),
    condition: () => import("../../core/questions/java_condition.json"),
    array: () => import("../../core/questions/java_array.json"),
    string: () => import("../../core/questions/java_string.json"),
    function: () => import("../../core/questions/java_function.json"),
  },
  Python: {
    loop: () => import("../../core/questions/python_loop.json"),
    condition: () => import("../../core/questions/python_condition.json"),
    array: () => import("../../core/questions/python_array.json"),
    string: () => import("../../core/questions/python_string.json"),
    function: () => import("../../core/questions/python_function.json"),
  },
  "C++": {
    loop: () => import("../../core/questions/cpp_loop.json"),
    condition: () => import("../../core/questions/cpp_condition.json"),
    array: () => import("../../core/questions/cpp_array.json"),
    string: () => import("../../core/questions/cpp_string.json"),
    function: () => import("../../core/questions/cpp_function.json"),
  },
  JavaScript: {
    loop: () => import("../../core/questions/javascript_loop.json"),
    condition: () => import("../../core/questions/javascript_condition.json"),
    array: () => import("../../core/questions/javascript_array.json"),
    string: () => import("../../core/questions/javascript_string.json"),
    function: () => import("../../core/questions/javascript_function.json"),
  },
  TypeScript: {
    loop: () => import("../../core/questions/typescript_loop.json"),
    condition: () => import("../../core/questions/typescript_condition.json"),
    array: () => import("../../core/questions/typescript_array.json"),
    string: () => import("../../core/questions/typescript_string.json"),
    function: () => import("../../core/questions/typescript_function.json"),
  },
  Bash: {
    loop: () => import("../../core/questions/bash_loop.json"),
    condition: () => import("../../core/questions/bash_condition.json"),
    array: () => import("../../core/questions/bash_array.json"),
    string: () => import("../../core/questions/bash_string.json"),
    function: () => import("../../core/questions/bash_function.json"),
  },
  SQL: {
    loop: () => import("../../core/questions/sql_loop.json"),
    condition: () => import("../../core/questions/sql_condition.json"),
    array: () => import("../../core/questions/sql_array.json"),
    string: () => import("../../core/questions/sql_string.json"),
    function: () => import("../../core/questions/sql_function.json"),
  },
};

// ---- 缓存：已加载的模块 ----

const cache = {}; // { "Java:loop": [{...}, ...], ... }

function wrapQuestions(data) {
  if (!data || !data.questions) {
    return [];
  }
  return data.questions.map((q) => ({
    ...q,
    language: q.language || data.language,
    module: q.module || data.module,
  }));
}

async function ensureLoaded(lang, mod) {
  const key = `${lang}:${mod}`;
  if (cache[key]) return;

  const loader = importMap[lang]?.[mod];
  if (!loader) {
    cache[key] = [];
    return;
  }

  const mod_ = await loader();
  const default_ = mod_.default || mod_;
  const questions = wrapQuestions(default_);

  // class 使用 function 题库，io 使用 array 题库
  cache[key] = questions;
  if (mod === "function") {
    cache[`${lang}:class`] = questions;
  }
  if (mod === "array") {
    cache[`${lang}:io`] = questions;
  }
}

async function ensureLangLoaded(lang) {
  const mods = importMap[lang];
  if (!mods) return;
  await Promise.all(Object.keys(mods).map((m) => ensureLoaded(lang, m)));
}

// ---- 状态（保留兼容） ----

const state = {
  templates: templates.templates || {},
  errorPatterns: errorPatterns.patterns || [],
  fillPoints: fillPoints.blank_positions || [],
  loaded: true,
};

export async function getQuestions(language, module, count = 10, difficulty = null) {
  await ensureLoaded(language, module);
  let pool = cache[`${language}:${module}`] || [];

  if (difficulty) {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  if (pool.length === 0) {
    console.log("Pool empty, returning fallback questions");
    return generateFallbackQuestions(language, module, count);
  }

  return shuffle([...pool]).slice(0, count);
}

export async function generateFillQuestions(language, module, count = 10) {
  const baseQuestions = await getQuestions(language, module, count);
  const blankTypes = state.fillPoints;

  return baseQuestions.map((q, i) => {
    const blankType = blankTypes[i % blankTypes.length];
    const { code, answers } = createBlank(q.code, blankType);

    return {
      ...q,
      type: "fill_blank",
      code,
      answer: answers.length > 0 ? answers[0].answer : "",
      blank_type: blankType.id,
    };
  });
}

export async function generateDebugQuestions(language, count = 10) {
  await ensureLangLoaded(language);
  const allQuestions = [];

  for (const mod of codeDb.modules) {
    const pool = cache[`${language}:${mod}`] || [];
    allQuestions.push(...pool);
  }

  if (allQuestions.length === 0) {
    return generateFallbackQuestions(language, "debug", count);
  }

  const patterns = state.errorPatterns.filter((p) => p.applicable_languages.includes(language));

  if (patterns.length === 0) {
    return shuffle([...allQuestions]).slice(0, count).map((q) => ({
      ...q,
      type: "debug",
      code_with_bug: q.code,
      correct_code: q.code,
      bug_type: "syntax",
      explanation: "代码纠错练习",
    }));
  }

  return shuffle([...allQuestions]).slice(0, count).map((q, i) => {
    const pattern = patterns[i % patterns.length];
    const buggyCode = injectError(q.code, pattern.id);

    return {
      ...q,
      type: "debug",
      code_with_bug: buggyCode,
      correct_code: q.code,
      bug_type: pattern.category,
      explanation: pattern.description,
    };
  });
}

function generateFallbackQuestions(language, module, count) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      id: `fallback_${module}_${i}`,
      language,
      module,
      type: "copy",
      difficulty: 1,
      code: `// ${language} ${module} 示例\n// TODO: 添加更多题目`,
      explanation: "待补充题目",
    });
  }
  return questions;
}

function createBlank(code, blankType) {
  const lines = code.split("\n");
  const answers = [];
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    if (modified) {break;}
    const line = lines[i];

    switch (blankType.id) {
      case "variable_name": {
        const match = line.match(/(?:int|String|double|boolean|var|let|def)\s+(\w+)/);
        if (match) {
          answers.push({ type: "variable", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
        break;
      }
      case "condition":
      case "loop_condition": {
        const match = line.match(/(?:if|while|for)\s*\((.+?)\)/);
        if (match) {
          answers.push({ type: "condition", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
        break;
      }
      case "operator": {
        const match = line.match(/([+\-*/%&|^<>=!]+)/);
        if (match && match[1].length <= 2) {
          answers.push({ type: "operator", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
        break;
      }
      case "function_param": {
        const match = line.match(/(?:int|String|double|boolean|float|long)\s+(\w+)\s*[,)]/);
        if (match) {
          answers.push({ type: "param", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
        break;
      }
      case "method_name": {
        const match = line.match(/(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\(/);
        if (match) {
          answers.push({ type: "method", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
        break;
      }
      case "return_value": {
        const match = line.match(/return\s+(.+?);/);
        if (match) {
          answers.push({ type: "return", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
        break;
      }
      case "array_index": {
        const match = line.match(/\[(\w+)\]/);
        if (match) {
          answers.push({ type: "index", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
        break;
      }
      default: {
        const match = line.match(/\b(\w+)\b/);
        if (match) {
          answers.push({ type: "identifier", answer: match[1] });
          lines[i] = line.replace(match[1], "___");
          modified = true;
        }
      }
    }
  }

  return { code: lines.join("\n"), answers };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default {
  getQuestions,
  generateFillQuestions,
  generateDebugQuestions,
};
