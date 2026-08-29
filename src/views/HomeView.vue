<template>
  <div class="home-layout">
    <!-- 顶部状态栏 - 横向铺满 -->
    <header class="top-bar">
      <div class="stat-item">
        <div class="stat-info">
          <span class="stat-value">{{ todayStats.sessions }}</span>
          <span class="stat-label">今日训练</span>
        </div>
        <div class="progress-bar-h" :style="{ '--bar-height': Math.min(4 + todayStats.sessions * 2, 12) + 'px', '--bar-color': 'var(--accent-10)', '--bar-opacity': Math.min(0.5 + todayStats.sessions * 0.1, 1) }">
          <div class="progress-fill-h" style="width: 100%"></div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-info">
          <span class="stat-value">{{ todayStats.questions }}</span>
          <span class="stat-label">答题数</span>
        </div>
        <div class="progress-bar-h" :style="{ '--bar-height': Math.min(4 + todayStats.questions * 0.5, 12) + 'px', '--bar-color': 'var(--correct)', '--bar-opacity': Math.min(0.5 + todayStats.questions * 0.02, 1) }">
          <div class="progress-fill-h" style="width: 100%"></div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-info">
          <span class="stat-value">{{ todayStats.accuracy }}%</span>
          <span class="stat-label">正确率</span>
        </div>
        <div class="progress-bar-h" :style="{ '--bar-height': Math.min(4 + todayStats.accuracy * 0.08, 12) + 'px', '--bar-color': 'var(--accent-orange)', '--bar-opacity': Math.min(0.5 + todayStats.accuracy * 0.005, 1) }">
          <div class="progress-fill-h" :style="{ width: todayStats.accuracy + '%' }"></div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-info">
          <span class="stat-value">{{ formatTotalTime(todayStats.totalTime) }}</span>
          <span class="stat-label">训练时长</span>
        </div>
        <div class="progress-bar-h" :style="{ '--bar-height': Math.min(4 + todayStats.totalTime / 60, 12) + 'px', '--bar-color': 'var(--accent-purple)', '--bar-opacity': Math.min(0.5 + todayStats.totalTime / 600, 1) }">
          <div class="progress-fill-h" style="width: 100%"></div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-info">
          <span class="stat-value">{{ todayStats.streak }}</span>
          <span class="stat-label">连续天数</span>
        </div>
        <div class="progress-bar-h" :style="{ '--bar-height': Math.min(4 + todayStats.streak * 2, 12) + 'px', '--bar-color': 'var(--incorrect)', '--bar-opacity': Math.min(0.5 + todayStats.streak * 0.15, 1) }">
          <div class="progress-fill-h" style="width: 100%"></div>
        </div>
      </div>
      <div class="stat-item goal">
        <div class="goal-ring">
          <svg viewBox="0 0 36 36">
            <path class="goal-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="goal-fill" :stroke-dasharray="`${goalPercent}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span class="goal-pct">{{ goalPercent }}%</span>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ todayStats.questions }}/{{ dailyGoal }}</span>
          <span class="stat-label">目标进度</span>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <div class="main-area">
      <!-- 左侧：训练配置 -->
      <section class="train-config">
        <h2 class="section-title">训练模式</h2>
        <div class="mode-grid">
          <div
            v-for="m in allModes"
            :key="m.id"
            class="mode-card"
            :class="{ selected: selectedMode === m.id, small: m.small }"
            @click="selectedMode = m.id"
          >
            <div class="mode-color" :style="{ background: m.bg }"></div>
            <div class="mode-info">
              <div class="mode-name">{{ m.label }}</div>
              <div class="mode-desc">{{ m.desc }}</div>
            </div>
          </div>
        </div>

        <div class="filter-bar">
          <div class="filter-group">
            <span class="filter-label">语言</span>
            <div class="tags">
              <button v-for="l in languages" :key="l" class="tag" :class="{ on: selectedLang === l }" @click="selectedLang = l">{{ l }}</button>
            </div>
          </div>
          <div class="filter-group">
            <span class="filter-label">模块</span>
            <div class="tags">
              <button v-for="m in modules" :key="m.id" class="tag" :class="{ on: selectedModule === m.id }" @click="selectedModule = m.id">{{ m.label }}</button>
            </div>
          </div>
          <div class="filter-group">
            <span class="filter-label">难度</span>
            <div class="tags">
              <button class="tag" :class="{ on: selectedDifficulty === null }" @click="selectedDifficulty = null">全部</button>
              <button class="tag" :class="{ on: selectedDifficulty === 1 }" @click="selectedDifficulty = 1">入门</button>
              <button class="tag" :class="{ on: selectedDifficulty === 2 }" @click="selectedDifficulty = 2">基础</button>
              <button class="tag" :class="{ on: selectedDifficulty === 3 }" @click="selectedDifficulty = 3">进阶</button>
            </div>
          </div>
          <div class="filter-actions">
            <select v-model.number="questionCount" class="count-select">
              <option :value="5">5 题</option>
              <option :value="10">10 题</option>
              <option :value="15">15 题</option>
              <option :value="20">20 题</option>
            </select>
            <button class="btn-start" @click="startTraining">开始训练</button>
          </div>
        </div>

        <h2 class="section-title" style="margin-top:24px">最近训练</h2>
        <div class="recent-list">
          <div v-for="(r, i) in recentRecords" :key="i" class="recent-item">
            <span class="r-mode">{{ modeLabels[r.mode] || r.mode }}</span>
            <span class="r-lang">{{ r.language }}</span>
            <span class="r-acc" :class="r.accuracy >= 70 ? 'ok' : 'fail'">{{ r.accuracy }}%</span>
          </div>
          <div v-if="recentRecords.length === 0" class="empty">暂无训练记录</div>
        </div>
      </section>

      <!-- 右侧：数据统计 -->
      <aside class="stats-panel">
        <div class="panel-card">
          <div class="panel-title">正确率趋势</div>
          <div class="chart-box">
            <div class="bar-chart">
              <div v-for="(d, i) in accuracyTrend" :key="i" class="bar-col">
                <div class="bar" :style="{ height: Math.max(d.accuracy, 5) + '%' }"></div>
                <span class="bar-label">{{ d.date }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-card">
          <div class="panel-title">语言分布</div>
          <div class="chart-box">
            <div v-for="(l, i) in langDistribution" :key="i" class="lang-row">
              <span class="lang-name">{{ l.lang }}</span>
              <div class="lang-track"><div class="lang-fill" :style="{ width: l.percent + '%' }"></div></div>
              <span class="lang-pct">{{ l.percent }}%</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { getHistory } from "@/lib/recordManager";

const router = useRouter();
const modeLabels = { copy: "临摹", fill: "填空", debug: "改错", reflex: "速写", arena: "竞技", challenge: "挑战", daily: "每日" };

const allModes = [
  { id: "copy", label: "代码临摹", desc: "照抄代码，熟悉语法", bg: "var(--accent-blue)" },
  { id: "fill", label: "代码填空", desc: "填写缺失部分", bg: "var(--accent-green)" },
  { id: "debug", label: "改错练习", desc: "修复代码错误", bg: "var(--accent-red)" },
  { id: "reflex", label: "限时速写", desc: "限时训练反射", bg: "var(--accent-orange)" },
  { id: "arena", label: "竞技场", desc: "连击挑战", bg: "var(--accent-purple)", small: true },
  { id: "challenge", label: "限时挑战", desc: "多题型限时", bg: "var(--accent-yellow)", small: true },
];

const languages = ["Java", "Python", "C++", "JavaScript", "TypeScript", "Bash", "SQL"];

const modulesByLanguage = {
  Java: [
    { id: "loop", label: "循环" }, { id: "condition", label: "条件" },
    { id: "array", label: "数组" }, { id: "string", label: "字符串" }, { id: "function", label: "函数" },
    { id: "class", label: "类与对象" }, { id: "io", label: "输入输出" },
  ],
  Python: [
    { id: "loop", label: "循环" }, { id: "condition", label: "条件" },
    { id: "array", label: "列表" }, { id: "string", label: "字符串" }, { id: "function", label: "函数" },
    { id: "class", label: "类与对象" }, { id: "io", label: "输入输出" },
  ],
  "C++": [
    { id: "loop", label: "循环" }, { id: "condition", label: "条件" },
    { id: "array", label: "数组" }, { id: "string", label: "字符串" }, { id: "function", label: "函数" },
    { id: "class", label: "类与对象" }, { id: "io", label: "输入输出" },
  ],
  JavaScript: [
    { id: "loop", label: "循环" }, { id: "condition", label: "条件" },
    { id: "array", label: "数组" }, { id: "string", label: "字符串" }, { id: "function", label: "函数" },
    { id: "class", label: "类与对象" }, { id: "io", label: "异步IO" },
  ],
  TypeScript: [
    { id: "loop", label: "循环" }, { id: "condition", label: "条件" },
    { id: "array", label: "数组" }, { id: "string", label: "字符串" }, { id: "function", label: "函数" },
    { id: "class", label: "类与接口" }, { id: "io", label: "模块系统" },
  ],
  Bash: [
    { id: "loop", label: "Shell基础" }, { id: "condition", label: "条件判断" },
    { id: "array", label: "文件操作" }, { id: "string", label: "文本处理" }, { id: "function", label: "Shell函数" },
    { id: "class", label: "系统管理" }, { id: "io", label: "IO重定向" },
  ],
  SQL: [
    { id: "loop", label: "SELECT查询" }, { id: "condition", label: "WHERE条件" },
    { id: "array", label: "表连接" }, { id: "string", label: "字符串函数" }, { id: "function", label: "聚合函数" },
    { id: "class", label: "数据操作" }, { id: "io", label: "索引优化" },
  ],
};

const modules = computed(() => modulesByLanguage[selectedLang.value] || modulesByLanguage.Java);

const selectedMode = ref("copy");
const selectedLang = ref("Java");
const selectedModule = ref("loop");
const questionCount = ref(10);
const selectedDifficulty = ref(null);

// 语言变化时重置模块
watch(selectedLang, () => {
  const availableModules = modulesByLanguage[selectedLang.value] || [];
  if (!availableModules.find(m => m.id === selectedModule.value)) {
    selectedModule.value = availableModules[0]?.id || "loop";
  }
});

const todayStats = computed(() => {
  const h = getHistory(1000);
  const today = new Date().toISOString().split("T")[0];
  const recs = h.filter(r => r.timestamp?.startsWith(today));
  const sessions = recs.length;
  const questions = recs.reduce((s, r) => s + (r.total || 0), 0);
  const correct = recs.reduce((s, r) => s + (r.correct || 0), 0);
  const accuracy = questions > 0 ? Math.round((correct / questions) * 100) : 0;
  const totalTime = recs.reduce((s, r) => s + (r.totalTime || 0), 0);
  let streak = 0;
  const dates = [...new Set(h.map(r => r.timestamp?.split("T")[0]))].sort().reverse();
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (dates[i] === d.toISOString().split("T")[0]) streak++; else break;
  }
  return { sessions, questions, accuracy, streak, totalTime };
});

const dailyGoal = computed(() => JSON.parse(localStorage.getItem("codedrill_settings") || "{}").dailyGoal || 20);
const goalPercent = computed(() => Math.min(100, Math.round((todayStats.value.questions / dailyGoal.value) * 100)));

const accuracyTrend = computed(() => {
  const h = getHistory(1000), r = [], today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const recs = h.filter(x => x.timestamp?.startsWith(ds));
    const t = recs.reduce((s, x) => s + (x.total || 0), 0);
    const c = recs.reduce((s, x) => s + (x.correct || 0), 0);
    r.push({ date: `${d.getMonth() + 1}/${d.getDate()}`, accuracy: t > 0 ? Math.round((c / t) * 100) : 0 });
  }
  return r;
});

const langDistribution = computed(() => {
  const h = getHistory(1000), counts = {};
  h.forEach(r => { counts[r.language] = (counts[r.language] || 0) + 1; });
  const total = h.length || 1;
  return Object.entries(counts).map(([lang, c]) => ({ lang, percent: Math.round((c / total) * 100) })).sort((a, b) => b.percent - a.percent).slice(0, 5);
});

const recentRecords = computed(() => getHistory(8));

function formatTotalTime(s) { return s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m` : `${(s / 3600).toFixed(1)}h`; }

