#!/usr/bin/env node
/**
 * ph2drill — polycodehub 题解 → codedrill 自定义题库 转换器
 *
 * 学习闭环（polycodehub ↔ codedrill）的正向链路：
 *   polycodehub 刷题 → AC 后发题解 → 管理员审核 approved
 *   → 导出题解 JSON（管理端 GET /admin/solutions 或 GET /problems/:id/solutions）
 *   → 本脚本转换为 codedrill 自定义题库 JSON
 *   → codedrill「自定义题库」页导入 → 抄写训练强化肌肉记忆
 *
 * 输入格式（polycodehub 题解导出，数组，字段容忍缺失）：
 *   [{ id, problem_id, title, content, status, problem_title?, problem_difficulty? }, ...]
 *
 * 输出格式（codedrill 自定义题库导入格式，顶层必须是数组）：
 *   [{ schemaVersion, id, language, module, type, difficulty, code, explanation,
 *      source, source_ref }, ...]
 *   schemaVersion 直接落在每道题上（导入端要求顶层数组，版本字段只能内联）。
 *
 * 用法：
 *   node scripts/ph2drill.mjs solutions.json -o drill.json [--lang Python] [--include-pending]
 *
 * 诚实边界：
 *   - 只转换含 ``` 代码块的题解；无代码块的跳过并在 stderr 报告原因
 *   - status 非 approved 的题解默认跳过（--include-pending 显式放行）
 */

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const SCHEMA_VERSION = 1;

// polycodehub 判题语言（cpp/python/java/node）与代码块围栏语言 → codedrill 语言名
const LANG_MAP = {
  python: "Python", py: "Python",
  cpp: "C++", "c++": "C++",
  java: "Java",
  javascript: "JavaScript", js: "JavaScript", node: "JavaScript",
  typescript: "TypeScript", ts: "TypeScript",
  bash: "Bash", sh: "Bash", shell: "Bash",
  sql: "SQL",
};

const DIFF_MAP = { EASY: 1, MEDIUM: 2, HARD: 3 };

/**
 * 从题解 markdown 中提取第一个 ``` 围栏代码块
 * @returns {{ code: string, lang: string | null } | null} 无代码块时返回 null
 */
export function extractCodeBlock(content) {
  if (typeof content !== "string") {return null;}
  const match = content.match(/```([\w+-]*)[ \t]*\r?\n([\s\S]*?)```/);
  if (!match) {return null;}
  const lang = match[1] ? match[1].toLowerCase() : null;
  // 去掉行尾 \r（Windows 编辑的题解），保留内部缩进
  const code = match[2].replace(/\r\n/g, "\n").replace(/\s+$/, "\n");
  return { code, lang: lang || null };
}

/**
 * 按关键词启发式推断 codedrill 训练模块（loop/condition/array/string/function）
 * 顺序即优先级：列表推导（归数组）> 循环 > 条件 > 数组 > 字符串 > 函数
 */
