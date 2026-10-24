# kb-ui 试点：SettingsView 单视图迁移（go/no-go 闸门前置文档）

> 分支：`pilot/kb-ui` · 日期：2026-10-24 · 状态：**待本机验证**
> 目的：用最小代价回答"kb-ui-vue 能否作为 codedrill 的基础组件层"，验证点是**主题桥接**而非组件本身。

## 这个分支改了什么

| 文件 | 变更 |
|---|---|
| `src/views/SettingsView.vue` | 模板层基础件替换为 Kb 组件（详见下表）；script 加显式导入与 options 数组；样式基本不动 |
| `src/design-system/kb-bridge.css` | **新增**：kb-ui `--kb-*` 令牌 → codedrill 主题变量的桥接层（声明在 `body` 上，原理见文件头注释） |
| `package.json` | `+kb-ui-vue ^0.4.2`（依赖待 `npm install`） |
| 本文档 | 试点范围 / 验证步骤 / 回滚 / 闸门标准 |

### 替换明细

| 原生/class 件 | Kb 组件 | 数量 | 备注 |
|---|---|---|---|
| `<button class="btn [btn-primary\|btn-danger\|btn-sm]">` | `KbButton`（type/size 映射） | 12 | 含两个数据管理卡与确认弹窗按钮 |
| `label.btn` 包隐藏 file input（导入数据） | `KbButton` + `$refs.importFileInput` | 1 | 语义不变：点击触发隐藏 input |
| `select.select`（默认语言 / 时限） | `KbSelect :options` | 2 | options 数组式 API；时限项值为 number |
| `input.input type=number`（每日目标） | `KbInput type="number"` | 1 | KbInput 出参是字符串 → `clampGoal()` 转 number 并夹 [5,100] |
| `label.toggle` + checkbox（启用提醒） | `KbSwitch` | 1 | `@change="toggleReminder"` 语义保留 |
| 自研 modal-overlay/modal（确认弹窗） | `KbDialog`（default + footer 插槽） | 1 | Teleport 到 body——桥接层声明在 body 故主题仍生效 |

**刻意保留原生的**（试点决策，不视为迁移债务）：
- 界面主题下拉：依赖 `optgroup` 分组（六组 30+ 项），KbSelect 无分组支持——要么给 kb-ui 提 `option group` 需求，要么扁平化加前缀，留闸门后决策
- `input[type=time]`（提醒时间）：KbInput 仅支持 text/password/number

## 本机验证步骤（约 10 分钟）

```bash
git fetch && git checkout pilot/kb-ui
npm install                 # 新增 kb-ui-vue
npm run dev                 # 打开设置页
```

检查清单（dark 与 codedrill 工坊默认两套主题各过一遍）：
1. 12 个按钮 + 2 个下拉 + 数字输入 + 开关 + 确认弹窗全部渲染、可交互
2. **主题联动**：切到 dark → Kb 组件跟随变暗且与周边原生控件无割裂；切到任意浅色主题 → Kb 组件底色/描边/文字跟卡片刻度一致
3. 导入数据 / 清除数据 / 提醒开关的**功能**与 master 一致（这单视图承担全部数据管理操作）
4. `npm run build` 通过（Electron 打包前）
5. 既有 vitest：`npx vitest run`（本视图无专属测试，不应有回归）

## 回滚

`git checkout master` 即可，无任何全局文件被改动（main.js、vite.config.js、design-system 既有文件均未碰）。

## 闸门标准（过了才谈推广 19 视图）

- [ ] 上述 5 项检查全过
- [ ] 视觉可接受度：Kb 按钮高度/密度与 codedrill `.btn`（44px）差异是否可接受——不可接受则在桥接层加 `--kb-*` 高度令牌覆盖（需 kb-ui 支持）或放弃
- [ ] 主题桥接方案定性：body 级 var() 间接引用（当前方案，零维护联动全部主题） vs 逐主题 `--kb-*` 覆盖（精确但 ×17 主题）——试点结论写回本文件

## 推广前的已知债务（若闸门通过）

1. `.btn/.modal` 系列死样式清理（本分支为最小 diff 暂留）
2. vite.config.js 换 `unplugin-vue-components` + `KbResolver` 自动导入（省显式 import）
3. kb-ui 侧需求回流：Select 分组支持、Input 的 min/max 透传
4. kb-ui quickstart 包名 bug 已在 `kb-ui@docs/fix-quickstart-styles-path` 修复（2026-10-24）
