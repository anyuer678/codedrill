# CodeDrill

离线编程训练系统 — 最终版

支持 Web、Windows、Android 三端运行。通过代码临摹、填空、改错等训练模式，帮助开发者形成编程肌肉记忆。

---

## 快速开始

```bash
npm install    # 安装依赖
npm run dev    # 启动开发服务器
```

访问 http://localhost:3000

---

## 命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 代码检查 |
| `npm run lint:fix` | 自动修复代码问题 |
| `npm run cap:sync` | 同步 Capacitor (Android) |

---

## 功能

### 训练模式
- **代码临摹** — 照抄代码，熟悉语法结构
- **代码填空** — 填写缺失的代码部分
- **改错练习** — 找出并修复代码错误
- **限时速写** — 限时训练反射
- **竞技场** — 连击挑战
- **限时挑战** — 多题型限时

### 学习体系
- 成就系统 — 完成特定目标解锁成就
- 技能树 — 可视化技能掌握进度
- 遗忘曲线复习 — 基于艾宾浩斯曲线智能复习
- 22 种浅色主题

**支持语言：** Java、Python、C++、JavaScript、TypeScript、Linux、SQL

**训练模块：** 循环、条件、数组、字符串、函数、类与对象、输入输出

---

## 项目结构

```
CodeDrill/
├── src/                  # Vue 3 前端源码
│   ├── views/            # 页面（首页、训练、统计等）
│   ├── stores/           # Pinia 状态管理
│   ├── components/       # 通用组件
│   ├── design-system/    # 设计系统（主题、颜色、字体）
│   ├── router/           # 路由配置
│   ├── data/             # 静态数据
│   └── lib/              # 工具函数
├── core/                 # 题库数据
│   ├── questions/        # 225 道内置题目
│   └── bosses/           # Boss 关卡数据
├── electron/             # Electron 主进程
├── android/              # Android 工程（Capacitor）
├── public/               # 静态资源
├── docs/                 # 项目文档
├── scripts/              # 构建脚本
├── CHANGELOG.md          # 版本更新日志
└── README.md             # 本文件
