<template>
  <div class="app-layout">
    <!-- 桌面端：左侧导航栏 -->
    <nav class="sidebar desktop-only">
      <div class="nav-list">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="nav-label">首页</span>
        </router-link>
        <router-link to="/stats" class="nav-item" :class="{ active: $route.path === '/stats' }">
          <span class="nav-label">统计</span>
        </router-link>
        <router-link to="/history" class="nav-item" :class="{ active: $route.path === '/history' }">
          <span class="nav-label">历史</span>
        </router-link>
        <router-link to="/graph" class="nav-item" :class="{ active: $route.path === '/graph' }">
          <span class="nav-label">图谱</span>
        </router-link>
        <router-link to="/plan" class="nav-item" :class="{ active: $route.path === '/plan' }">
          <span class="nav-label">计划</span>
        </router-link>
        <router-link to="/skills" class="nav-item" :class="{ active: $route.path === '/skills' }">
          <span class="nav-label">技能</span>
        </router-link>
        <router-link to="/achievements" class="nav-item" :class="{ active: $route.path === '/achievements' }">
          <span class="nav-label">成就</span>
        </router-link>
        <router-link to="/srs" class="nav-item" :class="{ active: $route.path === '/srs' }">
          <span class="nav-label">复习</span>
        </router-link>
        <router-link to="/wrongbook" class="nav-item" :class="{ active: $route.path === '/wrongbook' }">
          <span class="nav-label">错题</span>
        </router-link>
        <router-link to="/favorites" class="nav-item" :class="{ active: $route.path === '/favorites' }">
          <span class="nav-label">收藏</span>
        </router-link>
      </div>
      <div class="nav-bottom">
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <span class="nav-label">设置</span>
        </router-link>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main">
      <router-view />
    </main>

    <!-- 移动端：底部导航栏（带图标） -->
    <nav class="bottom-nav mobile-only">
      <router-link to="/" class="bottom-nav-item" :class="{ active: $route.path === '/' }">
        <svg class="icon icon-tab"><use href="#i-cd-train"/></svg>
        <span class="bottom-nav-label">首页</span>
      </router-link>
      <router-link to="/stats" class="bottom-nav-item" :class="{ active: $route.path === '/stats' }">
        <svg class="icon icon-tab"><use href="#i-cd-achievement"/></svg>
        <span class="bottom-nav-label">统计</span>
      </router-link>
      <router-link to="/history" class="bottom-nav-item" :class="{ active: $route.path === '/history' }">
        <svg class="icon icon-tab"><use href="#i-clock"/></svg>
        <span class="bottom-nav-label">历史</span>
      </router-link>
      <router-link to="/skills" class="bottom-nav-item" :class="{ active: $route.path === '/skills' }">
        <svg class="icon icon-tab"><use href="#i-cd-skilltree"/></svg>
        <span class="bottom-nav-label">技能</span>
      </router-link>
      <router-link to="/settings" class="bottom-nav-item" :class="{ active: $route.path === '/settings' }">
        <svg class="icon icon-tab"><use href="#i-settings"/></svg>
        <span class="bottom-nav-label">设置</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // 隐藏启动画面
  const splash = document.getElementById("splash");
  if (splash) {
    splash.classList.add("hide");
    setTimeout(() => splash.remove(), 500);
  }
  // 从本地存储读取主题设置
  try {
    const saved = JSON.parse(localStorage.getItem("codedrill_settings") || "{}");
    const theme = saved.theme || "codedrill";
    document.body.setAttribute("data-theme", theme);
  } catch {
    document.body.setAttribute("data-theme", "codedrill");
  }
});
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: var(--font);
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100%;
}

/* 通用按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: var(--text-sm);
  font-weight: 500;
  font-family: var(--font);
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 150ms ease;
  white-space: nowrap;
}

.btn:hover {
  border-color: var(--accent-10);
  color: var(--accent-10);
  background: rgba(52, 108, 191, 0.04);
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--accent-10);
  border-color: var(--accent-10);
  color: #fff;
}

.btn-primary:hover {
  background: #2a5a9f;
  border-color: #2a5a9f;
  color: #fff;
}

.btn-sm {
  padding: 4px 10px;
  font-size: var(--text-xs);
}

.btn-danger {
  background: var(--incorrect);
  border-color: var(--incorrect);
  color: #fff;
}

.btn-danger:hover {
  background: #c33;
  border-color: #c33;
  color: #fff;
}

/* 通用输入框样式 */
.input, .select, input[type="text"], input[type="number"], input[type="time"], select {
  padding: 8px 12px;
  font-size: var(--text-sm);
  font-family: var(--font);
  color: var(--text-primary);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 150ms ease;
}

.input:focus, .select:focus, input:focus, select:focus {
  border-color: var(--accent-10);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--text-400);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-500);
}
</style>

<style scoped>
.app-layout {
  height: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
}

/* 侧边栏 */
.sidebar {
  width: 64px;
  background: var(--bg-card);
  border-right: 2px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  flex-shrink: 0;
}

.nav-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 0 8px;
}

.nav-bottom {
  padding: 0 8px;
  width: 100%;
  border-top: 2px solid var(--border);
  padding-top: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 4px;
  text-decoration: none;
  color: var(--text-500);
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-secondary);
  color: var(--accent-10);
}

.nav-item.active {
  background: rgba(52, 108, 191, 0.1);
  color: var(--accent-10);
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 10px;
  bottom: 10px;
  width: 3px;
  background: var(--accent-10);
  border-radius: 0 2px 2px 0;
}

.nav-label {
  font-size: 13px;
  font-weight: 500;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 3px;
}

/* 主内容区 */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--bg-main);
}

/* 移动端底部导航栏 */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--bg-card);
  border-top: 2px solid var(--border);
  z-index: 100;
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-500);
  transition: all 0.2s ease;
  position: relative;
}

.bottom-nav-item.active {
  color: var(--accent-10);
  font-weight: 600;
}

.bottom-nav-item.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background: var(--accent-10);
  border-radius: 0 0 3px 3px;
}

.bottom-nav-label {
  font-size: 14px;
  font-weight: 500;
}


.icon.icon-tab {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

/* 响应式显示/隐藏 */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .sidebar {
    display: none !important;
  }

  .bottom-nav {
    display: flex;
  }

  .main {
    padding-bottom: 56px;
  }

  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
  }
}
</style>
