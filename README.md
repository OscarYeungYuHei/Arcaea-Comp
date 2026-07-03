# Arcaea 对战选曲模拟器 — 直播版

一个面向直播场景的 **Arcaea 对战选曲模拟器**，专为 1920×1080 大屏设计，采用 Arcaea 官网美术风格与游戏内曲绘。

## 功能特性

- 🎮 **Ban/Pick 选曲流程** — 模拟完整的两轮 Ban/Pick 对战选曲
- 🎨 **Arcaea 美术风格** — 深色主题 + 游戏内曲绘卡片展示
- 📺 **直播大屏适配** — 1920×1080 分辨率优化布局
- 🎵 **多难度曲目支持** — 收录 Future / Beyond / Eternal 难度曲目
- ⚡ **纯前端运行** — 单个 HTML 文件，浏览器直接打开即可使用

## 快速开始

1. 克隆仓库
   ```bash
   git clone https://github.com/OscarYeungYuHei/Arcaea-Comp.git
   ```

2. 用浏览器打开 `arcaea-battle-simulator.html` 即可使用

## 项目结构

```
├── arcaea-battle-simulator.html  # 主程序
├── arcaea_illustrations/         # 曲绘资源
├── package.json                  # 项目配置
├── package-lock.json             # 依赖锁定
└── .gitignore                    # Git 忽略规则
```

## 技术栈

- 纯 HTML/CSS/JavaScript
- Playwright（截图/测试用）
- Google Fonts（Exo 2 / Titillium Web）

## License

ISC
