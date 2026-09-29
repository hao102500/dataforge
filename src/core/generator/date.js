/**
 * Date Generator
 *
 * 支持：
 * 1. 日期范围
 * 2. 日期格式
 * 3. 是否包含时间
 */

/**
 * 补 0
 */
function pad(value) {
  return value < 10 ? "0" + value : String(value);
}

/**
 * 格式化日期
 *
 * 支持：
 * YYYY-MM-DD
 * YYYY/MM/DD
 * YYYY年MM月DD日
 * YYYY-MM-DD HH:mm:ss
 * YYYY/MM/DD HH:mm:ss
 */
export function formatDate(date, format) {
  if (!(date instanceof Date)) {
    return "";
  }

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
}

/**
 * 将日期字符串转换成 Date
 *
 * 避免直接使用 new Date('2026-01-01')
 * 在不同浏览器中的兼容问题。
 */
function parseDate(value, endOfDay) {
  if (!value) {
    return null;
  }

  const parts = String(value).split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  if (endOfDay) {
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * 生成随机日期
 */
export function generateDate(generator) {
  generator = generator || {};

  const startDate =
    parseDate(generator.startDate) || new Date(new Date().getFullYear(), 0, 1);

  const endDate =
    parseDate(generator.endDate, true) ||
    new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);

  let startTime = startDate.getTime();
  let endTime = endDate.getTime();

  if (startTime > endTime) {
    const temp = startTime;
    startTime = endTime;
    endTime = temp;
  }

  const randomTime =
    startTime + Math.floor(Math.random() * (endTime - startTime + 1));

  const date = new Date(randomTime);

  const format = generator.includeTime
    ? generator.format || "YYYY-MM-DD HH:mm:ss"
    : generator.format || "YYYY-MM-DD";

  return formatDate(date, format);
}
