import { defaultSchema } from "./defaultSchema";

const STORAGE_KEY = "dataforge.schemas";

/**
 * 获取全部 Schema
 */
export function getSchemas() {
  const data = localStorage.getItem(STORAGE_KEY);

  /**
   * 第一次进入
   * 或清空缓存
   */
  if (!data) {
    saveSchema(defaultSchema);

    return [defaultSchema];
  }

  try {
    const list = JSON.parse(data);

    /**
     * 防止异常空数组
     */
    if (!Array.isArray(list) || list.length === 0) {
      saveSchema(defaultSchema);

      return [defaultSchema];
    }

    return list;
  } catch (error) {
    console.error("Schema解析失败", error);

    saveSchema(defaultSchema);

    return [defaultSchema];
  }
}

/**
 * 保存 Schema
 */
export function saveSchema(schema) {
  const schemas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  const index = schemas.findIndex((item) => item.id === schema.id);

  const nextSchema = {
    ...schema,

    updatedAt: new Date().toISOString(),
  };

  if (index > -1) {
    schemas[index] = nextSchema;
  } else {
    schemas.push(nextSchema);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemas));

  return nextSchema;
}

/**
 * 根据ID获取
 */
export function getSchemaById(id) {
  return getSchemas().find((item) => item.id === id);
}

/**
 * 删除
 */
export function removeSchema(id) {
  const schemas = getSchemas().filter((item) => item.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemas));
}
