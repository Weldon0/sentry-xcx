# sentry-xcx

> 🚀 专为微信小程序设计的 Sentry SDK 封装库，提供更简洁的 API 和更强大的功能

## ✨ 特性

- 📦 **开箱即用**：简化配置，一行代码完成初始化
- 🎯 **类型安全**：完整的 TypeScript 类型定义
- 🔧 **灵活配置**：支持多种配置选项和钩子函数
- 🎨 **辅助函数**：提供丰富的辅助函数，简化日常使用
- 🔄 **自动包装**：支持自动捕获页面和 App 生命周期异常
- 📊 **面包屑追踪**：自动记录用户行为轨迹
- 🎭 **装饰器支持**：使用装饰器自动捕获方法异常

## 📦 安装

```bash
npm install sentry-xcx sentry-mina --save
```

或使用 yarn：

```bash
yarn add sentry-xcx sentry-mina
```

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

## 📖 详细配置

### 初始化配置项

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

## 🎯 核心 API

### 设置用户信息

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

### 使用辅助函数设置微信用户信息

```javascript
import { setUserFromWechat } from 'sentry-xcx';

// 从微信用户信息自动设置
setUserFromWechat({
  basic_uid: 'user-id',
  nickname: 'username',
  pure_phone_number: '138****0000',
  openid: 'wx-openid',
});
```

### 捕获消息

```javascript
import sentryXCX from 'sentry-xcx';

sentryXCX.captureMessage('用户完成了支付', 'info');
```

### 捕获异常

```javascript
import sentryXCX from 'sentry-xcx';

try {
  // 可能出错的代码
  throw new Error('Something went wrong');
} catch (error) {
  sentryXCX.captureException(error);
}
```

### 设置标签和上下文

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

### 添加面包屑

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

## 🎨 辅助函数

### 记录页面访问

```javascript
import { logPageView } from 'sentry-xcx';

logPageView('/pages/index/index', { from: 'share' });
```

### 记录网络请求

```javascript
import { logRequest } from 'sentry-xcx';

logRequest('https://api.example.com/users', 'GET', 200, 150);
```

### 记录用户行为

```javascript
import { logUserAction } from 'sentry-xcx';

logUserAction('点击购买按钮', { productId: '123' });
```

### 记录业务日志

```javascript
import { logBusiness } from 'sentry-xcx';

logBusiness('订单创建成功', { orderId: '123456' });
```

## 🔄 函数包装器

### 包装异步函数

```javascript
import sentryXCX from 'sentry-xcx';

const fetchData = sentryXCX.wrapAsync(async () => {
  const res = await wx.request({ url: 'https://api.example.com/data' });
  return res.data;
});

// 异常会自动被捕获并上报
fetchData();
```

### 包装同步函数

```javascript
import sentryXCX from 'sentry-xcx';

const processData = sentryXCX.wrapSync((data) => {
  // 处理数据
  return data.map((item) => item * 2);
});

// 异常会自动被捕获并上报
processData([1, 2, 3]);
```

## 🎭 装饰器（TypeScript）

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

## 🌍 环境配置

### 开发环境禁用 Sentry

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

## 📝 完整示例

### app.js

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

### pages/index/index.js

```javascript
import sentryXCX, { wrapPage, logUserAction } from 'sentry-xcx';

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
      // 设置用户信息
      sentryXCX.setUser({
        id: userInfo.id,
        username: userInfo.nickname,
      });

      // 记录用户行为
      logUserAction('用户登录', { userId: userInfo.id });
    },

    onUserLogout() {
      // 清空用户信息
      sentryXCX.clearUser();
      logUserAction('用户退出登录');
    },
  })
);
```

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📦 仓库地址

GitHub: [https://github.com/Weldon0/sentry-xcx](https://github.com/Weldon0/sentry-xcx)

## 👤 作者

**Weldon0**

- GitHub: [@Weldon0](https://github.com/Weldon0)

