/**
 * 错误处理示例
 * 演示如何正确处理各种类型的错误，避免 [object Object] 问题
 */

import sentryXCX, { captureError } from 'sentry-xcx';

// 初始化
sentryXCX.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  release: '1.0.0',
});

// ============================================
// 示例 1: 捕获标准 Error 对象
// ============================================
function example1_StandardError() {
  try {
    throw new Error('这是一个标准错误');
  } catch (error) {
    // ✅ 正常显示: Error: 这是一个标准错误
    sentryXCX.captureException(error);
  }
}

// ============================================
// 示例 2: 捕获字符串错误
// ============================================
function example2_StringError() {
  try {
    throw '这是一个字符串错误';
  } catch (error) {
    // ✅ 正常显示: Error: 这是一个字符串错误
    sentryXCX.captureException(error);
  }
}

// ============================================
// 示例 3: 捕获微信 API 错误对象
// ============================================
function example3_WechatAPIError() {
  wx.request({
    url: 'https://api.example.com/data',
    fail: (err) => {
      // err 通常是: { errMsg: "request:fail timeout", errno: 600001 }
      // ✅ 自动提取 errMsg，显示: Error: request:fail timeout
      sentryXCX.captureException(err);
      
      // 或者使用辅助函数，添加更多上下文
      captureError(err, {
        api: 'wx.request',
        url: 'https://api.example.com/data',
        method: 'GET'
      });
    }
  });
}

// ============================================
// 示例 4: 捕获业务错误对象
// ============================================
function example4_BusinessError() {
  const apiResponse = {
    code: 1001,
    message: '用户未登录',
    data: null
  };

  if (apiResponse.code !== 0) {
    // ✅ 自动提取 message，显示: Error: 用户未登录
    sentryXCX.captureException(apiResponse);
    
    // 或者使用辅助函数
    captureError(apiResponse, {
      scene: 'api_call',
      endpoint: '/user/info'
    });
  }
}

// ============================================
// 示例 5: 捕获复杂嵌套对象
// ============================================
function example5_ComplexObject() {
  const complexError = {
    error: '支付失败',
    details: {
      code: 'PAYMENT_TIMEOUT',
      orderId: '123456',
      amount: 99.99,
      timestamp: Date.now()
    }
  };

  // ✅ 自动提取 error 字段，显示: Error: 支付失败
  // 并将完整对象保存为额外数据
  captureError(complexError, {
    scene: 'payment',
    userId: 'user_123'
  });
}

// ============================================
// 示例 6: 捕获没有明确错误信息的对象
// ============================================
function example6_PlainObject() {
  const plainObject = {
    code: 500,
    status: 'error',
    timestamp: Date.now()
  };

  // ✅ 自动序列化整个对象，显示完整的 JSON
  // Error: {
  //   "code": 500,
  //   "status": "error",
  //   "timestamp": 1699999999999
  // }
  sentryXCX.captureException(plainObject);
}

// ============================================
// 示例 7: 处理循环引用的对象
// ============================================
function example7_CircularReference() {
  const obj = { name: 'test' };
  obj.self = obj; // 创建循环引用

  // ✅ 自动处理循环引用，显示: { "name": "test", "self": "[Circular]" }
  sentryXCX.captureException(obj);
}

// ============================================
// 示例 8: 在 Promise 中捕获错误
// ============================================
async function example8_PromiseError() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    if (!response.ok) {
      // 捕获 HTTP 错误
      captureError(
        {
          status: response.status,
          statusText: response.statusText,
          message: data.message || '请求失败'
        },
        {
          url: 'https://api.example.com/data',
          method: 'GET'
        }
      );
    }
  } catch (error) {
    // 捕获网络错误
    captureError(error, {
      scene: 'network_request',
      url: 'https://api.example.com/data'
    });
  }
}

// ============================================
// 示例 9: 在小程序生命周期中捕获错误
// ============================================
Page({
  onLoad(options) {
    wx.request({
      url: 'https://api.example.com/init',
      fail: (err) => {
        // ✅ 正确处理微信 API 错误
        captureError(err, {
          page: 'index',
          lifecycle: 'onLoad',
          options: options
        });
      }
    });
  },

  async loadData() {
    try {
      const result = await this.fetchUserData();
      if (result.code !== 0) {
        // ✅ 捕获业务错误
        captureError(result, {
          action: 'loadData',
          userId: this.data.userId
        });
      }
    } catch (error) {
      // ✅ 捕获异常
      captureError(error, {
        action: 'loadData'
      });
    }
  },

  fetchUserData() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.example.com/user',
        success: (res) => resolve(res.data),
        fail: (err) => reject(err)
      });
    });
  }
});

// ============================================
// 示例 10: 全局错误处理
// ============================================
App({
  onError(error) {
    // App 全局错误
    // error 通常是字符串
    sentryXCX.captureException(error);
  },

  onUnhandledRejection(res) {
    // 未处理的 Promise rejection
    // res.reason 可能是任意类型
    captureError(res.reason, {
      type: 'unhandledRejection',
      promise: String(res.promise)
    });
  }
});

// ============================================
// 最佳实践总结
// ============================================

/**
 * 1. 使用 sentryXCX.captureException(error)
 *    - 适用于简单的错误捕获
 *    - 自动处理各种类型的错误
 * 
 * 2. 使用 captureError(error, context)（推荐）
 *    - 适用于需要添加上下文信息的场景
 *    - 更容易定位和调试问题
 * 
 * 3. 错误类型支持
 *    - Error 对象 ✅
 *    - 字符串 ✅
 *    - 对象（自动提取 message/errMsg/msg/error 字段）✅
 *    - 其他类型（自动转换为字符串）✅
 * 
 * 4. 特殊处理
 *    - 循环引用：自动标记为 [Circular]
 *    - 复杂对象：自动序列化为 JSON
 *    - 原始数据：保留在 originalError 字段中
 */

