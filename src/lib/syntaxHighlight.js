/**
 * 代码语法着色工具
 * 纯本地实现，不依赖外部库
 */

const KEYWORDS = {
  java: [
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
    "class", "const", "continue", "default", "do", "double", "else", "enum",
    "extends", "final", "finally", "float", "for", "goto", "if", "implements",
    "import", "instanceof", "int", "interface", "long", "native", "new",
    "package", "private", "protected", "public", "return", "short", "static",
    "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
    "transient", "try", "void", "volatile", "while",
  ],
  python: [
    "and", "as", "assert", "break", "class", "continue", "def", "del", "elif",
    "else", "except", "False", "finally", "for", "from", "global", "if",
    "import", "in", "is", "lambda", "None", "nonlocal", "not", "or", "pass",
    "raise", "return", "True", "try", "while", "with", "yield",
  ],
  cpp: [
    "alignas", "alignof", "and", "asm", "auto", "bool", "break", "case",
    "catch", "char", "char8_t", "char16_t", "char32_t", "class", "concept",
    "const", "consteval", "constexpr", "constinit", "const_cast", "continue",
    "co_await", "co_return", "co_yield", "decltype", "default", "delete", "do",
    "double", "dynamic_cast", "else", "enum", "explicit", "export", "extern",
    "false", "float", "for", "friend", "goto", "if", "inline", "int", "long",
    "mutable", "namespace", "new", "noexcept", "not", "nullptr", "operator",
    "or", "private", "protected", "public", "register", "reinterpret_cast",
    "requires", "return", "short", "signed", "sizeof", "static", "static_cast",
    "struct", "switch", "template", "this", "throw", "true", "try", "typedef",
    "typeid", "typename", "union", "unsigned", "using", "virtual", "void",
    "volatile", "wchar_t", "while",
  ],
};

const BUILTINS = {
  java: ["System", "Math", "String", "Integer", "Double", "Boolean", "ArrayList", "HashMap", "Scanner", "Arrays", "Collections"],
  python: ["print", "len", "range", "int", "str", "float", "list", "dict", "set", "tuple", "type", "input", "open", "sorted", "enumerate", "zip", "map", "filter"],
  cpp: ["cout", "cin", "endl", "vector", "string", "map", "set", "pair", "sort", "reverse", "find", "max", "min", "swap", "to_string"],
};

/**
 * 将代码行分割为带类型的 token
 */
export function tokenize(code, language = "java") {
  const lang = language.toLowerCase();
  const keywords = KEYWORDS[lang] || KEYWORDS.java;
  const builtins = BUILTINS[lang] || BUILTINS.java;

  const tokens = [];
  let i = 0;

  while (i < code.length) {
    // 空白
    if (/\s/.test(code[i])) {
      const start = i;
      while (i < code.length && /\s/.test(code[i])) {i++;}
      tokens.push({ type: "whitespace", value: code.slice(start, i) });
      continue;
    }

    // 字符串
    if (code[i] === '"' || code[i] === "'") {
      const start = i;
      const quote = code[i];
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === "\\") {i++;}
        i++;
      }
      i++;
      tokens.push({ type: "string", value: code.slice(start, i) });
      continue;
    }

    // 注释
    if (code[i] === "/" && code[i + 1] === "/") {
      tokens.push({ type: "comment", value: code.slice(i) });
      i = code.length;
      continue;
    }

    if (code[i] === "#") {
      tokens.push({ type: "comment", value: code.slice(i) });
      i = code.length;
      continue;
    }

    // 数字
    if (/\d/.test(code[i])) {
      const start = i;
      while (i < code.length && /[\d.]/.test(code[i])) {i++;}
      tokens.push({ type: "number", value: code.slice(start, i) });
      continue;
    }

    // 标识符
    if (/[a-zA-Z_$]/.test(code[i])) {
      const start = i;
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {i++;}
      const word = code.slice(start, i);

      if (keywords.includes(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (builtins.includes(word)) {
        tokens.push({ type: "builtin", value: word });
      } else if (code[i] === "(") {
        tokens.push({ type: "function", value: word });
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ type: "type", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }
      continue;
    }

    // 运算符
    if (/[+\-*/%=<>!&|^~?:]/.test(code[i])) {
      const start = i;
      while (i < code.length && /[+\-*/%=<>!&|^~?:]/.test(code[i])) {i++;}
      tokens.push({ type: "operator", value: code.slice(start, i) });
      continue;
    }

    // 分隔符
    if (/[{}()[\];,.]/.test(code[i])) {
      tokens.push({ type: "delimiter", value: code[i] });
      i++;
      continue;
    }

    // 其他
    tokens.push({ type: "text", value: code[i] });
    i++;
  }

  return tokens;
}

/**
 * 获取 token 的 CSS 类名
 */
export function getTokenClass(type) {
  const classMap = {
    keyword: "token-keyword",
    builtin: "token-builtin",
    string: "token-string",
    number: "token-number",
    comment: "token-comment",
    function: "token-function",
    type: "token-type",
    operator: "token-operator",
    delimiter: "token-delimiter",
    identifier: "token-identifier",
    whitespace: "",
    text: "",
  };
  return classMap[type] || "";
}

/**
 * 检测代码语言
 */
export function detectLanguage(code) {
  if (code.includes("System.out") || code.includes("public class") || code.includes("void main")) {
    return "java";
  }
  if (code.includes("def ") || code.includes("import ") || code.includes("print(")) {
    return "python";
  }
  if (code.includes("#include") || code.includes("cout") || code.includes("std::")) {
    return "cpp";
  }
  return "java";
}

export default {
  tokenize,
  getTokenClass,
  detectLanguage,
};