function startTraining() {
  const q = { lang: selectedLang.value, module: selectedModule.value, count: questionCount.value, difficulty: selectedDifficulty.value };
  if (selectedMode.value === "reflex") router.push({ name: "Reflex", query: { lang: q.lang, module: q.module } });
  else if (selectedMode.value === "arena") router.push({ name: "Arena", query: { lang: q.lang, module: q.module } });
  else if (selectedMode.value === "challenge") router.push({ name: "Challenge" });
  else router.push({ name: "Train", params: { mode: selectedMode.value }, query: q });
}
</script>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-main);
  font-family: var(--font);
}

/* 顶部横向状态栏 */
.top-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-right: 1px solid var(--border);
}

.stat-item:last-child { border-right: none; }

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.progress-bar-h {
  width: 100%;
  height: var(--bar-height, 4px);
  background: var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill-h {
  height: 100%;
  background: var(--bar-color, var(--accent-10));
  opacity: var(--bar-opacity, 0.8);
  border-radius: var(--radius-sm);
  transition: width 300ms ease, height 300ms ease;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--mono);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.stat-item.goal {
  justify-content: center;
  gap: 12px;
}

.goal-ring {
  position: relative;
  width: 40px;
  height: 40px;
}

.goal-ring svg { transform: rotate(-90deg); }
.goal-bg { fill: none; stroke: var(--border); stroke-width: 3; }
.goal-fill { fill: none; stroke: var(--accent-10); stroke-width: 3; stroke-linecap: round; }
.goal-pct {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 700;
  color: var(--accent-10);
}
.goal-text { font-size: 12px; color: var(--text-muted); }

/* 主内容区 */
.main-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.train-config {
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 14px;
}

/* 模式卡片 */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mode-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-10);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.mode-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-10);
}

