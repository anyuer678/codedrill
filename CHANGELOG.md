# Changelog

All notable changes to this project will be documented in this file.

## v1.2.0 (2026-10-10)

### 新功能
- **ph2drill 题解转换器**（#34）：polycodehub approved 题解 → 本仓自定义题库 JSON，20 项单测；与 polycodehub 构成「真实判分 → 离线抄写强化」学习闭环
- 自定义题库列表修复（#34）：导入/添加后列表即时刷新（原 computed 依赖 localStorage 非响应式，导入成功后停留空态）

### 修复
- **判分链修复**（#26）：fill/debug 题型计分与错误注入修复

### 变更
- Electron 39 → 41（#25）
- README 生态节：三主线作品集联动说明（#33）；vue 3.5.42 安全修复（#32）及多项依赖升级

## Unreleased

- 1a867e7 fix: 六个视图添加 IME composition 检查（中文输入法不误触发 Enter）
- 7887b8d chore: 移除误入仓库的验证脚本 verify_t3.py
- 5f494ee fix: 保存按钮改为写 store 的 training_progress（清理无人读取的 codedrill_train_progress 死键）
- 803f0c7 perf: 题库懒加载（动态 import + Vite code-split）
- e2dc8e8 refactor: ChallengeView/SrsView tokenizer 收敛到 lib/trainTyping，消除两份拷贝
- f68e306 fix: linux_* 题库改名 bash_*，修正语言命名（5 文件重命名 + 9 文件引用更新）
- eecd41d chore: 移除 electron 生产 console.log；author 修正为实际作者
- ccef70b refactor: TrainView 拆出 3 个子组件，清理死样式（1379→795 行）
- 4d3973d refactor: 抽出 lib/useTypingSession.js——训练页输入行状态机 composable
- c61b100 refactor: 抽出 lib/trainTyping.js——训练页词法/对比纯函数库
- cb42cb9 fix: 重算 package-lock（此前 lock 为加入 electron/capacitor 前的旧文件，npm ci 因缺 8 个直接依赖必然失败）
- 5a63cbc fix: 题库单一数据源——删除 src/data 镜像，lib 直接引用 core/
- b7a5fa6 fix: 同步 core/knowledge_graph.json 到 v2.0（与 src/data 一致）
- 7f83e9f chore: 移除脚本，更新视图
- c5ee904 docs: 添加 GitHub Pages 在线预览徽标与功能受限声明
- f322a87 init: 初始提交 — CodeDrill 离线编程训练系统

