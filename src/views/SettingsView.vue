<template>
  <div class="settings-layout">
    <div class="page-header">
      <h1 class="page-title">
        设置
      </h1>
      <KbButton @click="goHome">
        返回首页
      </KbButton>
    </div>

    <div class="settings-grid">
      <!-- 默认设置 -->
      <div class="settings-card">
        <h3 class="card-title">
          默认设置
        </h3>
        <div class="setting-row">
          <label class="setting-label">默认语言</label>
          <KbSelect
            v-model="settings.language"
            :options="languageOptions"
            class="kb-w200"
          />
        </div>
        <div class="setting-row">
          <label class="setting-label">每日目标（题）</label>
          <KbInput
            type="number"
            :model-value="String(settings.dailyGoal)"
            class="kb-w200"
            @update:model-value="v => settings.dailyGoal = clampGoal(v)"
          />
        </div>
        <div class="setting-row">
          <label class="setting-label">限时模式默认时长</label>
          <KbSelect
            v-model="settings.defaultTimeLimit"
            :options="timeLimitOptions"
            class="kb-w200"
          />
        </div>
        <div class="setting-row">
          <label class="setting-label">界面主题</label>
          <!-- 保留原生 select：主题列表依赖 optgroup 分组，KbSelect 尚无分组支持（试点决策，见 docs/KB-UI-PILOT.md） -->
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
          <KbButton
            type="primary"
            @click="saveSettings"
          >
            保存设置
          </KbButton>
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
          <KbSwitch
            v-model="reminder.enabled"
            @change="toggleReminder"
          />
        </div>
        <div
          v-if="reminder.enabled"
          class="setting-row"
        >
          <label class="setting-label">提醒时间</label>
          <!-- 保留原生 input[type=time]：KbInput 仅支持 text/password/number -->
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
          <KbButton
            size="small"
            @click="requestPermission"
          >
            {{ permissionStatus }}
          </KbButton>
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
          <KbButton @click="exportJSON">
            导出 JSON
          </KbButton>
          <KbButton @click="exportCSV">
            导出 CSV
          </KbButton>
        </div>
        <div class="action-group">
          <KbButton @click="$refs.importFileInput.click()">
            导入数据
          </KbButton>
          <input
            ref="importFileInput"
            type="file"
            accept=".json"
            hidden
            @change="importData"
          >
        </div>
        <div class="danger-zone">
          <div class="danger-label">
            危险操作
          </div>
          <KbButton
            type="danger"
            @click="confirmClear"
          >
            清除所有数据
          </KbButton>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-card">
        <h3 class="card-title">
          数据管理
        </h3>
        <div class="setting-row">
          <label class="setting-label">导出数据</label>
          <KbButton
            size="small"
            @click="exportJSON"
          >
            导出 JSON
          </KbButton>
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
            <KbButton
              size="small"
              @click="$refs.fileInput.click()"
            >
              选择文件
            </KbButton>
          </div>
        </div>
        <div class="setting-row">
          <label class="setting-label">清除所有数据</label>
          <KbButton
            size="small"
            type="danger"
            @click="confirmClear"
          >
            清除
          </KbButton>
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

    <!-- 确认弹窗（KbDialog，Teleport 到 body；主题桥接变量声明在 body 上故 Teleport 后仍生效） -->
    <KbDialog
      v-model="showConfirm"
      title="确认操作"
      :width="400"
    >
      {{ confirmMessage }}
      <template #footer>
        <KbButton
          size="small"
          @click="showConfirm = false"
        >
          取消
        </KbButton>
        <KbButton
          size="small"
          type="danger"
          @click="confirmAction"
        >
          确认
        </KbButton>
      </template>
    </KbDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storage } from "@/lib/utils";
import { STORAGE_KEYS, LANGUAGES } from "@/lib/constants";
import { exportToJSON, exportToCSV, importFromJSON, clearAllData } from "@/lib/exportService";
import { getReminderSettings, toggleReminder as toggleReminderService, setReminderTime, requestNotificationPermission } from "@/lib/reminder";
import { KbButton, KbSelect, KbInput, KbSwitch, KbDialog } from "kb-ui-vue";
import "kb-ui-vue/styles/index.css";
import "../design-system/kb-bridge.css";

const router = useRouter();

const languages = LANGUAGES;
const settings = ref({
  language: "Java",
  dailyGoal: 20,
  defaultTimeLimit: 60,
  theme: "light",
});

const languageOptions = languages.map((lang) => ({ label: lang, value: lang }));
const timeLimitOptions = [30, 60, 90, 120].map((s) => ({ label: `${s}秒`, value: s }));

/** KbInput 返回字符串，这里转数值并夹在 [5,100]（原 min/max 语义） */
function clampGoal(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(100, Math.max(5, n)) : 5;
}

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

.kb-w200 {
  width: 200px;
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

.data-info {
  margin-bottom: var(--space-4);
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

/* 原生残留样式（主题下拉、时间输入、file-input 仍在用；.btn/.modal 系列已由 Kb 组件取代，暂留以最小化试点 diff） */
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

.input-sm {
  width: 120px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-family: var(--font);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
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

  .select, .input, .kb-w200 {
    width: 100%;
  }

  .action-group {
    flex-wrap: wrap;
  }
}
</style>
