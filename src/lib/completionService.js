/**
 * 代码补全服务
 * 基于题目上下文提供补全建议
 */

/**
 * 获取补全建议
 */
export function getCompletions(code, cursorPosition, language, context = {}) {
  const beforeCursor = code.slice(0, cursorPosition);
  const currentLine = beforeCursor.split("\n").pop() || "";
  const currentWord = getCurrentWord(currentLine);

  if (currentWord.length < 2) {
    return [];
  }

  const suggestions = [];

  // 关键字补全
  const keywords = getKeywords(language);
  for (const kw of keywords) {
    if (kw.startsWith(currentWord) && kw !== currentWord) {
      suggestions.push({
        text: kw,
        type: "keyword",
        label: kw,
        description: "关键字",
      });
    }
  }

  // 上下文补全
  if (context.expectedCode) {
    const expectedWords = extractWords(context.expectedCode);
    for (const word of expectedWords) {
      if (word.startsWith(currentWord) && word !== currentWord && !suggestions.find((s) => s.text === word)) {
        suggestions.push({
          text: word,
          type: "expected",
          label: word,
          description: "参考代码",
        });
      }
    }
  }

  // 内置函数补全
  const builtins = getBuiltins(language);
  for (const fn of builtins) {
    if (fn.startsWith(currentWord) && fn !== currentWord && !suggestions.find((s) => s.text === fn)) {
      suggestions.push({
        text: fn,
        type: "builtin",
        label: fn,
        description: "内置函数",
      });
    }
  }

  return suggestions.slice(0, 8);
}

/**
 * 获取当前正在输入的单词
 */
function getCurrentWord(line) {
  const match = line.match(/[a-zA-Z_]\w*$/);
  return match ? match[0] : "";
}

/**
 * 提取代码中的单词
 */
function extractWords(code) {
  const words = new Set();
  const matches = code.match(/[a-zA-Z_]\w*/g) || [];
  for (const m of matches) {
    if (m.length > 2) {
      words.add(m);
    }
  }
  return Array.from(words);
}

/**
 * 获取语言关键字
 */
function getKeywords(language) {
  const keywords = {
    Java: [
      "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
      "class", "const", "continue", "default", "do", "double", "else", "enum",
      "extends", "final", "finally", "float", "for", "if", "implements", "import",
      "instanceof", "int", "interface", "long", "new", "package", "private",
      "protected", "public", "return", "short", "static", "super", "switch",
      "this", "throw", "throws", "try", "void", "while",
    ],
    Python: [
      "and", "as", "assert", "break", "class", "continue", "def", "del", "elif",
      "else", "except", "False", "finally", "for", "from", "global", "if",
      "import", "in", "is", "lambda", "None", "nonlocal", "not", "or", "pass",
      "raise", "return", "True", "try", "while", "with", "yield",
    ],
    "C++": [
      "auto", "bool", "break", "case", "catch", "char", "class", "const",
      "continue", "default", "delete", "do", "double", "else", "enum",
      "false", "float", "for", "friend", "goto", "if", "inline", "int",
      "long", "new", "nullptr", "private", "protected", "public", "return",
      "short", "sizeof", "static", "struct", "switch", "template", "this",
      "throw", "true", "try", "typedef", "typename", "union", "unsigned",
      "virtual", "void", "while",
    ],
    JavaScript: [
      "async", "await", "break", "case", "catch", "class", "const",
      "continue", "debugger", "default", "delete", "do", "else", "enum",
      "export", "extends", "false", "finally", "for", "from", "function",
      "if", "implements", "import", "in", "instanceof", "interface", "let",
      "new", "null", "of", "package", "private", "protected", "public",
      "return", "static", "super", "switch", "this", "throw", "true", "try",
      "typeof", "undefined", "var", "void", "while", "with", "yield",
    ],
    TypeScript: [
      "abstract", "as", "async", "await", "break", "case", "catch", "class",
      "const", "continue", "debugger", "declare", "default", "delete", "do",
      "else", "enum", "export", "extends", "false", "finally", "for", "from",
      "function", "if", "implements", "import", "in", "instanceof", "interface",
      "keyof", "let", "module", "namespace", "new", "null", "of", "package",
      "private", "protected", "public", "readonly", "return", "static", "super",
      "switch", "this", "throw", "true", "try", "type", "typeof", "undefined",
      "var", "void", "while", "with", "yield",
    ],
    Linux: [
      "if", "then", "else", "elif", "fi", "for", "while", "do", "done",
      "case", "esac", "function", "return", "local", "export", "source",
      "echo", "read", "cd", "ls", "grep", "find", "awk", "sed", "sort",
    ],
    SQL: [
      "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE",
      "SET", "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX",
      "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "AS", "AND",
      "OR", "NOT", "IN", "BETWEEN", "LIKE", "ORDER", "BY", "GROUP",
      "HAVING", "LIMIT", "OFFSET", "UNION", "ALL", "DISTINCT", "COUNT",
      "SUM", "AVG", "MAX", "MIN", "CASE", "WHEN", "THEN", "ELSE", "END",
    ],
  };
  return keywords[language] || keywords.Java;
}

