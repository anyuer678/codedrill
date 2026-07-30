<template>
  <div class="settings-layout">
    <div class="page-header">
      <h1 class="page-title">
        设置
      </h1>
      <button
        class="btn"
        @click="goHome"
      >
        返回首页
      </button>
    </div>

    <div class="settings-grid">
      <!-- 默认设置 -->
      <div class="settings-card">
        <h3 class="card-title">
          默认设置
        </h3>
        <div class="setting-row">
          <label class="setting-label">默认语言</label>
          <select
            v-model="settings.language"
            class="select"
          >
            <option
              v-for="lang in languages"
              :key="lang"
              :value="lang"
            >
              {{ lang }}
            </option>
          </select>
        </div>
        <div class="setting-row">
          <label class="setting-label">每日目标（题）</label>
          <input
            v-model.number="settings.dailyGoal"
            class="input"
            type="number"
            min="5"
            max="100"
          >
        </div>
        <div class="setting-row">
          <label class="setting-label">限时模式默认时长</label>
          <select
            v-model.number="settings.defaultTimeLimit"
            class="select"
          >
            <option :value="30">
              30秒
            </option>
            <option :value="60">
              60秒
            </option>
            <option :value="90">
              90秒
            </option>
            <option :value="120">
              120秒
            </option>
          </select>
        </div>
        <div class="setting-row">
          <label class="setting-label">界面主题</label>
          <select class="input" v-model="settings.theme" @change="saveSettings">
            <optgroup label="机械工坊">
              <option value="codedrill">工坊·默认</option>
            </optgroup>
            <optgroup label="纯色">
              <option value="light">浅色·白</option>
              <option value="solid-cream">浅色·奶油</option>
              <option value="solid-ivory">浅色·象牙</option>
              <option value="solid-paper">浅色·纸色</option>
              <option value="solid-sand">浅色·沙色</option>
              <option value="solid-mist">浅色·雾灰</option>
            </optgroup>
            <optgroup label="渐变">
              <option value="grad-warm">渐变·暖阳</option>
              <option value="grad-sunset">渐变·落日</option>
              <option value="grad-forest">渐变·森林</option>
              <option value="grad-ocean">渐变·海洋</option>
              <option value="grad-mint">渐变·薄荷</option>
              <option value="grad-rose">渐变·玫瑰</option>
            </optgroup>
            <optgroup label="纸纹">
              <option value="paper-1">纸纹·1</option>
              <option value="paper-2">纸纹·2</option>
              <option value="paper-3">纸纹·3</option>
              <option value="paper-4">纸纹·4</option>
              <option value="paper-5">纸纹·5</option>
              <option value="paper-6">纸纹·6</option>
            </optgroup>
            <optgroup label="水墨">
              <option value="eink">水墨·素</option>
              <option value="ink-light">水墨·淡</option>
              <option value="ink-scroll">水墨·卷轴</option>
              <option value="ink-bamboo">水墨·竹</option>
            </optgroup>
          </select>
        </div>
        <div class="save-row">
          <button
            class="btn btn-primary"
            @click="saveSettings"
          >
            保存设置
          </button>
          <span
            v-if="savedMessage"
            class="saved-msg"
          >✓ 已保存</span>
        </div>
      </div>

      <!-- 训练提醒 -->
      <div class="settings-card">
        <h3 class="card-title">
          训练提醒
        </h3>
        <div class="setting-row">
          <label class="setting-label">启用提醒</label>
          <label class="toggle">
            <input
              v-model="reminder.enabled"
              type="checkbox"
              @change="toggleReminder"
            >
            <span class="toggle-slider" />
          </label>
        </div>
        <div
          v-if="reminder.enabled"
          class="setting-row"
        >
          <label class="setting-label">提醒时间</label>
          <input
            v-model="reminder.time"
            type="time"
            class="input-sm"
            @change="saveReminder"
          >
        </div>
        <div
          v-if="reminder.enabled"
          class="setting-row"
        >
          <label class="setting-label">通知权限</label>
          <button
            class="btn btn-sm"
            @click="requestPermission"
          >
            {{ permissionStatus }}
          </button>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-card">
        <h3 class="card-title">
          数据管理
        </h3>
        <div class="data-info">
          <div class="data-row">
            <span class="data-label">训练记录</span>
            <span class="data-value">{{ historyCount }} 条</span>
          </div>
          <div class="data-row">
            <span class="data-label">已解锁成就</span>
            <span class="data-value">{{ achievementCount }} 个</span>
          </div>
        </div>
        <div class="action-group">
          <button
            class="btn"
            @click="exportJSON"
          >
            导出 JSON
          </button>
          <button
            class="btn"
            @click="exportCSV"
          >
            导出 CSV
          </button>
        </div>
        <div class="action-group">
          <label class="btn import-btn">
            导入数据
            <input
              type="file"
              accept=".json"
              hidden
              @change="importData"
            >
          </label>
        </div>
        <div class="danger-zone">
          <div class="danger-label">
            危险操作
          </div>
          <button
            class="btn btn-danger"
            @click="confirmClear"
          >
            清除所有数据
          </button>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-card">
        <h3 class="card-title">
          数据管理
        </h3>
        <div class="setting-row">
          <label class="setting-label">导出数据</label>
          <button
            class="btn btn-sm"
            @click="exportJSON"
          >
            导出 JSON
          </button>
        </div>
        <div class="setting-row">
          <label class="setting-label">导入数据</label>
          <div class="import-row">
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              class="file-input"
              @change="importData"
            >
            <button
              class="btn btn-sm"
              @click="$refs.fileInput.click()"
            >
              选择文件
            </button>
          </div>
        </div>
        <div class="setting-row">
          <label class="setting-label">清除所有数据</label>
          <button
            class="btn btn-sm btn-danger"
            @click="confirmClear"
          >
            清除
          </button>
        </div>
      </div>

      <!-- 关于 -->
      <div class="settings-card">
        <h3 class="card-title">
          关于
        </h3>
        <div class="about-info">
          <div class="about-row">
            <span class="about-label">应用名称</span>
            <span class="about-value">CodeDrill</span>
          </div>
          <div class="about-row">
            <span class="about-label">版本</span>
            <span class="about-value">1.0.0</span>
          </div>
          <div class="about-row">
            <span class="about-label">描述</span>
            <span class="about-value">离线编程训练系统</span>
          </div>
          <div class="about-row">
            <span class="about-label">技术栈</span>
            <span class="about-value">Vue 3 + Vite + Pinia</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div
      v-if="showConfirm"
      class="modal-overlay"
      @click="showConfirm = false"
    >
      <div
        class="modal"
        @click.stop
      >
        <div class="modal-header">
          确认操作
        </div>
        <div class="modal-body">
          {{ confirmMessage }}
        </div>
        <div class="modal-actions">
          <button
            class="btn"
            @click="showConfirm = false"
          >
            取消
          </button>
          <button
            class="btn btn-danger"
            @click="confirmAction"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storage } from "@/lib/utils";
