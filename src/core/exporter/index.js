import * as XLSX from "xlsx";

/**
 * 下载 Blob
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 获取字段显示名称
 *
 * 当前 Schema：
 * {
 *   key: "phone",
 *   name: "手机号码"
 * }
 *
 * 兼容以前：
 * {
 *   name: "phone",
 *   label: "手机号"
 * }
 */
function getFieldLabel(field) {
  return field.label || field.name || field.key || "";
}

/**
 * 获取字段 Key
 *
 * 当前 Generator 生成的数据：
 *
 * row[field.key]
 */
function getFieldKey(field) {
  return field.key || field.name || "";
}

/**
 * 判断字段是否应该作为文本导出
 *
 * 这些字段不能让 Excel / WPS 按数字处理：
 *
 * - 身份证
 * - 手机号
 * - 银行卡
 */
function isTextField(field) {
  const key = String(field.key || "").toLowerCase();
  const name = String(field.name || "").toLowerCase();
  const label = String(field.label || "");

  return (
    key === "idcard" ||
    key === "id_card" ||
    key === "idno" ||
    key === "id_no" ||
    key === "phone" ||
    key === "mobile" ||
    key === "mobilephone" ||
    key === "bankcard" ||
    key === "bank_card" ||
    name === "idcard" ||
    name === "id_card" ||
    name === "idno" ||
    name === "id_no" ||
    name === "phone" ||
    name === "mobile" ||
    name === "mobilephone" ||
    name === "bankcard" ||
    name === "bank_card" ||
    label.indexOf("身份证") !== -1 ||
    label.indexOf("手机号") !== -1 ||
    label.indexOf("手机") !== -1 ||
    label.indexOf("银行卡") !== -1 ||
    label.indexOf("银行卡号") !== -1
  );
}

/**
 * 获取导出值
 */
function getFieldValue(row, field) {
  const key = getFieldKey(field);

  const value = row[key];

  if (value === null || value === undefined) {
    return "";
  }

  return value;
}

/**
 * JSON 导出
 */
export function exportJSON(data, filename = "dataforge.json") {
  if (!data || data.length === 0) {
    return;
  }

  const json = JSON.stringify(data, null, 2);

  const blob = new Blob([json], {
    type: "application/json;charset=utf-8",
  });

  downloadBlob(blob, filename);
}

/**
 * CSV 字段转义
 */
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);

  if (
    text.indexOf(",") !== -1 ||
    text.indexOf('"') !== -1 ||
    text.indexOf("\n") !== -1 ||
    text.indexOf("\r") !== -1
  ) {
    return '"' + text.replace(/"/g, '""') + '"';
  }

  return text;
}

/**
 * CSV 导出
 *
 * 默认 UTF-8 BOM
 */
export function exportCSV(
  data,
  fields,
  filename = "dataforge.csv",
  options = {},
) {
  if (!data || data.length === 0 || !fields || fields.length === 0) {
    return;
  }

  const bom = options.bom === false ? "" : "\ufeff";

  const headers = fields.map(function (field) {
    return escapeCSV(getFieldLabel(field));
  });

  const rows = data.map(function (row) {
    return fields.map(function (field) {
      return escapeCSV(getFieldValue(row, field));
    });
  });

  const csv = [
    headers.join(","),
    ...rows.map(function (row) {
      return row.join(",");
    }),
  ].join("\r\n");

  const blob = new Blob([bom + csv], {
    type: "text/csv;charset=utf-8",
  });

  downloadBlob(blob, filename);
}

/**
 * Excel 导出
 *
 * 特殊字段：
 * 身份证 / 手机号 / 银行卡
 *
 * 强制使用文本类型，避免：
 *
 * 110101199003072381
 *
 * 被 Excel 转换成科学计数法。
 */