/**
 * 获取内置函数
 */
function getBuiltins(language) {
  const builtins = {
    Java: [
      "System.out.println", "System.out.print", "Math.max", "Math.min",
      "Math.abs", "Math.pow", "Math.sqrt", "Arrays.sort", "Arrays.toString",
      "String.valueOf", "Integer.parseInt", "Double.parseDouble",
      "ArrayList", "HashMap", "LinkedList", "Collections.sort",
    ],
    Python: [
      "print", "len", "range", "int", "str", "float", "list", "dict",
      "set", "tuple", "type", "input", "open", "sorted", "enumerate",
      "zip", "map", "filter", "sum", "max", "min", "abs", "round",
      "isinstance", "hasattr", "getattr", "setattr",
    ],
    "C++": [
      "cout", "cin", "endl", "vector", "string", "map", "set", "pair",
      "sort", "reverse", "find", "max", "min", "swap", "to_string",
      "stoi", "stod", "printf", "scanf", "malloc", "free", "new", "delete",
    ],
    JavaScript: [
      "console.log", "console.error", "console.warn", "console.info",
      "Math.max", "Math.min", "Math.abs", "Math.pow", "Math.sqrt",
      "Math.floor", "Math.ceil", "Math.round", "Math.random",
      "parseInt", "parseFloat", "isNaN", "isFinite",
      "Array", "Object", "Map", "Set", "Promise", "Date", "RegExp",
      "JSON.parse", "JSON.stringify",
      "setTimeout", "setInterval", "clearTimeout", "clearInterval",
      "fetch", "require", "module.exports",
    ],
    TypeScript: [
      "console.log", "console.error", "console.warn", "console.info",
      "Math.max", "Math.min", "Math.abs", "Math.pow", "Math.sqrt",
      "Math.floor", "Math.ceil", "Math.round", "Math.random",
      "parseInt", "parseFloat", "isNaN", "isFinite",
      "Array", "Object", "Map", "Set", "Promise", "Date", "RegExp",
      "JSON.parse", "JSON.stringify",
      "setTimeout", "setInterval", "clearTimeout", "clearInterval",
      "fetch", "require", "module.exports",
      "Partial", "Required", "Readonly", "Record", "Pick", "Omit",
      "Exclude", "Extract", "ReturnType", "Parameters", "ConstructorParameters",
      "Awaited", "InstanceType", "ThisType",
    ],
    Linux: [
      "echo", "read", "cd", "ls", "pwd", "mkdir", "rm", "cp", "mv",
      "grep", "find", "awk", "sed", "sort", "wc", "cat", "head", "tail",
      "chmod", "chown", "ps", "kill", "top", "df", "du", "tar", "zip",
    ],
    SQL: [
      "COUNT", "SUM", "AVG", "MAX", "MIN", "COALESCE", "NULLIF",
      "CAST", "CONVERT", "DATE_FORMAT", "NOW", "CURDATE", "DATEDIFF",
      "CONCAT", "SUBSTRING", "LENGTH", "TRIM", "UPPER", "LOWER",
      "IF", "IFNULL", "CASE", "WHEN", "THEN", "ELSE", "END",
    ],
  };
  return builtins[language] || builtins.Java;
}

export default {
  getCompletions,
};