import { STORAGE_KEYS, LANGUAGES } from "@/lib/constants";
import { exportToJSON, exportToCSV, importFromJSON, clearAllData } from "@/lib/exportService";
import { getReminderSettings, toggleReminder as toggleReminderService, setReminderTime, requestNotificationPermission } from "@/lib/reminder";

const router = useRouter();

const languages = LANGUAGES;
const settings = ref({
  language: "Java",
  dailyGoal: 20,
  defaultTimeLimit: 60,
  theme: "light",
});

const reminder = ref({
  enabled: false,
  time: "20:00",
});

const permissionStatus = ref("检查权限");

const historyCount = ref(0);
const achievementCount = ref(0);
const showConfirm = ref(false);
const confirmMessage = ref("");
const savedMessage = ref(false);
let pendingAction = null;

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}

function loadSettings() {
  const saved = storage.get(STORAGE_KEYS.SETTINGS, {});
  settings.value = { ...settings.value, ...saved };
  applyTheme(settings.value.theme);

  const history = storage.get(STORAGE_KEYS.HISTORY, []);
  historyCount.value = history.length;

  const achievements = storage.get(STORAGE_KEYS.ACHIEVEMENTS, {});
  achievementCount.value = (achievements.unlocked || []).length;

  // 加载提醒设置
  const reminderSettings = getReminderSettings();
  reminder.value = { ...reminder.value, ...reminderSettings };
  checkPermission();
}

function toggleReminder() {
  toggleReminderService(reminder.value.enabled);
}

function saveReminder() {
  setReminderTime(reminder.value.time);
}

