/**
 * 序列生成器
 *
 * 支持：
 * - 起始值 start
 * - 前缀 prefix
 * - 后缀 suffix
 * - 补零 padding
 *
 * 示例：
 *
 * {
 *   type: "sequence",
 *   start: 1,
 *   prefix: "EMP-",
 *   padding: 5,
 *   suffix: ""
 * }
 *
 * 生成：
 *
 * EMP-00001
 * EMP-00002
 * EMP-00003
 */
export function generateSequence(generator = {}, index = 0) {
  const start = Number(generator.start ?? 1);

  const value = start + index;

  const padding = Number(generator.padding ?? 0);

  const prefix = generator.prefix ?? "";

  const suffix = generator.suffix ?? "";

  /**
   * 补零
   *
   * padding = 5
   *
   * 1   -> 00001
   * 12  -> 00012
   * 123 -> 00123
   */
  const formattedValue =
    padding > 0 ? String(value).padStart(padding, "0") : String(value);

  return prefix + formattedValue + suffix;
}
