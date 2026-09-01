/**
 * 训练页逐词打字引擎：行词法分析 + 逐词对比。
 * 从 TrainView.vue 抽出的纯函数（原实现同时被 ChallengeView/SrsView 复制的
 * 版本后续应收敛到这里）。
 */

const KEYWORD_SETS = {
  Java: ["for", "while", "if", "else", "do", "switch", "case", "break", "continue", "return", "int", "double", "float", "char", "String", "boolean", "void", "class", "public", "private", "static", "new", "true", "false", "null"],
  Python: ["for", "while", "if", "else", "elif", "def", "class", "return", "import", "from", "True", "False", "None", "and", "or", "not", "in", "is", "try", "except", "finally", "with", "as", "yield", "lambda", "pass", "break", "continue"],
  "C++": ["for", "while", "if", "else", "do", "switch", "case", "break", "continue", "return", "int", "double", "float", "char", "bool", "void", "class", "public", "private", "protected", "static", "const", "new", "delete", "true", "false", "nullptr", "auto", "virtual", "template", "typename"],
  JavaScript: ["for", "while", "if", "else", "do", "switch", "case", "break", "continue", "return", "const", "let", "var", "function", "class", "new", "true", "false", "null", "undefined", "typeof", "instanceof", "async", "await", "import", "export", "default", "from", "try", "catch", "finally", "throw", "of", "in", "yield", "this", "super", "extends"],
}

const BUILTIN_SETS = {
  Java: ["System", "Math", "String", "Scanner", "ArrayList", "HashMap"],
  Python: ["print", "len", "range", "int", "str", "float", "list", "dict", "set", "type", "input", "sorted", "enumerate", "zip", "map", "filter", "sum", "max", "min"],
  "C++": ["cout", "cin", "endl", "vector", "string", "map", "set", "pair", "sort", "reverse", "find", "max", "min"],
  JavaScript: ["console", "Math", "Array", "Object", "Map", "Set", "Promise", "Date", "JSON", "parseInt", "parseFloat", "setTimeout", "setInterval", "fetch", "require"],
}

/**
 * 将一行代码分割为 token（词法单元）。
 * 返回 [{ text, type }]，type ∈ keyword/builtin/number/type/identifier/space/delimiter/operator/string/empty
 */
export function tokenizeLine(line, lang = "Java") {
  if (!line) {return [{ text: " ", type: "empty" }];}

  const tokens = [];
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    // 字符串内
    if (inString) {
      current += ch;
      if (ch === stringChar && (i === 0 || line[i - 1] !== "\\") && (i < 2 || line[i - 2] !== "\\")) {
        tokens.push({ text: current, type: "string" });
        current = "";
        inString = false;
      }
      continue;
    }

    // 字符串开始
    if (ch === '"' || ch === "'") {
      if (current) {
        tokens.push({ text: current, type: classifyToken(current, lang) });
        current = "";
      }
      inString = true;
      stringChar = ch;
      current = ch;
      continue;
    }

    // 空格
    if (/\s/.test(ch)) {
      if (current) {
        tokens.push({ text: current, type: classifyToken(current, lang) });
        current = "";
      }
      tokens.push({ text: ch, type: "space" });
      continue;
    }

    // 分隔符
    if (/[{}()\[\];,.]/.test(ch)) {
      if (current) {
        tokens.push({ text: current, type: classifyToken(current, lang) });
        current = "";
      }
      tokens.push({ text: ch, type: "delimiter" });
      continue;
    }

    // 运算符
    if (/[+\-*/%=<>!&|^~?:]/.test(ch)) {
      if (current && /[+\-*/%=<>!&|^~?:]/.test(current[current.length - 1])) {
        current += ch;
      } else {
        if (current) {
          tokens.push({ text: current, type: classifyToken(current, lang) });
          current = "";
        }
        current = ch;
      }
      continue;
    }

    // 普通字符
    current += ch;
  }

  if (current) {
    tokens.push({ text: current, type: classifyToken(current, lang) });
  }

  return tokens.length > 0 ? tokens : [{ text: " ", type: "empty" }];
}

export function classifyToken(token, lang = "Java") {
  const keywords = KEYWORD_SETS[lang] || KEYWORD_SETS.Java;
  const builtins = BUILTIN_SETS[lang] || BUILTIN_SETS.Java;

  if (keywords.includes(token)) {return "keyword";}
  if (builtins.includes(token)) {return "builtin";}
  if (/^\d+$/.test(token)) {return "number";}
  if (/^[A-Z]/.test(token)) {return "type";}
  if (token === " ") {return "space";}
  return "identifier";
}

/**
 * 逐词对比参考行与输入行。
 * includePending=true 时，输入未覆盖到的参考 token 以 status:"pending" 返回
 * （用于已提交行的展示）；否则跳过（用于当前输入行的实时对比）。
 * 返回 [{ text, type, status }]，status ∈ correct/wrong/extra/pending
 */
export function diffLineTokens(refTokens, inputTokens, { includePending = false } = {}) {
  const result = [];
  const maxLen = Math.max(refTokens.length, inputTokens.length);

  for (let i = 0; i < maxLen; i++) {
    const ref = refTokens[i];
    const inp = inputTokens[i];

    if (!inp) {
      if (includePending) {
        result.push({ text: ref.text, type: ref.type, status: "pending" });
      }
      // 还没输入到这
    } else if (!ref) {
      result.push({ text: inp.text, type: inp.type, status: "extra" });
    } else if (ref.text === inp.text) {
      result.push({ text: inp.text, type: inp.type, status: "correct" });
    } else {
      result.push({ text: inp.text, type: inp.type, status: "wrong" });
    }
  }

  return result;
}

/** 已提交行正误判定（trim 后比较），返回 "✓" | "✗" | "" */
export function lineEqualsTrimmed(refLine, inputLine) {
  if (!refLine || !inputLine) {return "";}
  return refLine.trim() === inputLine.trim() ? "✓" : "✗";
}