export function inferModule(code) {
  if (/\[[^\]\n]*\bfor\b[^\]\n]*\]/.test(code)) {return "array";} // 列表推导
  if (/\bfor\b|\bwhile\b|\brange\s*\(|do\s*\{/.test(code)) {return "loop";}
  if (/\bif\b|\belif\b|\belse\b|\bswitch\b|\bcase\b/.test(code)) {return "condition";}
  if (/\[[\w.]+\]|\bappend\s*\(|\bpush\s*\(|List<|vector<|\barr\b|\bnums\b|\blist\s*\(/.test(code)) {return "array";}
  if (/\.split\s*\(|\.join\s*\(|\.substring|\.substr|\.slice\s*\(|\.charAt|\.reverse\s*\(|reversed\s*\(/.test(code)) {return "string";}
  if (/\bdef\s+\w+|\bfunction\b|\bfn\s+\w+|=>|(?:public|private|static)[\w\s<>[\]]*\s\w+\s*\(/.test(code)) {return "function";}
  return "string";
}

function toCodedrillLang(raw, fallback) {
  if (!raw) {return fallback;}
  return LANG_MAP[String(raw).toLowerCase()] || fallback;
}

/**
 * 转换核心：polycodehub 题解数组 → codedrill 自定义题库数组
 * 语言优先级：--lang 强制指定 > 代码块围栏 > 题解 language 字段 > fallbackLang
 * @param {Array} solutions 题解导出数组
 * @param {object} [opts] { forceLang?, fallbackLang?, includePending? }
 * @returns {{ questions: Array, skipped: Array<{ id: *, reason: string }> }}
 */
export function convertSolutions(solutions, opts = {}) {
  const { forceLang = null, fallbackLang = "Python", includePending = false } = opts;
  const questions = [];
  const skipped = [];

  if (!Array.isArray(solutions)) {
    throw new TypeError("输入必须是题解数组（JSON 顶层为数组）");
  }

  for (const s of solutions) {
    const sid = s?.id ?? "(no-id)";

    if (!includePending && s?.status && s.status !== "approved") {
      skipped.push({ id: sid, reason: `status=${s.status}（非 approved）` });
      continue;
    }
    const block = extractCodeBlock(s?.content);
    if (!block) {
      skipped.push({ id: sid, reason: "content 中无 ``` 代码块" });
      continue;
    }

    const language = toCodedrillLang(forceLang, null)
      || toCodedrillLang(block.lang, null)
      || toCodedrillLang(s?.language, null)
      || toCodedrillLang(fallbackLang, "Python");
    const difficulty = DIFF_MAP[String(s?.problem_difficulty || "").toUpperCase()] || 1;
    const problemRef = s?.problem_id != null ? `#${s.problem_id}` : "未知题目";

    questions.push({
      schemaVersion: SCHEMA_VERSION,
      id: `ph_${s?.problem_id ?? "x"}_${s?.id ?? Date.now()}`,
      language,
      module: inferModule(block.code),
      type: "copy",
      difficulty,
      code: block.code,
      explanation: `来自 polycodehub 题解「${s?.title || "无标题"}」（题目 ${problemRef}${s?.problem_title ? ` ${s.problem_title}` : ""}）`,
      source: "polycodehub",
      source_ref: `polycodehub://solutions/${s?.id ?? "unknown"}`,
    });
  }

  return { questions, skipped };
}

// ---- CLI ----

function isMain() {
  try {
    return import.meta.url === pathToFileURL(process.argv[1] || "").href;
  } catch {
    return false;
  }
}

if (isMain()) {
  const args = process.argv.slice(2);
  const flags = { out: "drill.custom.json", lang: null, includePending: false };
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-o" || args[i] === "--out") {flags.out = args[++i];}
    else if (args[i] === "--lang") {flags.lang = args[++i];}
    else if (args[i] === "--include-pending") {flags.includePending = true;}
    else {positional.push(args[i]);}
  }

  if (positional.length < 1) {
    console.error("用法: node scripts/ph2drill.mjs <solutions.json> [-o out.json] [--lang Python] [--include-pending]");
    process.exit(2);
  }

  try {
    const solutions = JSON.parse(readFileSync(positional[0], "utf8"));
    const { questions, skipped } = convertSolutions(solutions, {
      forceLang: flags.lang,
      fallbackLang: "Python",
      includePending: flags.includePending,
    });
    writeFileSync(flags.out, JSON.stringify(questions, null, 2) + "\n", "utf8");

    console.log(`转换完成: ${questions.length} 题 → ${flags.out}`);
    for (const q of questions) {
      console.log(`  [${q.language}/${q.module}] ${q.id} (difficulty=${q.difficulty})`);
    }
    for (const s of skipped) {
      console.error(`  跳过 #${s.id}: ${s.reason}`);
    }
    if (questions.length === 0) {
      console.error("警告: 没有生成任何题目（全部被跳过）");
      process.exit(1);
    }
  } catch (err) {
    console.error(`ph2drill 失败: ${err.message}`);
    process.exit(1);
  }
}