export function exportExcel(data, fields, filename = "dataforge.xlsx") {
  if (!data || data.length === 0 || !fields || fields.length === 0) {
    return;
  }

  /**
   * 第一行：表头
   */
  const headers = fields.map(function (field) {
    return getFieldLabel(field);
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  /**
   * 写入数据
   */
  data.forEach(function (row, rowIndex) {
    fields.forEach(function (field, fieldIndex) {
      const value = getFieldValue(row, field);

      const cellAddress = XLSX.utils.encode_cell({
        r: rowIndex + 1,
        c: fieldIndex,
      });

      /**
       * 身份证 / 手机号 / 银行卡
       *
       * 强制文本
       */
      if (isTextField(field)) {
        worksheet[cellAddress] = {
          t: "s",
          v: String(value),
        };

        return;
      }

      /**
       * 空值
       */
      if (value === null || value === undefined || value === "") {
        worksheet[cellAddress] = {
          t: "s",
          v: "",
        };

        return;
      }

      /**
       * 数字
       */
      if (typeof value === "number" && isFinite(value)) {
        worksheet[cellAddress] = {
          t: "n",
          v: value,
        };

        return;
      }

      /**
       * 其他全部按字符串
       */
      worksheet[cellAddress] = {
        t: "s",
        v: String(value),
      };
    });
  });

  /**
   * 设置 Excel 数据范围
   */
  worksheet["!ref"] = XLSX.utils.encode_range({
    s: {
      r: 0,
      c: 0,
    },
    e: {
      r: data.length,
      c: fields.length - 1,
    },
  });

  /**
   * 身份证 / 手机号 / 银行卡
   *
   * 设置 Excel 单元格格式为文本
   */
  fields.forEach(function (field, fieldIndex) {
    if (!isTextField(field)) {
      return;
    }

    for (let rowIndex = 1; rowIndex <= data.length; rowIndex++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: rowIndex,
        c: fieldIndex,
      });

      if (worksheet[cellAddress]) {
        worksheet[cellAddress].z = "@";
      }
    }
  });

  /**
   * 创建 Workbook
   */
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "数据");

  /**
   * 导出
   */
  XLSX.writeFile(workbook, filename);
}

/**
 * SQL 字符串转义
 */
function escapeSQL(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  const text = String(value);

  return "'" + text.replace(/'/g, "''") + "'";
}

/**
 * 判断是否为 SQL 数字
 */
function isSQLNumber(value) {
  return typeof value === "number" && isFinite(value);
}

/**
 * SQL INSERT 导出
 *
 * 示例：
 *
 * INSERT INTO employee
 * (name, phone)
 * VALUES
 * ('张三', '13812345678');
 */
export function exportSQL(
  data,
  fields,
  filename = "dataforge.sql",
  options = {},
) {
  if (!data || data.length === 0 || !fields || fields.length === 0) {
    return;
  }

  const tableName = options.tableName || "dataforge_data";

  const columns = fields.map(function (field) {
    return "`" + getFieldKey(field) + "`";
  });

  const lines = [];

  lines.push("-- DataForge SQL Export");

  lines.push("-- Records: " + data.length);

  lines.push("");

  data.forEach(function (row) {
    const values = fields.map(function (field) {
      const value = getFieldValue(row, field);

      /**
       * 数字字段保持数字
       */
      if (isSQLNumber(value) && !isTextField(field)) {
        return String(value);
      }

      /**
       * 字符串
       */
      return escapeSQL(value);
    });

    lines.push(
      "INSERT INTO `" +
        tableName +
        "` (" +
        columns.join(", ") +
        ") VALUES (" +
        values.join(", ") +
        ");",
    );
  });

  const sql = lines.join("\r\n");

  const bom = options.bom === false ? "" : "\ufeff";

  const blob = new Blob([bom + sql], {
    type: "text/plain;charset=utf-8",
  });

  downloadBlob(blob, filename);
}

/**
 * 根据格式统一导出
 *
 * format:
 *
 * xlsx
 * csv
 * json
 * sql
 */
export function exportData(data, fields, format, filename, options = {}) {
  switch (format) {
    case "xlsx":
      exportExcel(data, fields, filename || "dataforge.xlsx");
      break;

    case "csv":
      exportCSV(data, fields, filename || "dataforge.csv", options);
      break;

    case "json":
      exportJSON(data, filename || "dataforge.json");
      break;

    case "sql":
      exportSQL(data, fields, filename || "dataforge.sql", options);
      break;

    default:
      throw new Error("不支持的导出格式：" + format);
  }
}
