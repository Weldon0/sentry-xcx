# 故障排除指南

本文档帮助您解决使用 `sentry-xcx` 时可能遇到的常见问题。

## 目录

- [安装问题](#安装问题)
- [导入问题](#导入问题)
- [函数不存在错误](#函数不存在错误)
- [错误显示为 [object Object]](#错误显示为-object-object)
- [TypeScript 类型错误](#typescript-类型错误)

---

## 安装问题

### 问题：安装后找不到模块

**错误信息：**
```
Cannot find module 'sentry-xcx'
```

**解决方案：**

1. 确认已正确安装：
   ```bash
   npm install sentry-xcx --save
   ```

2. 检查 `package.json` 中是否有 `sentry-xcx` 依赖

3. 尝试删除 `node_modules` 重新安装：
   ```bash
   rm -rf node_modules
   npm install
   ```

---

## 导入问题

### 问题：导入语法错误

**错误的导入方式：**
```javascript
// ❌ 错误
import sentry from 'sentry-xcx';
sentry.clearUserInfo();  // clearUserInfo is not a function
```

**正确的导入方式：**
```javascript
// ✅ 方式1：默认导入 + 命名导入
import sentryXCX, { clearUserInfo, captureError } from 'sentry-xcx';

sentryXCX.init({ dsn: 'YOUR_DSN' });
clearUserInfo();

// ✅ 方式2：全部命名导入
import { clearUserInfo, captureError, setUserFromWechat } from 'sentry-xcx';

clearUserInfo();

// ✅ 方式3：默认导入使用核心方法
import sentryXCX from 'sentry-xcx';

sentryXCX.init({ dsn: 'YOUR_DSN' });
sentryXCX.clearUser();  // 核心方法
```

---

## 函数不存在错误

### 问题：`clearUserInfo is not a function`

**错误信息：**
```
TypeError: clearUserInfo is not a function
```

**原因：**
您可能使用的是旧版本的 `sentry-xcx`（< 1.2.0），该版本不包含 `clearUserInfo` 函数。

**解决方案：**

#### 方案 1：升级到最新版本（推荐）

```bash
# 查看当前版本
npm list sentry-xcx

# 升级到最新版本
npm install sentry-xcx@latest --save

# 或使用 yarn
yarn add sentry-xcx@latest

# 或使用 pnpm
pnpm add sentry-xcx@latest
```

升级后，您可以使用新的辅助函数：
```javascript
import { clearUserInfo } from 'sentry-xcx';

clearUserInfo();  // ✅ 现在可以使用了
```

#### 方案 2：使用核心方法（适用于旧版本）

如果暂时无法升级，可以使用核心实例的方法：
```javascript
import sentryXCX from 'sentry-xcx';

sentryXCX.clearUser();  // ✅ 所有版本都支持
```

### 问题：`captureError is not a function`

**解决方案：**

同样需要升级到 v1.2.0 或更高版本：

```bash
npm install sentry-xcx@latest --save
```

或使用核心方法：
```javascript
import sentryXCX from 'sentry-xcx';

// 替代方案
sentryXCX.captureException(error);
sentryXCX.setExtra('context', { scene: 'payment' });
```

---

## 错误显示为 [object Object]

### 问题：Sentry 中错误显示为 `[object Object]`

**场景：**
```javascript
wx.request({
  url: 'https://api.example.com',
  fail: (err) => {
    sentryXCX.captureException(err);
    // Sentry 中显示: [object Object]
  }
});
```

**解决方案：**

#### 方案 1：升级到 v1.2.0+（推荐）

v1.2.0 版本已经自动处理对象错误：

```bash
npm install sentry-xcx@latest --save
```

升级后，无需修改代码，自动解决：
```javascript
wx.request({
  fail: (err) => {
    sentryXCX.captureException(err);
    // ✅ 自动提取 errMsg，显示: Error: request:fail timeout
  }
});
```

#### 方案 2：使用 `captureError` 辅助函数（v1.2.0+）

```javascript
import { captureError } from 'sentry-xcx';

wx.request({
  fail: (err) => {
    captureError(err, {
      api: 'wx.request',
      url: 'https://api.example.com'
    });
    // ✅ 自动处理 + 添加上下文信息
  }
});
```

#### 方案 3：手动序列化（适用于旧版本）

```javascript
wx.request({
  fail: (err) => {
    // 手动提取错误信息
    const errorMessage = err.errMsg || err.message || JSON.stringify(err);
    sentryXCX.captureException(new Error(errorMessage));
    
    // 添加原始错误作为额外信息
    sentryXCX.setExtra('originalError', err);
  }
});
```

---

## TypeScript 类型错误

### 问题：TypeScript 提示类型不存在

**错误信息：**
```
Property 'clearUserInfo' does not exist on module 'sentry-xcx'
```

**解决方案：**

1. 确保使用的是 v1.2.0 或更高版本
2. 检查 TypeScript 配置：

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

3. 重启 TypeScript 服务器（VSCode）：
   - 按 `Cmd+Shift+P`（Mac）或 `Ctrl+Shift+P`（Windows）
   - 输入 "TypeScript: Restart TS Server"

4. 清除缓存并重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 版本检查

### 如何检查当前版本

```bash
# 方法 1：查看 package.json
cat package.json | grep sentry-xcx

# 方法 2：使用 npm
npm list sentry-xcx

# 方法 3：查看 node_modules
cat node_modules/sentry-xcx/package.json | grep version
```

### 各版本功能对比

| 功能 | v1.0.x | v1.1.x | v1.2.0+ |
|------|--------|--------|---------|
| 基础错误捕获 | ✅ | ✅ | ✅ |
| 用户信息管理 | ✅ | ✅ | ✅ |
| `clearUser()` 核心方法 | ✅ | ✅ | ✅ |
| `clearUserInfo()` 辅助函数 | ❌ | ❌ | ✅ |
| `captureError()` 辅助函数 | ❌ | ❌ | ✅ |
| 智能错误处理 | ❌ | ❌ | ✅ |
| 循环引用处理 | ❌ | ❌ | ✅ |
| 自动提取错误信息 | ❌ | ❌ | ✅ |
| 内置 sentry-mina | ❌ | ✅ | ✅ |

---

## 常见问题 FAQ

### Q: 为什么我的错误没有上报到 Sentry？

**A:** 检查以下几点：

1. DSN 是否正确配置
2. 网络是否正常
3. 是否调用了 `init()` 方法
4. 检查小程序的网络请求域名白名单

```javascript
// 正确的初始化
import sentryXCX from 'sentry-xcx';

sentryXCX.init({
  dsn: 'https://your-dsn@sentry.io/project-id',  // 确保 DSN 正确
  environment: 'production',
  debug: true,  // 开启调试模式查看日志
});
```

### Q: 如何在退出登录时清除用户信息？

**A:** 使用 `clearUserInfo()` 或 `clearUser()`：

```javascript
// v1.2.0+
import { clearUserInfo } from 'sentry-xcx';

function logout() {
  // 清除本地用户数据
  wx.removeStorageSync('userInfo');
  
  // 清除 Sentry 用户信息
  clearUserInfo();
  
  // 跳转到登录页
  wx.redirectTo({ url: '/pages/login/login' });
}
```

### Q: 如何捕获微信 API 的错误？

**A:** 使用 `captureError()` 或 `captureException()`：

```javascript
// v1.2.0+ 推荐方式
import { captureError } from 'sentry-xcx';

wx.request({
  url: 'https://api.example.com',
  fail: (err) => {
    captureError(err, {
      api: 'wx.request',
      url: 'https://api.example.com'
    });
  }
});

// 或使用核心方法
import sentryXCX from 'sentry-xcx';

wx.request({
  fail: (err) => {
    sentryXCX.captureException(err);
  }
});
```

---

## 获取帮助

如果以上方案都无法解决您的问题，请：

1. **查看文档**：https://github.com/Weldon0/sentry-xcx#readme
2. **提交 Issue**：https://github.com/Weldon0/sentry-xcx/issues
3. **查看示例代码**：`examples/error-handling.js`

提交 Issue 时，请提供：
- 您的 `sentry-xcx` 版本
- 完整的错误信息
- 最小可复现代码
- 运行环境（开发者工具版本、基础库版本等）

---

## 更新日志

查看完整的更新日志：[CHANGELOG.md](./CHANGELOG.md)

