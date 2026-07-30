import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
// 设计系统：基础 tokens（米色 / 字体栈 / 间距 / 圆角 / 阴影）
import "./design-system/tokens-base.css";
// 设计系统：组件 + 图标
import "./design-system/components.css";
import "./design-system/icons.css";
// V80 预览版增强：42图标 + 纸纹主题
import "./design-system/icons-v2.css";
import "./design-system/theme-enhanced.css";
import "./design-system/theme-codedrill.css";
// 项目原有主题（light/dark），后加载以覆盖设计系统同名变量
import "./theme.css";
// V27 预览版主题系统 + CodeDrill 组件样式
import "./design-system/preview-theme.css";
import "./design-system/preview-cd.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
