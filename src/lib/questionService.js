/**
 * 题目数据服务
 * 负责加载题库、生成题目、管理本地数据
 */

import codeDb from "../../core/code_db.json";
import templates from "../../core/templates.json";
import errorPatterns from "../../core/error_patterns.json";
import fillPoints from "../../core/fill_points.json";
import { injectError } from "./templateEngine";

import javaLoop from "../../core/questions/java_loop.json";
import javaCondition from "../../core/questions/java_condition.json";
import javaArray from "../../core/questions/java_array.json";
import javaString from "../../core/questions/java_string.json";
import javaFunction from "../../core/questions/java_function.json";

import pythonLoop from "../../core/questions/python_loop.json";
import pythonCondition from "../../core/questions/python_condition.json";
import pythonArray from "../../core/questions/python_array.json";
import pythonString from "../../core/questions/python_string.json";
import pythonFunction from "../../core/questions/python_function.json";

import cppLoop from "../../core/questions/cpp_loop.json";
import cppCondition from "../../core/questions/cpp_condition.json";
import cppArray from "../../core/questions/cpp_array.json";
import cppString from "../../core/questions/cpp_string.json";
import cppFunction from "../../core/questions/cpp_function.json";

import jsLoop from "../../core/questions/javascript_loop.json";
import jsCondition from "../../core/questions/javascript_condition.json";
import jsArray from "../../core/questions/javascript_array.json";
import jsString from "../../core/questions/javascript_string.json";
import jsFunction from "../../core/questions/javascript_function.json";

import tsLoop from "../../core/questions/typescript_loop.json";
import tsCondition from "../../core/questions/typescript_condition.json";
import tsArray from "../../core/questions/typescript_array.json";
import tsString from "../../core/questions/typescript_string.json";
import tsFunction from "../../core/questions/typescript_function.json";

import linuxLoop from "../../core/questions/linux_loop.json";
import linuxCondition from "../../core/questions/linux_condition.json";
import linuxArray from "../../core/questions/linux_array.json";
import linuxString from "../../core/questions/linux_string.json";
import linuxFunction from "../../core/questions/linux_function.json";

import sqlLoop from "../../core/questions/sql_loop.json";
import sqlCondition from "../../core/questions/sql_condition.json";
import sqlArray from "../../core/questions/sql_array.json";
import sqlString from "../../core/questions/sql_string.json";
import sqlFunction from "../../core/questions/sql_function.json";

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

const state = {
  questions: {
    Java: {
      loop: wrapQuestions(javaLoop),
      condition: wrapQuestions(javaCondition),
      array: wrapQuestions(javaArray),
      string: wrapQuestions(javaString),
      function: wrapQuestions(javaFunction),
      class: wrapQuestions(javaFunction),  // class 使用 function 题库
      io: wrapQuestions(javaArray),  // io 使用 array 题库
    },
    Python: {
      loop: wrapQuestions(pythonLoop),
      condition: wrapQuestions(pythonCondition),
      array: wrapQuestions(pythonArray),
      string: wrapQuestions(pythonString),
      function: wrapQuestions(pythonFunction),
      class: wrapQuestions(pythonFunction),
      io: wrapQuestions(pythonArray),
    },
    "C++": {
      loop: wrapQuestions(cppLoop),
      condition: wrapQuestions(cppCondition),
      array: wrapQuestions(cppArray),
      string: wrapQuestions(cppString),
      function: wrapQuestions(cppFunction),
      class: wrapQuestions(cppFunction),
      io: wrapQuestions(cppArray),
    },
    JavaScript: {
      loop: wrapQuestions(jsLoop),
      condition: wrapQuestions(jsCondition),
      array: wrapQuestions(jsArray),
      string: wrapQuestions(jsString),
      function: wrapQuestions(jsFunction),
      class: wrapQuestions(jsFunction),
      io: wrapQuestions(jsArray),
    },
    TypeScript: {
      loop: wrapQuestions(tsLoop),
      condition: wrapQuestions(tsCondition),
      array: wrapQuestions(tsArray),
      string: wrapQuestions(tsString),
      function: wrapQuestions(tsFunction),
      class: wrapQuestions(tsFunction),
      io: wrapQuestions(tsArray),
    },
    Linux: {
      loop: wrapQuestions(linuxLoop),
      condition: wrapQuestions(linuxCondition),
      array: wrapQuestions(linuxArray),
      string: wrapQuestions(linuxString),
      function: wrapQuestions(linuxFunction),
      class: wrapQuestions(linuxFunction),
      io: wrapQuestions(linuxArray),
    },
    SQL: {
      loop: wrapQuestions(sqlLoop),
      condition: wrapQuestions(sqlCondition),
      array: wrapQuestions(sqlArray),
      string: wrapQuestions(sqlString),
      function: wrapQuestions(sqlFunction),
      class: wrapQuestions(sqlFunction),
      io: wrapQuestions(sqlArray),
    },
  },
  templates: templates.templates || {},
  errorPatterns: errorPatterns.patterns || [],
  fillPoints: fillPoints.blank_positions || [],
  loaded: true,
};

export async function getQuestions(language, module, count = 10, difficulty = null) {
  let pool = state.questions[language]?.[module] || [];

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
  const allQuestions = [];

  for (const mod of codeDb.modules) {
    const pool = state.questions[language]?.[mod] || [];
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
