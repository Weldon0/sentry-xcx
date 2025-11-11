/**
 * Sentry 初始化配置
 */
export interface SentryConfig {
  /** Sentry DSN 地址 */
  dsn: string;
  /** 版本号，默认从 package.json 读取 */
  release?: string;
  /** 环境标识：development/test/pre/production */
  environment?: string;
  /** 是否启用 Sentry，默认 true */
  enabled?: boolean;
  /** 采样率，0-1 之间，默认 1.0 */
  sampleRate?: number;
  /** 是否记录 console 日志，默认 true */
  enableConsole?: boolean;
  /** 是否记录请求，默认 true */
  enableRequest?: boolean;
  /** 是否记录页面导航，默认 true */
  enableNavigation?: boolean;
  /** 是否记录小程序 API，默认 true */
  enableApi?: boolean;
  /** 是否记录生命周期，默认 true */
  enableLifecycle?: boolean;
  /** 是否记录未捕获错误，默认 true */
  enableUnhandleError?: boolean;
  /** 自定义标签 */
  tags?: Record<string, string>;
  /** 在初始化前的钩子函数 */
  beforeInit?: (config: any) => any;
  /** 在发送事件前的钩子函数 */
  beforeSend?: (event: any, hint?: any) => any | null;
  /** 在发送面包屑前的钩子函数 */
  beforeBreadcrumb?: (breadcrumb: any, hint?: any) => any | null;
}

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户唯一标识 */
  id: string | number;
  /** 用户昵称 */
  username?: string;
  /** 手机号 */
  phone?: string;
  /** 微信 OpenID */
  openid?: string;
  /** 其他自定义字段 */
  [key: string]: any;
}

/**
 * 性能监控配置
 */
export interface PerformanceConfig {
  /** 是否启用性能监控 */
  enabled?: boolean;
  /** 性能采样率 */
  tracesSampleRate?: number;
}

/**
 * 日志级别
 */
export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Fatal = 'fatal',
}

/**
 * 面包屑类型
 */
export interface Breadcrumb {
  type?: string;
  level?: LogLevel;
  message?: string;
  category?: string;
  data?: Record<string, any>;
  timestamp?: number;
}

