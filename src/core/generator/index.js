import { generateByFaker } from "./faker";
import { generateChinesePhone } from "./phone";
import { randomInt, randomNumber } from "./random";
import { randomEnum } from "./enum";
import { generateIdCard } from "./idcard";
import { generateBankCard } from "./bankcard";
import { generateDate } from "./date";
import { generateSequence } from "./sequence";

/**
 * 最大唯一值重试次数
 *
 * 防止 enum / constant / random 等 Generator
 * 在开启 unique 后出现死循环。
 */
const MAX_UNIQUE_RETRY = 100;

/**
 * 允许为空时，空值出现的概率
 *
 * 0.1 = 10%
 */
const NULLABLE_PROBABILITY = 0.1;

/**
 * 判断本次是否生成空值
 */
function shouldGenerateNull(field) {
  return field.nullable === true && Math.random() < NULLABLE_PROBABILITY;
}

/**
 * 判断是否为空值
 *
 * 注意：
 * 0 和 false 都不是空值。
 */
function isEmptyValue(value) {
  return value === "" || value === null || value === undefined;
}

/**
 * 根据字段类型统一处理最终数据类型
 */
function normalizeValue(field, value) {
  if (isEmptyValue(value)) {
    return value;
  }

  switch (field.type) {
    case "Integer": {
      const numberValue = Number(value);

      if (!Number.isFinite(numberValue)) {
        return value;
      }

      return Math.trunc(numberValue);
    }

    case "Decimal": {
      const numberValue = Number(value);

      if (!Number.isFinite(numberValue)) {
        return value;
      }

      return numberValue;
    }

    case "Boolean": {
      if (typeof value === "boolean") {
        return value;
      }

      if (value === "true" || value === "1" || value === 1) {
        return true;
      }

      if (value === "false" || value === "0" || value === 0) {
        return false;
      }

      return Boolean(value);
    }

    case "String":
    case "DateTime":
    case "Enum":
    default:
      return String(value);
  }
}

/**
 * 原始数据生成
 *
 * 这里只负责生成数据，
 * 不处理 nullable 和 unique。
 */
function generateRawValue(field, index) {
  const generator = field.generator || {};

  switch (generator.type) {
    case "faker":
      return generateByFaker(generator.method);

    case "phone":
      return generateChinesePhone();

    case "idcard":
      return generateIdCard();

    case "bankcard":
      return generateBankCard(generator.length);

    case "date":
      return generateDate(generator);

    case "random":
      if (generator.randomType === "boolean") {
        return Math.random() >= 0.5;
      }
      // 金额
      if (generator.randomType === "amount") {
        return randomNumber(
          generator.min,
          generator.max,
          generator.precision === undefined ? 2 : generator.precision,
        );
      }

      // 整数
      return randomInt(generator.min, generator.max);

    case "enum":
      return randomEnum(generator.values);

    case "sequence":
      return generateSequence(generator, index);

    case "constant":
      // ⭐ 修改：保留 0、false 等合法值
      return generator.value ?? "";

    default:
      return "";
  }
}

/**
 * 生成唯一值
 *
 * usedValues：
 * 当前一次数据生成任务中，
 * 每个字段对应一个 Set。
 */
function generateUniqueValue(field, index, usedValues) {
  const fieldKey = field.key;
  const generator = field.generator || {};

  /**
   * nullable 优先处理
   *
   * 空值不参与 unique。
   */
  if (shouldGenerateNull(field)) {
    return "";
  }

  /**
   * 没有开启唯一值
   */
  if (!generator.unique) {
    const value = generateRawValue(field, index);

    // ⭐ 新增：统一处理字段类型
    return normalizeValue(field, value);
  }

  /**
   * 当前字段还没有 Set
   */
  if (!usedValues[fieldKey]) {
    usedValues[fieldKey] = new Set();
  }

  const valueSet = usedValues[fieldKey];

  let value;

  /**
   * 尝试生成唯一值
   */
  for (let retryCount = 0; retryCount < MAX_UNIQUE_RETRY; retryCount++) {
    value = generateRawValue(field, index);

    /**
     * 空值不加入唯一值集合
     */
    if (isEmptyValue(value)) {
      return value;
    }

    /**
     * ⭐ 新增：
     * 根据字段类型统一转换。
     *
     * 注意必须在 unique 判断之前转换，
     * 保证 Set 中保存的是最终数据类型。
     */
    value = normalizeValue(field, value);

    /**
     * 没有重复
     */
    if (!valueSet.has(value)) {
      valueSet.add(value);

      return value;
    }
  }

  /**
   * 100 次都没有生成唯一值
   */
  throw new Error(
    "字段【" +
      field.name +
      "】无法生成唯一值。" +
      "Generator：" +
      (generator.type || "unknown") +
      "，已连续尝试 " +
      MAX_UNIQUE_RETRY +
      " 次仍然重复。" +
      "请扩大数据生成范围或关闭「生成唯一值」。",
  );
}

/**
 * 生成字段值
 */
export function generateValue(field, index, usedValues) {
  return generateUniqueValue(field, index, usedValues || {});
}

/**
 * 生成一行数据
 */
export function generateRow(fields, index, usedValues) {
  const row = {
    _key: "row-" + String(index + 1).padStart(6, "0"),
  };

  fields.forEach(function (field) {
    row[field.key] = generateValue(field, index, usedValues);
  });

  return row;
}

/**
 * 生成数据
 *
 * usedValues 放在循环外，
 * 保证同一次生成任务中，
 * 每个字段都能正确判断重复值。
 */
export function generateData(fields, count) {
  const result = new Array(count);

  /**
   * 当前一次生成任务的唯一值集合
   */
  const usedValues = {};

  /**
   * 开始生成数据
   */
  for (let i = 0; i < count; i++) {
    result[i] = generateRow(fields, i, usedValues);
  }

  return result;
}
