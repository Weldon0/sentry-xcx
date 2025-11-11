import * as Sentry from 'sentry-mina';
import type { SentryConfig, UserInfo, Breadcrumb, LogLevel } from './types';

/**
 * Sentry 小程序 SDK 封装类
 */
class SentryXCX {
  private initialized = false;
  private config: SentryConfig | null = null;

  /**
   * 初始化 Sentry
   * @param config 配置项
   */
  init(config: SentryConfig): void {
    if (this.initialized) {
      console.warn('[SentryXCX] Sentry 已经初始化，请勿重复初始化');
      return;
    }

    // 如果明确禁用，则不初始化
    if (config.enabled === false) {
      console.log('[SentryXCX] Sentry 已禁用');
      return;
    }

    this.config = config;

    // 构建 Sentry 配置
    const sentryConfig: any = {
      dsn: config.dsn,
      release: config.release || '%VERSION%',
      environment: config.environment || '%ENV%',
      sampleRate: config.sampleRate ?? 1.0,
      integrations: [
        new Sentry.Integrations.GlobalHandlers(),
        new Sentry.Integrations.TryCatch(),
        new Sentry.Integrations.Breadcrumbs({
          console: config.enableConsole ?? true,
          request: config.enableRequest ?? true,
          navigation: config.enableNavigation ?? true,
          api: config.enableApi ?? true,
          lifecycle: config.enableLifecycle ?? true,
          unhandleError: config.enableUnhandleError ?? true,
        }),
      ],
    };

    // 添加 beforeSend 钩子
    if (config.beforeSend) {
      sentryConfig.beforeSend = config.beforeSend;
    }

    // 添加 beforeBreadcrumb 钩子
    if (config.beforeBreadcrumb) {
      sentryConfig.beforeBreadcrumb = config.beforeBreadcrumb;
    }

    // 执行初始化前钩子
    const finalConfig = config.beforeInit
      ? config.beforeInit(sentryConfig)
      : sentryConfig;

    // 初始化 Sentry
    Sentry.init(finalConfig);

    // 设置全局标签
    if (config.tags) {
      this.setTags(config.tags);
    }

    this.initialized = true;
    console.log('[SentryXCX] Sentry 初始化成功', {
      environment: config.environment,
      release: config.release,
    });
  }

  /**
   * 检查是否已初始化
   */
  private checkInitialized(): boolean {
    if (!this.initialized) {
      console.warn('[SentryXCX] Sentry 未初始化，请先调用 init() 方法');
      return false;
    }
    return true;
  }

  /**
   * 设置用户信息
   * @param userInfo 用户信息
   */
  setUser(userInfo: UserInfo | null): void {
    if (!this.checkInitialized()) return;

    Sentry.configureScope((scope: any) => {
      if (userInfo === null) {
        scope.setUser(null);
        console.log('[SentryXCX] 用户信息已清空');
      } else {
        const sentryUser = {
          ...userInfo,
          id: String(userInfo.id),
          username: userInfo.username,
        };
        scope.setUser(sentryUser);
        console.log('[SentryXCX] 用户信息已设置', { id: userInfo.id });
      }
    });
  }

  /**
   * 清空用户信息（退出登录时调用）
   */
  clearUser(): void {
    this.setUser(null);
  }

  /**
   * 设置标签
   * @param tags 标签对象
   */
  setTags(tags: Record<string, string>): void {
    if (!this.checkInitialized()) return;

    Sentry.configureScope((scope) => {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    });
  }

  /**
   * 设置单个标签
   * @param key 标签键
   * @param value 标签值
   */
  setTag(key: string, value: string): void {
    if (!this.checkInitialized()) return;

    Sentry.configureScope((scope) => {
      scope.setTag(key, value);
    });
  }

  /**
   * 设置额外上下文信息
   * @param key 键
   * @param value 值
   */
  setContext(key: string, value: any): void {
    if (!this.checkInitialized()) return;

    Sentry.configureScope((scope) => {
      scope.setContext(key, value);
    });
  }

  /**
   * 设置额外数据
   * @param key 键
   * @param value 值
   */
  setExtra(key: string, value: any): void {
    if (!this.checkInitialized()) return;

    Sentry.configureScope((scope) => {
      scope.setExtra(key, value);
    });
  }

  /**
   * 捕获消息
   * @param message 消息内容
   * @param level 日志级别
   */
  captureMessage(message: string, level?: LogLevel): string {
    if (!this.checkInitialized()) return '';

    return Sentry.captureMessage(message, level as any);
  }

  /**
   * 捕获异常
   * @param error 错误对象
   */
  captureException(error: Error | string): string {
    if (!this.checkInitialized()) return '';

    return Sentry.captureException(error);
  }

  /**
   * 添加面包屑
   * @param breadcrumb 面包屑信息
   */
  addBreadcrumb(breadcrumb: Breadcrumb): void {
    if (!this.checkInitialized()) return;

    Sentry.addBreadcrumb(breadcrumb as any);
  }

  /**
   * 配置作用域
   * @param callback 回调函数
   */
  configureScope(callback: (scope: any) => void): void {
    if (!this.checkInitialized()) return;

    Sentry.configureScope(callback);
  }

  /**
   * 包装异步函数，自动捕获异常
   * @param fn 异步函数
   */
  wrapAsync<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return (async (...args: any[]) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.captureException(error as Error);
        throw error;
      }
    }) as T;
  }

  /**
   * 包装同步函数，自动捕获异常
   * @param fn 同步函数
   */
  wrapSync<T extends (...args: any[]) => any>(fn: T): T {
    return ((...args: any[]) => {
      try {
        return fn(...args);
      } catch (error) {
        this.captureException(error as Error);
        throw error;
      }
    }) as T;
  }

  /**
   * 获取当前配置
   */
  getConfig(): SentryConfig | null {
    return this.config;
  }

  /**
   * 判断是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// 导出单例
export default new SentryXCX();

