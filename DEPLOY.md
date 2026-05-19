# Dealzy 部署指南

## 一、GitHub 仓库创建

### 步骤 1：创建 GitHub 仓库
1. 登录 GitHub：https://github.com
2. 点击右上角 **+** → **New repository**
3. 填写：
   - Repository name: `dealzy`
   - Description: `迪拜房产 AI 客服系统 - AI-powered Dubai real estate platform`
   - Visibility: **Public**（或 Private）
   - ✅ Initialize with README（如果已有本地 README 可不选）
4. 点击 **Create repository**

### 步骤 2：推送代码到 GitHub
```powershell
# 进入项目目录
cd C:\Users\86178\.openclaw\workspace\dealzy

# 配置 Git 用户（首次使用）
git config user.email "your-email@example.com"
git config user.name "Your Name"

# 添加远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/dealzy.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 二、Vercel 部署

### 步骤 1：登录 Vercel
1. 访问：https://vercel.com
2. 使用 GitHub 账号登录

### 步骤 2：导入项目
1. 点击 **Add New...** → **Project**
2. 找到 `dealzy` 仓库 → 点击 **Import**
3. 配置：
   - Framework Preset: **Vite**
   - Root Directory: `./`（默认）
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 点击 **Deploy**

### 步骤 3：等待部署完成
- 首次部署约 2-5 分钟
- 部署成功后会获得域名：`https://dealzy-xxx.vercel.app`

### 步骤 4：绑定自定义域名（可选）
1. 进入项目 **Settings** → **Domains**
2. 添加域名：`dealzy.ae` 或 `dealzy.dubai`
3. 按提示配置 DNS

---

## 三、后端 API 部署（可选）

### 方案 A：Vercel Serverless Functions
1. 将 `backend/server.js` 移至 `api/index.js`
2. 修改为 Vercel Function 格式
3. 重新部署

### 方案 B：独立部署（推荐）
**平台选择：**
- Railway.app（免费额度）
- Render.com（免费额度）
- 阿里云（国内访问快）

**部署步骤（以 Railway 为例）：**
1. 登录：https://railway.app
2. New Project → Deploy from GitHub repo
3. 选择 `dealzy` 仓库
4. 设置环境变量：
   - `PORT`: 3001
   - `KNOWLEDGE_BASE_PATH`: ./knowledge-base.json
5. Deploy

---

## 四、环境变量配置

### 前端（Vercel）
在 Vercel 项目 Settings → Environment Variables 添加：
```
VITE_API_URL=https://your-api-url.com
```

### 后端（Railway/Render）
```
PORT=3001
NODE_ENV=production
```

---

## 五、测试清单

- [ ] 首页正常加载
- [ ] 房源列表显示
- [ ] AI 客服聊天正常
- [ ] 销售后台可访问
- [ ] 移动端适配正常
- [ ] 自定义域名生效（如有）

---

## 六、后续优化

1. **性能优化：**
   - 图片 CDN
   - 代码分割
   - 缓存策略

2. **SEO 优化：**
   - Meta 标签
   - Sitemap
   - Google Analytics

3. **监控：**
   - Vercel Analytics
   - Sentry 错误追踪

---

**部署完成后，将链接发给丽姐检查！** 🚀
