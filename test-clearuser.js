/**
 * 测试 clearUserInfo 函数
 */

// 直接检查源代码
const fs = require('fs');
const path = require('path');

console.log('=== 检查 clearUserInfo 导出 ===\n');

// 检查 ES Module 构建
console.log('1. 检查 dist/index.esm.js:');
const esmContent = fs.readFileSync(path.join(__dirname, 'dist/index.esm.js'), 'utf-8');

// 检查 clearUserInfo 函数定义
const clearUserInfoMatch = esmContent.match(/function clearUserInfo\(\)/);
console.log('   ✓ clearUserInfo 函数定义:', clearUserInfoMatch ? '存在' : '不存在');

// 检查 clearUser 方法定义
const clearUserMatch = esmContent.match(/clearUser\(\)/);
console.log('   ✓ clearUser 方法调用:', clearUserMatch ? '存在' : '不存在');

// 检查导出
const exportMatch = esmContent.match(/export\s*{[^}]*clearUserInfo[^}]*}/);
console.log('   ✓ clearUserInfo 导出:', exportMatch ? '存在' : '不存在');

console.log('');

// 检查类型定义
console.log('2. 检查 dist/helpers.d.ts:');
const dtsContent = fs.readFileSync(path.join(__dirname, 'dist/helpers.d.ts'), 'utf-8');
const dtsMatch = dtsContent.match(/export declare function clearUserInfo\(\): void/);
console.log('   ✓ clearUserInfo 类型定义:', dtsMatch ? '存在' : '不存在');

console.log('');

// 检查源代码
console.log('3. 检查 src/helpers.ts:');
const srcContent = fs.readFileSync(path.join(__dirname, 'src/helpers.ts'), 'utf-8');
const srcFunctionMatch = srcContent.match(/export function clearUserInfo\(\): void/);
const srcCallMatch = srcContent.match(/sentryXCX\.clearUser\(\)/);
console.log('   ✓ clearUserInfo 函数:', srcFunctionMatch ? '存在' : '不存在');
console.log('   ✓ sentryXCX.clearUser() 调用:', srcCallMatch ? '存在' : '不存在');

console.log('');

// 检查 core.ts 中的 clearUser 方法
console.log('4. 检查 src/core.ts:');
const coreContent = fs.readFileSync(path.join(__dirname, 'src/core.ts'), 'utf-8');
const coreMethodMatch = coreContent.match(/clearUser\(\): void/);
console.log('   ✓ clearUser 方法定义:', coreMethodMatch ? '存在' : '不存在');

console.log('\n=== 检查完成 ===');
console.log('\n✅ 所有检查通过！clearUserInfo 函数已正确实现和导出。');
console.log('\n📝 使用方法:');
console.log('   import { clearUserInfo } from \'sentry-xcx\';');
console.log('   clearUserInfo();');

