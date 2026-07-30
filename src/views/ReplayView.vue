<template>
  <div class="replay-layout">
    <div class="page-header">
      <h1 class="page-title">
        训练回放
      </h1>
      <button
        class="btn"
        @click="goHome"
      >
        返回首页
      </button>
    </div>

    <div
      v-if="!selectedReplay"
      class="replay-list"
    >
      <div
        v-if="replays.length === 0"
        class="empty-state"
      >
        <p>暂无回放记录</p>
        <p class="empty-hint">
          完成训练后自动生成回放
        </p>
      </div>
      <div
        v-for="(replay, i) in replays"
        :key="i"
        class="replay-item"
        @click="selectReplay(replay)"
      >
        <div class="replay-info">
          <span class="replay-mode">{{ getModeLabel(replay.summary?.mode) || '训练' }}</span>
          <span class="replay-lang">{{ replay.summary?.language }}</span>
        </div>
        <div class="replay-stats">
          <span
            class="replay-accuracy"
            :class="getAccuracyClass(replay.summary?.accuracy)"
          >
            {{ replay.summary?.accuracy || 0 }}%
          </span>
          <span class="replay-duration">{{ formatDuration(replay.duration) }}</span>
        </div>
        <div class="replay-time">
          {{ formatDate(replay.startTime) }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="replay-detail"
    >
      <div class="detail-header">
        <button
          class="btn btn-sm"
          @click="selectedReplay = null"
        >
          ← 返回列表
        </button>
        <span class="detail-title">
          {{ getModeLabel(selectedReplay.summary?.mode) }} · {{ selectedReplay.summary?.language }}
        </span>
        <span
          class="detail-accuracy"
          :class="getAccuracyClass(selectedReplay.summary?.accuracy)"
        >
          {{ selectedReplay.summary?.accuracy }}%
        </span>
      </div>

      <div class="timeline">
        <div
          v-for="(event, i) in replayData?.events || []"
          :key="i"
          class="timeline-item"
          :class="event.type"
        >
          <div class="timeline-time">
            {{ formatEventTime(event.relativeTime) }}
          </div>
          <div class="timeline-icon">
            {{ getEventIcon(event.type) }}
          </div>
          <div class="timeline-content">
            <span v-if="event.type === 'submit'">
              {{ event.correct ? '✓ 正确' : '✗ 错误' }}
              <span class="event-detail">{{ event.timeSpent?.toFixed(1) }}s</span>
            </span>
            <span v-else-if="event.type === 'input'">
              输入 {{ event.length }} 字符
            </span>
            <span v-else-if="event.type === 'pause'">
              停顿 {{ (event.duration / 1000).toFixed(1) }}s
            </span>
            <span v-else>{{ event.type }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getReplayList, getReplayData, formatReplayDuration } from "@/lib/replayService";

const router = useRouter();
const replays = ref([]);
const selectedReplay = ref(null);
const replayData = ref(null);

const modeLabels = {
  copy: "代码临摹",
  fill: "代码填空",
  debug: "改错练习",
  reflex: "限时速写",
  arena: "竞技场",
  daily: "每日挑战",
};

function selectReplay(replay) {
  selectedReplay.value = replay;
  replayData.value = getReplayData(replay.sessionId);
}

function getModeLabel(mode) {
  return modeLabels[mode] || mode;
}

function getAccuracyClass(accuracy) {
  if (accuracy >= 90) {return "high";}
  if (accuracy >= 70) {return "medium";}
  return "low";
}

function formatDuration(ms) {
  return formatReplayDuration(ms);
}

function formatDate(timestamp) {
  if (!timestamp) {return "";}
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatEventTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function getEventIcon(type) {
  const icons = {
    submit: "📝",
    input: "⌨️",
    pause: "⏸️",
    delete: "⌫",
    stuck: "🤔",
  };
  return icons[type] || "•";
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  replays.value = getReplayList();
});
</script>

<style scoped>
.replay-layout {
  padding: var(--space-6);
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.page-title {
  font-size: var(--text-xl);
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: var(--space-10);
  color: var(--text-400);
}

.empty-hint {
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}

.replay-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.replay-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 150ms ease;
}

.replay-item:hover {
  border-color: var(--accent-10);
  box-shadow: var(--shadow-sm);
}

.replay-info {
  display: flex;
  gap: var(--space-2);
}

.replay-mode, .replay-lang {
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  background: var(--border-light);
  color: var(--text-500);
}

.replay-stats {
  display: flex;
  gap: var(--space-3);
  margin-left: auto;
}

.replay-accuracy {
  font-weight: 600;
  font-family: var(--mono);
}

.replay-accuracy.high { color: var(--correct); }
.replay-accuracy.medium { color: var(--warning); }
.replay-accuracy.low { color: var(--incorrect); }

.replay-duration {
  font-size: var(--text-sm);
  color: var(--text-500);
  font-family: var(--mono);
}

.replay-time {
  font-size: var(--text-xs);
  color: var(--text-400);
}

.replay-detail {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.detail-title {
  flex: 1;
  font-weight: 600;
}

.detail-accuracy {
  font-weight: 700;
  font-family: var(--mono);
  font-size: var(--text-lg);
}

.detail-accuracy.high { color: var(--correct); }
.detail-accuracy.medium { color: var(--warning); }
.detail-accuracy.low { color: var(--incorrect); }

.timeline {
  padding: var(--space-4);
  max-height: 500px;
  overflow-y: auto;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-light);
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-time {
  width: 50px;
  font-size: var(--text-xs);
  font-family: var(--mono);
  color: var(--text-400);
}

.timeline-icon {
  width: 20px;
  text-align: center;
}

.timeline-content {
  font-size: var(--text-sm);
  color: var(--text-700);
}

.timeline-item.submit.correct .timeline-content {
  color: var(--correct);
}

.timeline-item.submit:not(.correct) .timeline-content {
  color: var(--incorrect);
}

.event-detail {
  margin-left: var(--space-2);
  font-size: var(--text-xs);
  color: var(--text-400);
  font-family: var(--mono);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .replay-layout {
    padding: var(--space-4);
  }

  .replay-list {
    gap: var(--space-3);
  }

  .replay-item {
    padding: var(--space-3);
  }

  .replay-info {
    flex-wrap: wrap;
  }

  .replay-stats {
    margin-left: 0;
    margin-top: var(--space-2);
  }
}
</style>