async function requestPermission() {
  const result = await requestNotificationPermission();
  permissionStatus.value = result === "granted" ? "已授权" : "已拒绝";
}

function checkPermission() {
  if (!("Notification" in window)) {
    permissionStatus.value = "不支持";
    return;
  }
  permissionStatus.value = Notification.permission === "granted" ? "已授权" : "未授权";
}

function saveSettings() {
  storage.set(STORAGE_KEYS.SETTINGS, settings.value);
  applyTheme(settings.value.theme);
  savedMessage.value = true;
  setTimeout(() => {
    savedMessage.value = false;
  }, 2000);
}

function exportJSON() {
  exportToJSON();
}

function exportCSV() {
  exportToCSV();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) {return;}

  const reader = new FileReader();
  reader.onload = (e) => {
    const result = importFromJSON(e.target.result);
    if (result.success) {
      alert("导入成功");
      loadSettings();
    } else {
      alert(result.message);
    }
  };
  reader.readAsText(file);
}

function confirmClear() {
  confirmMessage.value = "确定要清除所有数据吗？此操作不可恢复。";
  pendingAction = () => {
    clearAllData();
    loadSettings();
    alert("数据已清除");
  };
  showConfirm.value = true;
}

function confirmAction() {
  showConfirm.value = false;
  if (pendingAction) {
    pendingAction();
    pendingAction = null;
  }
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.settings-layout {
  height: 100%;
  padding: var(--space-6);
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 2px solid var(--border);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.settings-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: all 0.2s ease;
}

.settings-card:hover {
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 2px solid var(--border-light);
  color: var(--text-900);
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding: var(--space-2) 0;
}

.setting-label {
  font-size: var(--text-sm);
  color: var(--text-700);
}

.select, .input {
  width: 200px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--font);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-900);
  transition: border-color 0.2s ease;
}

.select:focus, .input:focus {
  border-color: var(--accent-10);
  outline: none;
}

.save-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.saved-msg {
  font-size: var(--text-sm);
  color: var(--correct);
  font-weight: 500;
}

.theme-options {
  display: flex;
  gap: var(--space-3);
}

.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--font);
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-700);
  transition: all 0.2s ease;
  width: 100px;
}

.theme-btn:hover {
  border-color: var(--text-400);
}

.theme-btn.active {
  border-color: var(--accent-10);
  background: rgba(37, 99, 235, 0.04);
}

.theme-preview {
  width: 60px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  border: 1px solid var(--border);
}

.light-preview .preview-bg { background: #F9FAFB; }
.light-preview .preview-card { background: #FFFFFF; grid-row: span 2; }
.light-preview .preview-accent { background: #2563EB; }

.dark-preview .preview-bg { background: #111827; }
.dark-preview .preview-card { background: #1F2937; grid-row: span 2; }
.dark-preview .preview-accent { background: #3B82F6; }

.data-info {
  margin-bottom: var(--space-4);
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: var(--accent-10);
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.input-sm {
  width: 120px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--font);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.data-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-light);
}

.data-label {
  font-size: var(--text-sm);
  color: var(--text-500);
}

.data-value {
  font-size: var(--text-sm);
  font-weight: 600;
  font-family: var(--mono);
}

.action-group {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.import-btn {
  cursor: pointer;
}

.danger-zone {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--incorrect);
}

.danger-label {
  font-size: var(--text-xs);
  color: var(--incorrect);
  margin-bottom: var(--space-2);
}

.btn-danger {
  background: var(--incorrect);
  border-color: var(--incorrect);
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

.about-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.about-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
}

.about-label {
  font-size: var(--text-sm);
  color: var(--text-500);
}

.about-value {
  font-size: var(--text-sm);
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  width: 400px;
  max-width: 90%;
}

.modal-header {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.modal-body {
  font-size: var(--text-sm);
  color: var(--text-500);
  margin-bottom: var(--space-6);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .settings-layout {
    padding: var(--space-4);
  }

  .page-header {
    margin-bottom: var(--space-4);
  }

  .settings-grid {
    gap: var(--space-3);
  }

  .settings-card {
    padding: var(--space-4);
  }

  .setting-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .select, .input {
    width: 100%;
  }

  .theme-options {
    width: 100%;
  }

  .theme-btn {
    flex: 1;
  }

  .action-group {
    flex-wrap: wrap;
  }

  .modal {
    width: 90%;
    padding: var(--space-4);
  }
}
</style>