.mode-card:hover::before {
  transform: scaleX(1);
}

.mode-card.selected {
  border-color: var(--accent-10);
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 1px var(--accent-10);
}

.mode-card.selected::before {
  transform: scaleX(1);
}

.mode-card.small {
  grid-column: span 2;
  padding: 12px 16px;
}

.mode-color {
  width: 8px;
  height: 100%;
  min-height: 40px;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.mode-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.mode-desc { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

/* 筛选区 */
.filter-bar {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-group:last-of-type { margin-bottom: 0; }

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  width: 40px;
  flex-shrink: 0;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.tag:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--accent-10);
  color: var(--accent-10);
  transform: translateY(-1px);
}

.tag.on {
  background: var(--accent-10);
  border-color: var(--accent-10);
  color: #fff;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.filter-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.count-select {
  padding: 8px 14px;
  font-size: 13px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.count-select:focus {
  border-color: var(--accent-10);
  outline: none;
}

.btn-start {
  padding: 10px 28px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--accent-10), #2563EB);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-start:active {
  transform: translateY(0);
}

/* 最近记录 */
.recent-list {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  transition: background 0.15s ease;
}

.recent-item:hover {
  background: var(--bg-secondary);
}

.recent-item:last-child { border-bottom: none; }
.r-mode {
  font-weight: 600;
  color: var(--text-primary);
  width: 60px;
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 12px;
  text-align: center;
}
.r-lang { color: var(--text-muted); flex: 1; }
.r-acc { font-weight: 600; font-family: var(--mono); }
.r-acc.ok { color: var(--correct); }
.r-acc.fail { color: var(--incorrect); }
.empty {
  padding: 32px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

/* 右侧统计面板 */
.stats-panel {
  width: 260px;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  padding: 20px 16px;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-card {
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.chart-box {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 12px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 100px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, var(--accent-10), #2667E8);
  border-radius: 3px 3px 0 0;
  min-height: 4px;
}

.bar-label { font-size: 10px; color: var(--text-muted); }

.lang-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.lang-row:last-child { margin-bottom: 0; }
.lang-name { font-size: 12px; color: var(--text-secondary); width: 50px; }
.lang-track { flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
.lang-fill { height: 100%; background: linear-gradient(90deg, var(--accent-10), #2667E8); border-radius: 3px; }
.lang-pct { font-size: 12px; font-weight: 600; color: var(--text-primary); width: 32px; text-align: right; }

/* 移动端响应式 */
@media (max-width: 768px) {
  .home-layout {
    height: auto;
    min-height: 100%;
  }

  .top-bar {
    flex-wrap: wrap;
  }

  .stat-item {
    flex: 1 1 33%;
    min-width: 0;
    padding: 10px 12px;
  }

  .stat-item.goal {
    flex: 1 1 100%;
    flex-direction: row;
    justify-content: center;
    gap: 12px;
    padding: 12px;
  }

  .stat-value {
    font-size: 18px;
  }

  .main-area {
    flex-direction: column;
    overflow: visible;
    height: auto;
  }

  .train-config {
    padding: 16px;
    overflow-y: visible;
    height: auto;
  }

  .mode-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .mode-card {
    padding: 12px;
  }

  .mode-name {
    font-size: 13px;
  }

  .mode-desc {
    font-size: 10px;
  }

  .filter-bar {
    padding: 16px;
    overflow: visible;
  }

  .filter-group {
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .tags {
    gap: 6px;
  }

  .tag {
    padding: 6px 12px;
    font-size: 12px;
  }

  .filter-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .count-select {
    flex: 1;
    min-width: 100px;
    padding: 10px 12px;
  }

  .btn-start {
    width: 100%;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    display: block;
  }

  .stats-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--border);
    padding: 16px;
  }

  .bar-chart {
    height: 80px;
  }
}
</style>
