<div align="center">
  <h1>Sentry XCX</h1>
  <p>🚀 专为微信小程序设计的企业级 Sentry SDK 封装库</p>

  [![npm version](https://img.shields.io/npm/v/sentry-xcx.svg?style=flat-square)](https://www.npmjs.com/package/sentry-xcx)
  [![npm downloads](https://img.shields.io/npm/dm/sentry-xcx.svg?style=flat-square)](https://www.npmjs.com/package/sentry-xcx)
  [![license](https://img.shields.io/npm/l/sentry-xcx.svg?style=flat-square)](https://github.com/Weldon0/sentry-xcx/blob/main/LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Weldon0/sentry-xcx/pulls)

  <p>
    <a href="#特性">特性</a> •
    <a href="#安装">安装</a> •
    <a href="#快速开始">快速开始</a> •
    <a href="#api-文档">API 文档</a> •
    <a href="#示例">示例</a>
  </p>
</div>

---

## 📖 简介

**Sentry XCX** 是一个专为微信小程序打造的 Sentry SDK 增强封装库，提供了更简洁的 API、更强大的功能和更完善的类型支持。它能够帮助开发者快速集成错误监控、性能追踪和用户行为分析，让小程序的质量监控变得简单高效。

### 为什么选择 Sentry XCX？

- 🎯 **专为小程序优化** - 深度适配微信小程序环境，完美支持小程序生命周期
- 🛡️ **企业级可靠性** - 经过生产环境验证，服务于多个大型小程序项目
- 📦 **零配置开箱即用** - 简化繁琐的配置流程，一行代码完成初始化
- 🔧 **高度可定制** - 提供丰富的配置选项和钩子函数，满足各种业务场景
- 💪 **完整类型支持** - 100% TypeScript 编写，提供完整的类型定义和智能提示
- 🎨 **丰富的辅助工具** - 内置多种辅助函数和装饰器，简化日常开发

## ✨ 特性

### 核心功能

| 功能 | 说明 | 状态 |
|------|------|------|
| 🚨 **异常捕获** | 自动捕获未处理的异常和 Promise rejection | ✅ |
| 📊 **面包屑追踪** | 自动记录用户行为轨迹，还原问题现场 | ✅ |
| 🔄 **生命周期监控** | 自动包装 App 和 Page 生命周期 | ✅ |
| 🌐 **网络请求监控** | 自动记录网络请求和响应信息 | ✅ |
| 👤 **用户信息追踪** | 支持设置和追踪用户信息 | ✅ |
| 🎯 **自定义事件** | 支持自定义消息和事件上报 | ✅ |
| 🎭 **装饰器支持** | 提供装饰器自动捕获方法异常 | ✅ |
| 🔧 **灵活配置** | 丰富的配置选项和钩子函数 | ✅ |
| 💪 **TypeScript** | 完整的类型定义和智能提示 | ✅ |

### 技术特点

- ✅ **轻量级** - 打包后体积小，不影响小程序性能
- ✅ **无侵入** - 不改变原有代码结构，可随时移除
- ✅ **高性能** - 异步上报，不阻塞主线程
- ✅ **易调试** - 详细的日志输出，方便问题排查
- ✅ **易扩展** - 模块化设计，支持自定义扩展

---

## 📦 安装

### 使用 npm

```bash
npm install sentry-xcx --save
```

### 使用 yarn

```bash
yarn add sentry-xcx
```

### 使用 pnpm

```bash
pnpm add sentry-xcx
```

### 说明

`sentry-xcx` 已经内置了 `sentry-mina` 依赖，**无需单独安装**，开箱即用！

---

## 🚀 快速开始

### 1. 基础使用

在小程序的 `app.js` 中初始化：

```javascript
import sentryXCX from 'sentry-xcx';

App({
  onLaunch() {
    // 初始化 Sentry
    sentryXCX.init({
      dsn: 'http://your-sentry-dsn@your-domain/project-id',
      environment: 'production', // development/test/pre/production
      release: '1.0.0',
    });
  },
});
```

### 2. 使用 App 包装器（推荐）

自动捕获全局异常：

```javascript
import sentryXCX, { wrapApp } from 'sentry-xcx';

App(
  wrapApp({
    onLaunch() {
      sentryXCX.init({
        dsn: 'http://your-sentry-dsn@your-domain/project-id',
        environment: 'production',
        release: '1.0.0',
      });
    },
    // 其他生命周期...
  })
);
```

### 3. 使用页面包装器

自动记录页面访问和捕获异常：

```javascript
import { wrapPage } from 'sentry-xcx';

Page(
  wrapPage({
    data: {},
    onLoad(options) {
      // 页面加载逻辑
    },
    // 其他生命周期和方法...
  })
);
```

---

## 📖 API 文档

### 初始化配置

完整的配置选项说明：

```typescript
sentryXCX.init({
  // 必填：Sentry DSN 地址
  dsn: 'http://your-sentry-dsn@your-domain/project-id',

  // 可选：版本号，默认 '%VERSION%'（可在构建时替换）
  release: '1.0.0',

  // 可选：环境标识
  environment: 'production', // development/test/pre/production

  // 可选：是否启用 Sentry，默认 true
  enabled: true,

  // 可选：采样率，0-1 之间，默认 1.0
  sampleRate: 1.0,

  // 可选：是否记录 console 日志，默认 true
  enableConsole: true,

  // 可选：是否记录请求，默认 true
  enableRequest: true,

  // 可选：是否记录页面导航，默认 true
  enableNavigation: true,

  // 可选：是否记录小程序 API，默认 true
  enableApi: true,

  // 可选：是否记录生命周期，默认 true
  enableLifecycle: true,

  // 可选：是否记录未捕获错误，默认 true
  enableUnhandleError: true,

  // 可选：自定义标签
  tags: {
    appType: 'miniprogram',
    platform: 'wechat',
  },

  // 可选：在初始化前的钩子函数
  beforeInit: (config) => {
    console.log('Sentry 即将初始化', config);
    return config;
  },

  // 可选：在发送事件前的钩子函数
  beforeSend: (event, hint) => {
    // 可以修改或过滤事件
    if (event.user) {
      delete event.user.phone; // 移除敏感信息
    }
    return event;
  },

  // 可选：在发送面包屑前的钩子函数
  beforeBreadcrumb: (breadcrumb, hint) => {
    // 可以修改或过滤面包屑
    return breadcrumb;
  },
});
```

### 核心 API 方法

#### 1. 设置用户信息

```javascript
import sentryXCX from 'sentry-xcx';

// 登录成功后设置用户信息
sentryXCX.setUser({
  id: 'user-id',
  username: 'username',
  phone: '138****0000',
  openid: 'wx-openid',
});

// 退出登录时清空用户信息
sentryXCX.clearUser();
```

#### 2. 使用辅助函数设置微信用户信息

```javascript
import { setUserFromWechat, clearUserInfo } from 'sentry-xcx';

// 从微信用户信息自动设置
setUserFromWechat({
  basic_uid: 'user-id',
  nickname: 'username',
  pure_phone_number: '138****0000',
  openid: 'wx-openid',
});

// 退出登录时清空用户信息
clearUserInfo();
```

#### 3. 捕获消息

```javascript
import sentryXCX from 'sentry-xcx';

sentryXCX.captureMessage('用户完成了支付', 'info');
```

#### 4. 捕获异常

**✨ 自动处理对象错误，避免 `[object Object]` 问题**

```javascript
import sentryXCX, { captureError } from 'sentry-xcx';

// 方式1：直接捕获（支持任意类型的错误）
try {
  throw new Error('Something went wrong');
} catch (error) {
  sentryXCX.captureException(error);
}

// 方式2：捕获微信 API 返回的对象错误
wx.request({
  url: 'https://api.example.com/data',
  fail: (err) => {
    // err 是对象：{ errMsg: "request:fail", errno: 600001 }
    // 会自动转换为可读的错误信息，而不是 [object Object]
    sentryXCX.captureException(err);
  }
});

// 方式3：使用辅助函数，带上下文信息（推荐）
captureError(
  { code: 1001, message: '支付失败' },
  {
    scene: 'checkout',
    orderId: '123456',
    amount: 99.99
  }
);
```

#### 5. 设置标签和上下文

```javascript
import sentryXCX from 'sentry-xcx';

// 设置单个标签
sentryXCX.setTag('page', 'checkout');

// 设置多个标签
sentryXCX.setTags({
  feature: 'payment',
  version: '2.0',
});

// 设置上下文信息
sentryXCX.setContext('order', {
  orderId: '123456',
  amount: 99.99,
});

// 设置额外数据
sentryXCX.setExtra('debug_info', { foo: 'bar' });
```

#### 6. 添加面包屑

```javascript
import sentryXCX from 'sentry-xcx';

sentryXCX.addBreadcrumb({
  message: '用户点击了购买按钮',
  category: 'user-action',
  data: {
    productId: '123',
  },
});
```

---

## 🎨 辅助函数

### 用户信息管理

#### 设置微信用户信息

```javascript
import { setUserFromWechat } from 'sentry-xcx';

// 登录成功后，从微信用户信息自动设置
setUserFromWechat({
  basic_uid: 'user-id',
  nickname: 'username',
  pure_phone_number: '138****0000',
  openid: 'wx-openid',
});
```

#### 清除用户信息

```javascript
import { clearUserInfo } from 'sentry-xcx';

// 用户退出登录时清空用户信息
clearUserInfo();
```

### 页面访问追踪

```javascript
import { logPageView } from 'sentry-xcx';

logPageView('/pages/index/index', { from: 'share' });
```

### 网络请求监控

```javascript
import { logRequest } from 'sentry-xcx';

logRequest('https://api.example.com/users', 'GET', 200, 150);
```

### 用户行为记录

```javascript
import { logUserAction } from 'sentry-xcx';

logUserAction('点击购买按钮', { productId: '123' });
```

### 业务日志记录

```javascript
import { logBusiness } from 'sentry-xcx';

logBusiness('订单创建成功', { orderId: '123456' });
```

### 智能错误捕获

**✨ 自动处理对象错误，避免 `[object Object]` 问题**

```javascript
import { captureError } from 'sentry-xcx';

// 场景1：捕获微信 API 错误
wx.request({
  url: 'https://api.example.com/data',
  fail: (err) => {
    // err 通常是对象：{ errMsg: "request:fail timeout", errno: 600001 }
    // 自动提取错误信息，不会显示 [object Object]
    captureError(err, {
      api: 'wx.request',
      url: 'https://api.example.com/data'
    });
  }
});

// 场景2：捕获业务错误对象
const handlePayment = async () => {
  try {
    const result = await paymentAPI();
    if (result.code !== 0) {
      // 上报业务错误，带上下文
      captureError(result, {
        scene: 'payment',
        userId: getCurrentUserId(),
        amount: 99.99
      });
    }
  } catch (error) {
    captureError(error, { scene: 'payment' });
  }
};

// 场景3：捕获复杂对象错误
captureError(
  {
    code: 'NETWORK_ERROR',
    message: '网络请求失败',
    details: { timeout: 5000, retries: 3 }
  },
  {
    page: 'checkout',
    timestamp: Date.now()
  }
);
```

**优势：**
- ✅ 自动识别并提取错误信息（支持 `message`、`errMsg`、`msg`、`error` 等字段）
- ✅ 智能序列化对象，避免 `[object Object]`
- ✅ 处理循环引用，防止序列化失败
- ✅ 保留原始错误对象作为额外数据
- ✅ 支持添加上下文信息，便于问题定位

---

## 🔄 高级功能

### 函数包装器

自动捕获函数执行过程中的异常：

#### 异步函数包装

```javascript
import sentryXCX from 'sentry-xcx';

const fetchData = sentryXCX.wrapAsync(async () => {
  const res = await wx.request({ url: 'https://api.example.com/data' });
  return res.data;
});

// 异常会自动被捕获并上报
fetchData();
```

#### 同步函数包装

```javascript
import sentryXCX from 'sentry-xcx';

const processData = sentryXCX.wrapSync((data) => {
  // 处理数据
  return data.map((item) => item * 2);
});

// 异常会自动被捕获并上报
processData([1, 2, 3]);
```

### 装饰器支持（TypeScript）

使用装饰器优雅地处理异常：

```typescript
import { CatchAsync, CatchSync } from 'sentry-xcx';

class MyService {
  @CatchAsync
  async fetchData() {
    // 异步方法，异常会自动捕获
    const res = await wx.request({ url: 'https://api.example.com/data' });
    return res.data;
  }

  @CatchSync
  processData(data: any[]) {
    // 同步方法，异常会自动捕获
    return data.map((item) => item * 2);
  }
}
```

---

## 🌍 环境配置

### 多环境支持

```javascript
sentryXCX.init({
  dsn: 'http://your-sentry-dsn@your-domain/project-id',
  enabled: process.env.NODE_ENV === 'production', // 仅生产环境启用
});
```

### 使用构建时替换

在构建脚本中替换 `%VERSION%` 和 `%ENV%`：

```javascript
sentryXCX.init({
  dsn: 'http://your-sentry-dsn@your-domain/project-id',
  release: '%VERSION%', // 构建时替换为实际版本号
  environment: '%ENV%', // 构建时替换为实际环境
});
```

---

## 📝 示例

### 完整的 App 配置

```javascript
import sentryXCX, { wrapApp } from 'sentry-xcx';

App(
  wrapApp({
    onLaunch() {
      // 初始化 Sentry
      sentryXCX.init({
        dsn: 'https://your-sentry-dsn@your-domain/project-id',
        release: '1.0.0',
        environment: 'production',
        tags: {
          appType: 'miniprogram',
        },
        beforeSend: (event) => {
          // 过滤敏感信息
          if (event.user?.phone) {
            event.user.phone = event.user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
          }
          return event;
        },
      });
    },

    onShow() {
      console.log('App Show');
    },
  })
);
```

### 完整的 Page 配置

```javascript
import sentryXCX, { wrapPage, logUserAction, setUserFromWechat, clearUserInfo } from 'sentry-xcx';

Page(
  wrapPage({
    data: {
      userInfo: null,
    },

    onLoad(options) {
      console.log('页面加载', options);
      this.loadData();
    },

    async loadData() {
      try {
        const res = await wx.request({
          url: 'https://api.example.com/data',
        });
        this.setData({ data: res.data });
      } catch (error) {
        sentryXCX.captureException(error);
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    },

    onUserLogin(userInfo) {
      // 方式1：直接设置用户信息
      sentryXCX.setUser({
        id: userInfo.id,
        username: userInfo.nickname,
      });

      // 方式2：使用辅助函数从微信用户信息设置（推荐）
      setUserFromWechat({
        basic_uid: userInfo.id,
        nickname: userInfo.nickname,
        pure_phone_number: userInfo.phone,
        openid: userInfo.openid,
      });

      // 记录用户行为
      logUserAction('用户登录', { userId: userInfo.id });
    },

    onUserLogout() {
      // 方式1：使用核心方法清空用户信息
      sentryXCX.clearUser();

      // 方式2：使用辅助函数清空用户信息（推荐）
      clearUserInfo();

      // 记录用户行为
      logUserAction('用户退出登录');
    },
  })
);
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是报告 Bug、提出新功能建议，还是提交代码改进。

### 如何贡献

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 开发指南

```bash
# 克隆项目
git clone https://github.com/Weldon0/sentry-xcx.git

# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

## 🔗 相关链接

- **GitHub 仓库**: [https://github.com/Weldon0/sentry-xcx](https://github.com/Weldon0/sentry-xcx)
- **问题反馈**: [https://github.com/Weldon0/sentry-xcx/issues](https://github.com/Weldon0/sentry-xcx/issues)
- **更新日志**: [CHANGELOG.md](CHANGELOG.md)
- **Sentry 官方文档**: [https://docs.sentry.io/](https://docs.sentry.io/)
- **微信小程序文档**: [https://developers.weixin.qq.com/miniprogram/dev/framework/](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

## 👤 作者

**Weldon0**

- GitHub: [@Weldon0](https://github.com/Weldon0)

---

## ⭐ Star History

如果这个项目对您有帮助，请给我们一个 Star ⭐️

[![Star History Chart](https://api.star-history.com/svg?repos=Weldon0/sentry-xcx&type=Date)](https://star-history.com/#Weldon0/sentry-xcx&Date)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Weldon0">Weldon0</a></p>
  <p>
    <a href="https://github.com/Weldon0/sentry-xcx">⭐ Star</a> •
    <a href="https://github.com/Weldon0/sentry-xcx/issues">🐛 Report Bug</a> •
    <a href="https://github.com/Weldon0/sentry-xcx/issues">✨ Request Feature</a>
  </p>
</div>

