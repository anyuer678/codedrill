/**
 * 快捷键管理器
 */

import { ref, onMounted, onUnmounted } from "vue";

const SHORTCUTS = {
  // 全局
  "ctrl+enter": { action: "submit", label: "提交答案" },
  "ctrl+n": { action: "next", label: "下一题" },
  "ctrl+r": { action: "restart", label: "重新开始" },
  escape: { action: "back", label: "返回" },

  // 训练页
  tab: { action: "insertTab", label: "插入制表符" },

  // 导航
  "ctrl+h": { action: "goHome", label: "返回首页" },
  "ctrl+s": { action: "goStats", label: "查看统计" },
};

/**
 * 快捷键 composable
 */
export function useShortcuts(handlers = {}) {
  const isEnabled = ref(true);

  function handleKeydown(event) {
    if (!isEnabled.value) {
      return;
    }

    // 忽略输入框内的快捷键（除了 Ctrl+Enter）
    const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
    const key = buildKeyString(event);

    // 输入框内只处理 Ctrl+Enter
    if (isInput && key !== "ctrl+enter") {
      return;
    }

    const shortcut = SHORTCUTS[key];
    if (!shortcut) {
      return;
    }

    // 检查是否有对应的处理器
    const handler = handlers[shortcut.action];
    if (handler) {
      event.preventDefault();
      handler(shortcut.params);
    }
  }

  function buildKeyString(event) {
    const parts = [];
    if (event.ctrlKey || event.metaKey) {
      parts.push("ctrl");
    }
    if (event.shiftKey) {
      parts.push("shift");
    }
    if (event.altKey) {
      parts.push("alt");
    }

    let key = event.key.toLowerCase();
    if (key === " ") {key = "space";}
    if (key === "escape") {key = "escape";}
    if (key === "enter") {key = "enter";}
    if (key === "tab") {key = "tab";}
    if (key === "backspace") {key = "backspace";}

    // 只添加非修饰键
    if (!["control", "shift", "alt", "meta"].includes(key)) {
      parts.push(key);
    }

    return parts.join("+");
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });

  function enable() {
    isEnabled.value = true;
  }

  function disable() {
    isEnabled.value = false;
  }

  return {
    isEnabled,
    enable,
    disable,
    SHORTCUTS,
  };
}

/**
 * 获取所有快捷键列表
 */
export function getAllShortcuts() {
  return Object.entries(SHORTCUTS).map(([key, value]) => ({
    key: formatKeyDisplay(key),
    action: value.action,
    label: value.label,
  }));
}

function formatKeyDisplay(key) {
  return key
    .replace("ctrl+", "Ctrl+")
    .replace("shift+", "Shift+")
    .replace("alt+", "Alt+")
    .replace(/^./, (c) => c.toUpperCase());
}

export default {
  useShortcuts,
  getAllShortcuts,
  SHORTCUTS,
};
