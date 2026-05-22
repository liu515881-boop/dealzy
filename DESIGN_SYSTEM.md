# Dealzy 设计系统 v2.0

**最后更新：** 2026-05-22  
**参考风格：** Property Finder（主）+ Bayut（辅）

---

## 🎨 色彩系统

### 主色调
```css
--color-primary: #1a365d;        /* 深蓝 - 专业、信任、科技感 */
--color-primary-hover: #152a4a;  /* 悬停状态 */
--color-primary-light: #e8f0f8;  /* 浅色背景 */
```

### 中性色
```css
--color-bg: #F8F9FA;             /* 页面背景 */
--color-card: #FFFFFF;           /* 卡片背景 */
--color-text: #1a202c;           /* 主要文字 */
--color-text-secondary: #718096; /* 次要文字 */
--color-text-muted: #a0aec0;     /* 弱化文字 */
--color-border: #e2e8f0;         /* 边框 */
```

### 功能色
```css
--color-success: #38a169;        /* 成功/出售 */
--color-warning: #d69e2e;        /* 警告/进行中 */
--color-error: #e53e3e;          /* 错误/已售 */
--color-info: #3182ce;           /* 信息/出租 */
```

### 使用规范
- ✅ **主色仅用于：** 关键按钮、选中态、重要链接、价格高亮
- ❌ **禁止：** 大面积渐变、背景铺满、装饰性使用

---

## 📏 间距系统

**基准单位：** 8px（所有间距为 8 的倍数）

```css
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

### 卡片间距
- 卡片内边距：16px
- 卡片间距：16px（移动端）、24px（桌面端）
- 页面边距：16px（移动端）、40px（桌面端）

---

## 🔤 字体系统

### 字体栈
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro', 'Roboto', sans-serif;
```

### 字号层次
| 用途 | 字号 | 字重 | 行高 | 颜色 |
|------|------|------|------|------|
| 大标题 | 28px | 700 | 1.2 | --color-text |
| 页面标题 | 24px | 600 | 1.3 | --color-text |
| 卡片标题 | 18px | 600 | 1.4 | --color-text |
| 正文 | 16px | 400 | 1.6 | --color-text |
| 次要文字 | 14px | 400 | 1.5 | --color-text-secondary |
| 辅助文字 | 13px | 400 | 1.4 | --color-text-muted |
| 价格 | 22px | 700 | 1.2 | --color-primary |

### 移动端注意
- 输入框字体 ≥16px（避免 iOS 自动缩放）
- 触摸目标 ≥44×44px

---

##  圆角系统

```css
--radius-sm: 8px;    /* 小按钮、标签 */
--radius-md: 12px;   /* 卡片、输入框 */
--radius-lg: 16px;   /* 大卡片、模态框 */
--radius-full: 9999px; /* 圆形按钮、头像 */
```

### 使用规范
- 卡片：12px
- 按钮：8px（小）、12px（大）
- 输入框：12px
- 头像：50%

---

##  阴影系统

### 平时无阴影
- 卡片默认无阴影或极浅边框

### 悬停阴影
```css
box-shadow: 0 4px 12px rgba(0,0,0,0.05);
```

### 悬浮元素阴影
```css
box-shadow: 0 8px 24px rgba(0,0,0,0.08); /* 聊天窗口、下拉菜单 */
```

### 使用规范
- ❌ 禁止重阴影（rgba 透明度不超过 0.1）
- ❌ 禁止多层阴影
- ✅ 悬停时才显示阴影

---

## 🎭 图标系统

### 图标库
**Lucide Icons** - https://lucide.dev

### 使用规范
- Stroke 宽度：1.5px（统一）
- 尺寸：20px（小）、24px（中）、28px（大）
- 颜色：跟随文字颜色
- 移动端底部导航：线性图标（非填充）

### 常用图标
```
Home, Map, Message, User, Search, Filter, Heart, Share, Phone,
Mail, Check, X, ChevronDown, ChevronRight, Upload, Camera,
DollarSign, MapPin, Bed, Bath, Square, Layers
```

---

## 🎬 动效系统

### 过渡时间
```css
--transition-fast: 150ms;
--transition-normal: 200ms;
--transition-slow: 300ms;
```

### 缓动函数
```css
--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
```

### 使用规范
- 按钮悬停：200ms
- 页面切换：300ms
- 微交互：150ms
- ❌ 禁止夸张弹跳、旋转、闪动

---

## 📱 组件规范

### 房源卡片
```
┌─────────────────────────┐
│     图片 (16:9)          │
│  [AI 生成] 标签 (左上)    │
├─────────────────────────┤
│  价格 AED 80,000/年     │  ← 22px 加粗 主色
│  标题 DSO 2BHK          │  ← 18px 半粗
│  📍 Dubai Silicon Oasis │  ← 14px 灰色
│  🏠 2 卧室 • 1200 尺     │  ← 14px 灰色
│  [联系销售] 按钮         │  ← 主色 圆角 8px
└─────────────────────────┘
```

**间距：** 内边距 16px，卡片间距 16px  
**圆角：** 12px  
**阴影：** 悬停时 0 4px 12px rgba(0,0,0,0.05)

### AI 聊天窗口
```
┌─────────────────────────┐
│ AI 助手 [×]             │  ← 标题栏 主色背景
├─────────────────────────┤
│ [AI] 你好，有什么...    │  ← 左对齐 白色底
│           我想找 2BHK [你]│  ← 右对齐 浅灰底
│ [AI] 好的，DSO 有...    │
├─────────────────────────┤
│ [输入框...]    [发送]   │  ← 底部固定
│ AI 建议仅供参考...      │  ← 13px 灰色 免责
└─────────────────────────┘
```

**尺寸：** 宽 360px，高 480px（移动端）  
**位置：** 右下角，距边 16px  
**圆角：** 16px

### 按钮
| 类型 | 背景 | 文字 | 圆角 | 使用场景 |
|------|------|------|------|----------|
| 主按钮 | --color-primary | 白色 | 8px | 关键操作（联系、提交） |
| 次按钮 | 透明 | --color-primary | 8px | 次要操作（取消、返回） |
| 文字按钮 | 无 | --color-text | - | 低优先级操作 |

---

## 📐 布局规范

### 桌面端
- 最大宽度：1200px
- 页面边距：40px
- 列数：3 列（房源列表）

### 移动端
- 页面边距：16px
- 列数：2 列（房源列表，瀑布流）
- 底部导航：5 项以内

---

## ✅ 检查清单

### 上线前必须检查
- [ ] Lighthouse 移动端 ≥90 分
- [ ] 所有图片 WebP 格式
- [ ] 图片加载 <1.5 秒（4G）
- [ ] 触摸目标 ≥44×44px
- [ ] 字体层次清晰
- [ ] 无多余装饰元素
- [ ] 阴影符合规范
- [ ] 图标统一 Lucide
- [ ] 主色使用克制
- [ ] 留白充足（≥16px）

---

**此文档为硬性标准，所有页面必须遵守。**
