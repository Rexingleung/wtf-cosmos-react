# WTF Cosmos JS - React Version

这是基于原 [wtf-cosmos-js-fixed](https://github.com/Rexingleung/wtf-cosmos-js-fixed) 项目的现代化 React + TypeScript 实现。

## 🚀 技术栈

- ⚛️ **React 18** - 现代化的用户界面库
- 🔷 **TypeScript** - 类型安全的JavaScript
- ⚡ **Vite** - 快速的构建工具
- 🎨 **TailwindCSS** - 实用优先的CSS框架
- 🎯 **Lucide React** - 美观的图标库
- 🎭 **玻璃态设计** - 现代化的UI设计风格

## ✨ 功能特性

- 🚀 **区块链管理** - 初始化和监控区块链状态
- 💰 **钱包功能** - 创建钱包、查询余额
- 💸 **转账交易** - 快速安全的资金转移
- ⛏️ **挖矿控制** - 启动和停止挖矿操作
- 📦 **区块浏览** - 查看最新区块信息
- 📊 **实时监控** - 自动更新统计数据
- 🎨 **响应式设计** - 适配各种屏幕尺寸
- 🌊 **流畅动画** - 优雅的用户交互体验

## 🏗️ 项目结构

```
src/
├── components/           # React组件
│   ├── ui/              # 基础UI组件
│   │   ├── Button.tsx   # 按钮组件
│   │   ├── Card.tsx     # 卡片组件
│   │   ├── Input.tsx    # 输入框组件
│   │   └── Notification.tsx # 通知组件
│   ├── Hero.tsx         # 欢迎区域
│   ├── Navbar.tsx       # 导航栏
│   ├── StatsCards.tsx   # 统计卡片
│   ├── TransferForm.tsx # 转账表单
│   ├── WalletManager.tsx # 钱包管理
│   ├── MiningControl.tsx # 挖矿控制
│   └── LatestBlocks.tsx # 最新区块
├── hooks/               # 自定义Hooks
│   └── useBlockchainStats.ts # 区块链统计数据
├── types/               # TypeScript类型定义
│   └── index.ts         # 通用类型
├── lib/                 # 工具库
│   └── utils.ts         # 工具函数
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/Rexingleung/wtf-cosmos-react.git
cd wtf-cosmos-react

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 启动开发服务器
npm run dev
```

### 构建和部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint
```

## 🔧 配置说明

### 环境变量

在 `.env` 文件中配置以下变量：

```env
# 后端API地址
VITE_API_BASE=http://localhost:3000

# 开发模式
VITE_DEV_MODE=true

# 调试日志
VITE_DEBUG=false
```

### 后端服务

此前端项目需要配合后端API服务使用。后端服务提供以下接口：

- `GET /api` - 获取区块链统计信息
- `POST /api/wallets` - 创建新钱包
- `GET /api/wallets/{address}/balance` - 查询钱包余额
- `POST /api/transactions` - 创建新交易
- `POST /api/mining/start` - 开始挖矿
- `POST /api/mining/stop` - 停止挖矿
- `GET /api/mining/status` - 获取挖矿状态
- `GET /api/blockchain/blocks` - 获取区块列表

## 🎨 设计特色

- **玻璃态效果** - 使用 backdrop-blur 和透明度创建现代感
- **渐变背景** - 美观的紫蓝色渐变背景
- **流畅动画** - 页面加载和交互的平滑过渡
- **响应式布局** - 完美适配桌面和移动设备
- **直观图标** - 使用 Lucide React 提供清晰的视觉提示

## 🔗 相关项目

- [原项目 - wtf-cosmos-js](https://github.com/Rexingleung/wtf-cosmos-js)
- [修复版本 - wtf-cosmos-js-fixed](https://github.com/Rexingleung/wtf-cosmos-js-fixed)

## 📱 截图预览

*项目启动后可以看到现代化的区块链学习界面*

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢 WTF Academy 提供的原始区块链实现，为学习和理解区块链技术提供了宝贵的资源。