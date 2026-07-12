# Asuka's Art Gallery 🎨

> 个人美术作品集网站，提供沉浸式的艺术展示体验。支持 2D 画廊浏览与 Three.js 驱动的 3D 互动展厅，集成评论、点赞、收藏、带水印下载等社交功能。

## 项目简介

Asuka's Art Gallery 是一个面向个人艺术创作者的作品展示平台，收录了 high school level 与 college level 两个阶段的美术作品。项目采用原生 HTML/CSS/JavaScript 构建，结合 Three.js 实现沉浸式 3D 展厅，注重视觉表现力与交互体验。

## 核心特性

### 页面

- **首页（index.html）**：全屏沉浸式展示，5 秒缓动图片加载动画（模糊旋转→清晰），底部信息遮罩与中央进入按钮
- **作品展厅（gallery.html）**：轮播图 + 网格布局展示，分级标签切换（high school / college level），汉堡菜单导航
- **作品详情（detail.html）**：图片左右切换、全屏查看、带水印下载、点赞、收藏、非匿名评论区
- **3D 展示（index_3d.html）**：Three.js 驱动的圆形旋转木马展厅，支持拖拽旋转、滚轮缩放，玻璃态信息面板

### 功能

- 🌓 **昼夜模式**：一键切换明暗主题
- 📱 **响应式设计**：移动端汉堡菜单适配
- ✨ **玻璃态设计**：backdrop-filter 模糊与半透明卡片
- 💬 **评论系统**：非匿名评论，支持昵称与内容发布
- 👍 **互动反馈**：点赞、收藏功能
- 💾 **作品下载**：带水印的作品图片下载
- 🖼️ **全屏查看**：作品详情全屏沉浸浏览
- 🎭 **3D 互动**：Three.js 圆形展厅，拖拽与缩放

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 结构 | HTML5 |
| 样式 | CSS3（CSS 变量、backdrop-filter、动画） |
| 交互 | 原生 JavaScript |
| 3D 渲染 | Three.js r128 |
| 字体 | 系统字体 + 渐变文字效果 |

## 项目结构

```
ArtGallery/
├── index.html             # 首页（沉浸式展示）
├── gallery.html           # 作品展厅
├── detail.html            # 作品详情
├── index_3d.html          # 3D 沉浸式展厅
├── css/
│   └── style.css          # 全局样式与主题变量
├── js/
│   ├── config.js          # 配置（作品数据等）
│   └── main.js            # 主逻辑（渲染、交互、评论）
├── images/                # 作品图片资源
└── updat.bat              # 自动更新脚本
```

## 快速开始

### 在线访问

直接用浏览器打开任一 HTML 文件即可，无需安装任何依赖。

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/Gray-bottom/ArtGallery.git
cd ArtGallery

# 方式一：直接双击 index.html 打开

# 方式二：启动本地服务器（推荐，避免跨域问题）
# 使用 Python
python -m http.server 8000
# 然后访问 http://localhost:8000

# 或使用 Node.js
npx serve
```

>  3D 展示页（index_3d.html）依赖 CDN 加载 Three.js，首次打开需联网。

## 页面导航

```
首页 index.html
 ├── 进入 → 作品展厅 gallery.html
 │            └── 点击作品 → 作品详情 detail.html
 └── 3D 展示 index_3d.html
```

所有页面顶部导航互通，支持随时切换。作品展厅提供 high school level 与 college level 两个分级标签。

## 设计亮点

- **沉浸式加载动画**：首页图片从模糊旋转状态平滑过渡到清晰展现
- **渐变文字**：标题采用 `linear-gradient` + `background-clip: text` 实现渐变效果
- **浮动气泡装饰**：全页面浮动的装饰性气泡元素
- **四角光晕与几何装饰**：3D 页面的角落光效与几何线条点缀
- **玻璃态卡片**：`backdrop-filter: blur(10px)` 实现的毛玻璃质感

## 作者

**Asuka**

- QQ: 1946620514
- Email: 23069100154@stu.xidian.edu.cn
- GitHub: [Gray-bottom](https://github.com/Gray-bottom)

## License

© 2026 All Rights Reserved | Personal Art Exhibition
