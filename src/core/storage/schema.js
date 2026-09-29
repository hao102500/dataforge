const STORAGE_KEY = "dataforge_schemas";

/**
 * 获取全部 Schema
 */
function getSchemas() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    const result = JSON.parse(data);

    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("读取 Schema 失败：", error);

    return [];
  }
}

/**
 * 保存 Schema 列表
 */
function saveSchemas(schemas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemas));
}

/**
 * 获取 Schema 列表
 */
export function getSchemaList() {
  return getSchemas();
}

/**
 * 根据 ID 获取 Schema
 */
export function getSchemaById(id) {
  const schemas = getSchemas();

  return (
    schemas.find(function (item) {
      return String(item.id) === String(id);
    }) || null
  );
}

/**
 * 新增 / 更新 Schema
 */
export function saveSchema(schema) {
  if (!schema) {
    return null;
  }

  const schemas = getSchemas();

  const index = schemas.findIndex(function (item) {
    return String(item.id) === String(schema.id);
  });

  if (index === -1) {
    /**
     * 新增
     *
     * 放在最前面
     */
    schemas.unshift(schema);
  } else {
    /**
     * 更新
     */
    schemas.splice(index, 1, schema);
  }

  saveSchemas(schemas);

  return schema;
}

/**
 * 删除 Schema
 */
export function deleteSchema(id) {
  const schemas = getSchemas();

  const result = schemas.filter(function (item) {
    return String(item.id) !== String(id);
  });

  saveSchemas(result);
}

/**
 * 清空所有 Schema
 */
export function clearSchemas() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 判断是否存在指定 Schema
 */
export function hasSchema(id) {
  return getSchemaById(id) !== null;
}

/**
 * 创建 Schema ID
 */
export function createSchemaId() {
  return "schema-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}
