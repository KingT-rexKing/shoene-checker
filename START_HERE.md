# 省エネチェッカー — 从零开始的搭建指南

## 你的电脑需要装什么

只需要装两样东西：

### 1. Node.js（JavaScript的运行环境）
- 去 https://nodejs.org 下载 **LTS版本**（左边那个绿色按钮）
- 双击安装，一路Next就行
- 装完后打开终端（Mac: Terminal / Windows: PowerShell），输入：
  ```
  node --version
  ```
  如果显示类似 `v20.x.x` 就成功了

### 2. Git（代码版本管理工具）
- 去 https://git-scm.com 下载安装
- 装完后在终端输入：
  ```
  git --version
  ```
  如果显示版本号就成功了

### 可选但推荐：VS Code（代码编辑器）
- 去 https://code.visualstudio.com 下载
- 这是写代码的工具，免费的

---

## 第一次运行项目

打开终端，依次输入以下命令（每行输完按回车）：

```bash
# 1. 进入项目文件夹
cd shoene-checker

# 2. 安装依赖（项目需要的第三方代码包）
npm install

# 3. 启动开发服务器
npm run dev
```

然后打开浏览器，访问 http://localhost:3000

你应该能看到省エネチェッカー的界面了！

---

## 项目文件结构说明

```
shoene-checker/
├── src/
│   ├── app/              ← 页面（用户看到的东西）
│   │   ├── layout.tsx    ← 所有页面共用的外壳
│   │   ├── page.tsx      ← 首页
│   │   └── globals.css   ← 全局样式
│   ├── components/       ← 可复用的UI零件
│   │   └── Checker.tsx   ← 核心：问答+判定界面
│   ├── data/             ← 省エネ法的规则数据
│   │   └── rules.ts      ← 仕様基準的判定规则
│   └── engine/           ← 判定逻辑（厨师）
│       └── evaluate.ts   ← 读取输入→对比规则→输出结果
├── package.json          ← 项目配置（依赖、脚本等）
├── tsconfig.json         ← TypeScript配置
├── next.config.ts        ← Next.js配置
├── tailwind.config.ts    ← 样式框架配置
└── START_HERE.md         ← 你正在读的这个文件
```

---

## 修改和扩展

### 想改规则？
编辑 `src/data/rules.ts`。里面的数据结构很直观——每个地域、每个部位都有对应的基准值。

### 想改界面？
编辑 `src/components/Checker.tsx`。这是用户看到的问答界面。

### 想加新的建筑类型？
在 `src/data/rules.ts` 里加新的规则，`src/engine/evaluate.ts` 里加对应的判定逻辑。

---

## 部署到网上（让别人也能用）

1. 在 GitHub.com 创建一个新仓库（repository）
2. 把代码push上去：
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/你的用户名/shoene-checker.git
   git push -u origin main
   ```
3. 去 https://vercel.com 用GitHub账号登录
4. 点 "Import Project" → 选你的仓库 → Deploy
5. 几十秒后你就有一个公开的网址了！
