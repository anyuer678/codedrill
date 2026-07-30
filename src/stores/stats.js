import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { storage } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";

export const useStatsStore = defineStore("stats", () => {
  const totalAttempted = ref(0);
  const totalCorrect = ref(0);
  const byMode = ref({});
  const byLanguage = ref({});
  const history = ref([]);

  const accuracy = computed(() => {
    if (totalAttempted.value === 0) {return 0;}
    return Math.round((totalCorrect.value / totalAttempted.value) * 100);
  });

  function load() {
    const saved = storage.get(STORAGE_KEYS.STATS, {});
    totalAttempted.value = saved.totalAttempted || 0;
    totalCorrect.value = saved.totalCorrect || 0;
    byMode.value = saved.byMode || {};
    byLanguage.value = saved.byLanguage || {};
    history.value = saved.history || [];
  }

  function save() {
    storage.set(STORAGE_KEYS.STATS, {
      totalAttempted: totalAttempted.value,
      totalCorrect: totalCorrect.value,
      byMode: byMode.value,
      byLanguage: byLanguage.value,
      history: history.value,
    });
  }

  function recordSession({ mode, language, attempted, correct, avgTime }) {
    totalAttempted.value += attempted;
    totalCorrect.value += correct;

    if (!byMode.value[mode]) {
      byMode.value[mode] = { attempted: 0, correct: 0 };
    }
    byMode.value[mode].attempted += attempted;
    byMode.value[mode].correct += correct;

    if (!byLanguage.value[language]) {
      byLanguage.value[language] = { attempted: 0, correct: 0 };
    }
    byLanguage.value[language].attempted += attempted;
    byLanguage.value[language].correct += correct;

    history.value.unshift({
      timestamp: new Date().toISOString(),
      mode,
      language,
      attempted,
      correct,
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      avgTime,
    });

    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100);
    }

    save();
  }

  function getModeRate(mode) {
    const data = byMode.value[mode];
    if (!data || data.attempted === 0) {return 0;}
    return Math.round((data.correct / data.attempted) * 100);
  }

  function getLanguageRate(language) {
    const data = byLanguage.value[language];
    if (!data || data.attempted === 0) {return 0;}
    return Math.round((data.correct / data.attempted) * 100);
  }

  function reset() {
    totalAttempted.value = 0;
    totalCorrect.value = 0;
    byMode.value = {};
    byLanguage.value = {};
    history.value = [];
    save();
  }

  load();

  return {
    totalAttempted,
    totalCorrect,
    byMode,
    byLanguage,
    history,
    accuracy,
    recordSession,
    getModeRate,
    getLanguageRate,
    reset,
    load,
  };
});
