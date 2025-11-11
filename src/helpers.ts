import sentryXCX from './core';
import type { UserInfo } from './types';

/**
 * 辅助函数：从微信用户信息设置 Sentry 用户
 * @param userWechat 微信用户信息
 */
export function setUserFromWechat(userWechat: {
  basic_uid?: string | number;
  nickname?: string;
  pure_phone_number?: string;
  openid?: string;
  [key: string]: any;
}): void {
  const userInfo: UserInfo = {
    id: userWechat.basic_uid || userWechat.openid || 'unknown',
    username: userWechat.nickname,
    phone: userWechat.pure_phone_number,
    openid: userWechat.openid,
  };

  sentryXCX.setUser(userInfo);
}

/**
 * 辅助函数：记录页面访问
 * @param pagePath 页面路径
 * @param pageParams 页面参数
 */
export function logPageView(pagePath: string, pageParams?: Record<string, any>): void {
  sentryXCX.addBreadcrumb({
    type: 'navigation',
    category: 'page',
    message: `访问页面: ${pagePath}`,
    data: pageParams,
  });
}

/**
 * 辅助函数：记录网络请求
 * @param url 请求地址
 * @param method 请求方法
 * @param statusCode 状态码
 * @param duration 耗时（毫秒）
 */
export function logRequest(
  url: string,
  method: string,
  statusCode?: number,
  duration?: number
): void {
  sentryXCX.addBreadcrumb({
    type: 'http',
    category: 'request',
    message: `${method} ${url}`,
    data: {
      url,
      method,
      status_code: statusCode,
      duration,
    },
  });
}

/**
 * 辅助函数：记录用户行为
 * @param action 行为名称
 * @param data 行为数据
 */
export function logUserAction(action: string, data?: Record<string, any>): void {
  sentryXCX.addBreadcrumb({
    type: 'user',
    category: 'action',
    message: action,
    data,
  });
}

/**
 * 辅助函数：记录业务日志
 * @param message 日志消息
 * @param data 日志数据
 */
export function logBusiness(message: string, data?: Record<string, any>): void {
  sentryXCX.addBreadcrumb({
    type: 'default',
    category: 'business',
    message,
    data,
  });
}

/**
 * 装饰器：自动捕获异步方法异常
 */
export function CatchAsync(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      sentryXCX.captureException(error as Error);
      throw error;
    }
  };

  return descriptor;
}

/**
 * 装饰器：自动捕获同步方法异常
 */
export function CatchSync(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    try {
      return originalMethod.apply(this, args);
    } catch (error) {
      sentryXCX.captureException(error as Error);
      throw error;
    }
  };

  return descriptor;
}

/**
 * 小程序页面生命周期包装器
 * 自动记录页面访问和捕获异常
 */
export function wrapPage<T extends Record<string, any>>(pageOptions: T): T {
  const originalOnLoad = pageOptions.onLoad;
  const originalOnShow = pageOptions.onShow;
  const originalOnError = pageOptions.onError;

  // 包装 onLoad
  if (originalOnLoad) {
    pageOptions.onLoad = function (options: any) {
      try {
        const route = (this as any).route || 'unknown';
        logPageView(route, options);
        return originalOnLoad.call(this, options);
      } catch (error) {
        sentryXCX.captureException(error as Error);
        throw error;
      }
    };
  }

  // 包装 onShow
  if (originalOnShow) {
    pageOptions.onShow = function () {
      try {
        return originalOnShow.call(this);
      } catch (error) {
        sentryXCX.captureException(error as Error);
        throw error;
      }
    };
  }

  // 包装 onError
  if (originalOnError) {
    pageOptions.onError = function (error: any) {
      sentryXCX.captureException(error);
      return originalOnError.call(this, error);
    };
  } else {
    pageOptions.onError = function (error: any) {
      sentryXCX.captureException(error);
    };
  }

  return pageOptions;
}

/**
 * 小程序 App 生命周期包装器
 * 自动捕获全局异常
 */
export function wrapApp<T extends Record<string, any>>(appOptions: T): T {
  const originalOnError = appOptions.onError;
  const originalOnPageNotFound = appOptions.onPageNotFound;
  const originalOnUnhandledRejection = appOptions.onUnhandledRejection;

  // 包装 onError
  if (originalOnError) {
    appOptions.onError = function (error: string) {
      sentryXCX.captureException(new Error(error));
      return originalOnError.call(this, error);
    };
  } else {
    appOptions.onError = function (error: string) {
      sentryXCX.captureException(new Error(error));
    };
  }

  // 包装 onPageNotFound
  if (originalOnPageNotFound) {
    appOptions.onPageNotFound = function (res: any) {
      sentryXCX.captureMessage(`页面不存在: ${res.path}`, 'warning' as any);
      return originalOnPageNotFound.call(this, res);
    };
  } else {
    appOptions.onPageNotFound = function (res: any) {
      sentryXCX.captureMessage(`页面不存在: ${res.path}`, 'warning' as any);
    };
  }

  // 包装 onUnhandledRejection
  if (originalOnUnhandledRejection) {
    appOptions.onUnhandledRejection = function (res: any) {
      sentryXCX.captureException(new Error(`未处理的 Promise 拒绝: ${res.reason}`));
      return originalOnUnhandledRejection.call(this, res);
    };
  } else {
    appOptions.onUnhandledRejection = function (res: any) {
      sentryXCX.captureException(new Error(`未处理的 Promise 拒绝: ${res.reason}`));
    };
  }

  return appOptions;
}

