# Arcaea Ban-Pick 模拟器 - 需求拆解文档

## 产品概述

- **产品类型**: 音游比赛 Ban-Pick 模拟工具
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: Arcaea 音游比赛组织者、选手、观众
- **核心价值**: 模拟双败淘汰赛制的 Ban-Pick 流程，可视化展示曲目选择和禁用过程
- **界面语言**: 英文
- **主题偏好**: dark（深色背景 #12121e）
- **导航模式**: 无导航（单页应用）

---

## 页面结构总览

**页面文件**: `BanPickPage.tsx`（单页应用，包含游戏主界面 + 结算面板）

| 区域 | 说明 |
|-----|------|
| Header | 比赛标题 "ACAHKU Arcaea Competition" + 副标题 "Double Elimination Round" + 轮次信息 |
| Status Bar | 当前操作提示（Ban 剩余次数 / Pick 剩余次数 / 轮次完成） |
| Hex Container | 6 张曲目卡片以六边形环排列（16:9 宽屏比例，水平拉伸） |
| Action Area | "Next Round" 按钮（轮次完成后显示） |
| Summary Panel | 全部轮次结束后显示 Ban & Pick 历史总结 |

---

## 页面布局建议

- **布局模式**: 上下分区 —— 顶部 Header + 中央六边形卡片环 + 底部操作区 + 可切换的总结面板
- **视觉重心**: 六边形卡片环（核心交互区），每张卡片为竖版矩形（160×220px），含曲绘 + 曲名 + 难度
- **结果承载区**: Summary Panel 初始态为隐藏（`display: none`），全部 14 轮完成后切换显示；每轮一条 round-summary 卡片

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 曲目列表（47首） | demo-mock | `src/data/songs.ts` 常量数组，含 name + difficulty 字段 | ✅ 本身就是 mock |
| 曲绘图片 | real-api | 从 `arcaea.fandom.com/wiki/Special:FilePath/` 动态加载，`onerror` 时显示文字回退 | 图片加载失败时显示曲名文字 |
| 轮次状态（ban/pick 历史） | local-persist | 每轮完成后 push 到 `allBannedHistory` / `allSelectedHistory` 数组，用于最终总结 | 无（运行时内存，无需持久化） |

---

## 功能列表

- **页面**: BanPickPage
  - **页面目标**: 模拟 14 轮双败淘汰 Ban-Pick 流程
  - **功能点**:
    - **曲目卡片渲染**: 每轮随机抽取 6 首未使用的曲目，以六边形环排列（上、右上、右下、下、左下、左上），卡片为竖版矩形（160×220px），含曲绘图片（Fandom wiki 动态加载）、曲名（长曲名 >18 字符自动缩小字号）、难度文本（加粗突出显示）
    - **难度边框着色**: 根据难度类型动态添加 CSS class（Beyond → 红色 #ef4444，Future → 紫色 #a855f7，Eternal → 淡紫色 #c4b5fd），边框 4px solid
    - **Ban 操作（前 2 次点击）**: 点击未操作的卡片 → 卡片叠加红色半透明遮罩 + "BANNED" 文字，状态栏更新剩余 Ban 次数
    - **Pick 操作（后 2 次点击）**: 点击未操作且未被 Ban 的卡片 → 卡片叠加绿色半透明遮罩 + "SELECTED" 文字，状态栏更新剩余 Pick 次数
    - **轮次完成判定**: 4 次点击完成后显示 "Next Round" 按钮，记录本轮 Ban/Pick 历史；第 14 轮按钮文案变为 "Show Final Summary"
    - **下一轮**: 点击 "Next Round" → 重置点击计数，重新抽取 6 首未使用曲目（优先从未使用池抽取，不足时从全曲库补充），渲染新卡片
    - **最终总结**: 全部 14 轮完成后，隐藏六边形容器和按钮，显示 Summary Panel，逐轮列出 Ban 和 Pick 的曲目名称
    - **图片加载回退**: 曲绘图片加载失败时隐藏 `<img>`，在 jacket-container 内居中显示曲名文字作为回退

---

## 核心机制

### 游戏规则
- **总轮数**: 14 轮
- **每轮操作**: 先 Ban 2 首 → 再 Pick 2 首（共 4 次点击）
- **曲目池**: 47 首预定义曲目，每轮优先从未使用池抽取 6 首，不足时从全曲库补充
- **随机算法**: Fisher-Yates 洗牌
- **操作约束**: 已 Ban/已 Pick 的卡片不可再次点击；点击次数达到 4 后锁定

### 交互反馈
| 操作 | 反馈 |
|------|------|
| 悬停未操作卡片 | 卡片 scale(1.05) + 紫色阴影 |
| 点击 Ban | 红色遮罩 + "BANNED" 文字 + 状态栏更新 |
| 点击 Pick | 绿色遮罩 + "SELECTED" 文字 + 状态栏更新 |
| 轮次完成 | "Next Round" 按钮显示 |
| 全部完成 | 六边形容器隐藏 → Summary Panel 显示 |

---

## 数据共享配置

无跨页面数据共享需求（单页应用）。

-------

设计规范文档生成失败