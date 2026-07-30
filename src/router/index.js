import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/train/:mode",
    name: "Train",
    component: () => import("@/views/TrainView.vue"),
  },
  {
    path: "/reflex",
    name: "Reflex",
    component: () => import("@/views/ReflexView.vue"),
  },
  {
    path: "/arena",
    name: "Arena",
    component: () => import("@/views/ArenaView.vue"),
  },
  {
    path: "/skills",
    name: "Skills",
    component: () => import("@/views/SkillTreeView.vue"),
  },
  {
    path: "/graph",
    name: "Graph",
    component: () => import("@/views/GraphView.vue"),
  },
  {
    path: "/summary",
    name: "Summary",
    component: () => import("@/views/SummaryView.vue"),
  },
  {
    path: "/stats",
    name: "Stats",
    component: () => import("@/views/StatsView.vue"),
  },
  {
    path: "/achievements",
    name: "Achievements",
    component: () => import("@/views/AchievementView.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/SettingsView.vue"),
  },
  {
    path: "/history",
    name: "History",
    component: () => import("@/views/HistoryView.vue"),
  },
  {
    path: "/daily",
    name: "Daily",
    component: () => import("@/views/DailyView.vue"),
  },
  {
    path: "/report",
    name: "Report",
    component: () => import("@/views/ReportView.vue"),
  },
  {
    path: "/plan",
    name: "Plan",
    component: () => import("@/views/PlanView.vue"),
  },
  {
    path: "/wrongbook",
    name: "WrongBook",
    component: () => import("@/views/WrongBookView.vue"),
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: () => import("@/views/FavoritesView.vue"),
  },
  {
    path: "/replay",
    name: "Replay",
    component: () => import("@/views/ReplayView.vue"),
  },
  {
    path: "/custom",
    name: "CustomQuestions",
    component: () => import("@/views/CustomQuestionsView.vue"),
  },
  {
    path: "/challenge",
    name: "Challenge",
    component: () => import("@/views/ChallengeView.vue"),
  },
  {
    path: "/srs",
    name: "SRS",
    component: () => import("@/views/SrsView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
