import React, { useEffect, useState } from "react";
import { Button, Input, InputNumber, Select, Switch, message } from "antd";
import { CheckCircleOutlined, ThunderboltOutlined } from "@ant-design/icons";

const typeOptions = [
  {
    label: "String",
    value: "String",
  },
  {
    label: "Integer",
    value: "Integer",
  },
  {
    label: "Decimal",
    value: "Decimal",
  },
  { label: "Boolean", value: "Boolean" },
  {
    label: "DateTime",
    value: "DateTime",
  },
  {
    label: "Enum",
    value: "Enum",
  },
];

/**
 * Generator 类型
 *
 * 与 core/generator/index.js 保持一致
 */
const generatorOptions = [
  {
    label: "Faker",
    value: "faker",
  },
  {
    label: "手机号",
    value: "phone",
  },
  {
    label: "身份证号",
    value: "idcard",
  },
  {
    label: "银行卡号",
    value: "bankcard",
  },
  {
    label: "随机数",
    value: "random",
  },
  {
    label: "Enum",
    value: "enum",
  },
  {
    label: "Sequence",
    value: "sequence",
  },
  {
    label: "日期",
    value: "date",
  },
  {
    label: "Constant",
    value: "constant",
  },
];

// 字段类型与 Generator 的对应关系
const generatorTypeMap = {
  String: [
    "faker",
    "phone",
    "idcard",
    "bankcard",
    "enum",
    "sequence",
    "constant",
  ],

  Integer: ["random", "sequence", "constant"],

  Decimal: ["random", "constant"],
  Boolean: ["random", "constant"],

  DateTime: ["date", "constant"],

  Enum: ["enum", "constant"],
};

/**
 * Faker 方法
 *
 * 与 faker.js 保持一致
 */
const fakerMethodOptions = [
  {
    label: "中文姓名",
    value: "name.chineseName",
  },
];

/**
 * 创建 Generator 默认配置
 *
 * 只在切换 Generator 类型时使用。
 */
function createGenerator(type) {
  switch (type) {
    case "faker":
      return {
        type: "faker",
        method: "name.chineseName",
        unique: false,
      };

    case "phone":
      return {
        type: "phone",
        unique: true,
      };

    case "idcard":
      return {
        type: "idcard",
        unique: true,
      };

    case "bankcard":
      return {
        type: "bankcard",
        length: 19,
        unique: true,
      };

    case "random":
      return {
        type: "random",
        randomType: "integer",
        min: 1,
        max: 100,
        unique: false,
      };

    case "enum":
      return {
        type: "enum",
        values: [],
        unique: false,
      };

    case "sequence":
      return {
        type: "sequence",
        start: 1,
        prefix: "",
        padding: 0,
        suffix: "",
        unique: true,
      };

    case "date":
      return {
        type: "date",
        start: "2020-01-01",
        end: "2026-12-31",
        unique: false,
      };

    case "constant":
      return {
        type: "constant",
        value: "",
        unique: false,
      };

    default:
      return {
        type: "faker",
        method: "name.chineseName",
        unique: false,
      };
  }
}

function validateGenerator(generator) {
  if (!generator || !generator.type) {
    return {
      valid: false,
      message: "请选择生成器",
    };
  }

  switch (generator.type) {
    /**
     * Random
     */
    case "random": {
      if (generator.randomType === "boolean") {
        break;
      }
      const min = Number(generator.min);
      const max = Number(generator.max);

      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return {
          valid: false,
          message: "随机数的最小值和最大值必须是有效数字",
        };
      }

      if (min > max) {
        return {
          valid: false,
          message: "随机数的最小值不能大于最大值",
        };
      }

      /**
       * 金额
       */
      if (generator.randomType === "amount") {
        const precision = Number(generator.precision);

        if (!Number.isInteger(precision) || precision < 0 || precision > 6) {
          return {
            valid: false,
            message: "金额小数位数必须是 0～6 的整数",
          };
        }
      }

      break;
    }

    /**
     * Enum
     */
    case "enum": {
      const values = Array.isArray(generator.values) ? generator.values : [];

      if (values.length === 0) {
        return {
          valid: false,
          message: "请至少添加一个枚举值",
        };
      }

      /**
       * 过滤空字符串后再次判断
       */
      const validValues = values.filter((item) => String(item).trim() !== "");

      if (validValues.length === 0) {
        return {
          valid: false,
          message: "枚举值不能为空",
        };
      }

      break;
    }

    /**
     * Date
     */
    case "date": {
      const start = String(generator.start || "").trim();
      const end = String(generator.end || "").trim();

      if (!start || !end) {
        return {
          valid: false,
          message: "开始日期和结束日期不能为空",
        };
      }

      /**
       * 当前项目日期格式统一使用 YYYY-MM-DD
       */
      const startDate = new Date(`${start}T00:00:00`);
      const endDate = new Date(`${end}T00:00:00`);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return {
          valid: false,
          message: "日期格式不正确，请使用 YYYY-MM-DD",
        };
      }

      if (startDate > endDate) {
        return {
          valid: false,
          message: "开始日期不能晚于结束日期",
        };
      }

      break;
    }

    /**
     * Bank Card
     */
    case "bankcard": {
      const length = Number(generator.length);

      if (![16, 17, 18, 19].includes(length)) {
        return {
          valid: false,
          message: "银行卡长度必须是 16～19 位",
        };
      }

      break;
    }

    /**
     * Sequence
     */
    case "sequence": {
      const start = Number(generator.start);

      if (!Number.isFinite(start)) {
        return {
          valid: false,
          message: "序列起始值必须是有效数字",
        };
      }

      const padding = Number(generator.padding ?? 0);

      if (!Number.isInteger(padding) || padding < 0 || padding > 20) {
        return {
          valid: false,
          message: "补零位数必须是 0～20 的整数",
        };
      }

      break;
    }

    /**
     * Constant
     *
     * 固定值允许为空，因此这里不校验。
     */
    case "constant":
      break;

    /**
     * Faker / Phone / ID Card
     *
     * 暂时没有额外配置。
     */
    case "faker":
    case "phone":
    case "idcard":
      break;

    default:
      return {
        valid: false,
        message: "未知的 Generator 类型",
      };
  }

  return {
    valid: true,
  };
}

// ⭐ 新增：根据字段类型过滤 Generator
function getAvailableGeneratorOptions(fieldType) {
  const availableTypes = generatorTypeMap[fieldType] || [];

  return generatorOptions.filter((item) => availableTypes.includes(item.value));
}

export default function RuleInspector({
  field,
  fields = [],
  onChange,
  // 删除字段后更新字段列表
  onFieldsChange,
  // 删除字段后自动选择字段
  onSelectField,
}) {
  const [draft, setDraft] = useState(() => {
    if (!field) {
      return null;
    }
    return {
      ...field,
      generator:
        field.generator && typeof field.generator === "object"
          ? {
              ...field.generator,
            }
          : field.generator,
    };
  });

  // ⭐ 修改：初始化 draft 时校正 Generator
  useEffect(() => {
    if (!field) {
      setDraft(null);
      return;
    }

    const fieldType = field.type;

    const currentGenerator =
      field.generator && typeof field.generator === "object"
        ? field.generator
        : null;

    const availableTypes = generatorTypeMap[fieldType] || [];

    let nextGenerator = currentGenerator;

    // ⭐ 新增：旧 Generator 与字段类型不匹配时自动修正
    if (!currentGenerator || !availableTypes.includes(currentGenerator.type)) {
      const nextGeneratorType = availableTypes[0];
      nextGenerator = createGenerator(nextGeneratorType);
      // ⭐ 新增：Boolean 默认 Random Boolean
      if (fieldType === "Boolean" && nextGeneratorType === "random") {
        nextGenerator = { ...nextGenerator, randomType: "boolean" };
      }
    }

    setDraft({
      ...field,

      generator: {
        ...nextGenerator,
      },
    });
  }, [field]);

  if (!field) {
    return (
      <section className="df-rule-inspector df-card">
        <div className="df-empty-inspector">
          <ThunderboltOutlined />

          <div>选择一个字段</div>

          <span>点击左侧字段查看并编辑生成规则</span>
        </div>
      </section>
    );
  }

  /**
   * 防止旧 Schema / 异常 Schema 导致 generator 为字符串
   */
  const generator =
    draft.generator && typeof draft.generator === "object"
      ? draft.generator
      : createGenerator(
          typeof draft.generator === "string" ? draft.generator : "faker",
        );

  /**
   * 修改字段属性
   */
  const update = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * 修改 Generator 属性
   */
  const updateGenerator = (key, value) => {
    setDraft((prev) => {
      //：确保 generator 一定是对象
      const currentGenerator =
        prev.generator && typeof prev.generator === "object"
          ? prev.generator
          : generator;

      return {
        ...prev,

        generator: {
          ...currentGenerator,
          [key]: value,
        },
      };
    });
  };

  /**
   * 切换 Generator 类型
   */
  // ⭐ 修改：Boolean 字段选择 Random 时，使用 Boolean Random
  const handleGeneratorChange = (type) => {
    let nextGenerator = createGenerator(type);

    // ⭐ 新增：Boolean + Random 默认使用 boolean
    if (draft.type === "Boolean" && type === "random") {
      nextGenerator = {
        ...nextGenerator,
        randomType: "boolean",
      };
    }

    setDraft((prev) => ({
      ...prev,
      generator: nextGenerator,
    }));
  };

  // ⭐ 新增：切换字段类型
  const handleTypeChange = (value) => {
    const availableTypes = generatorTypeMap[value] || [];

    // 当前 Generator 仍然适用于新字段类型
    if (availableTypes.includes(generator.type)) {
      update("type", value);
      return;
    }

    // 当前 Generator 不适用，自动切换为该类型第一个 Generator
    const nextGeneratorType = availableTypes[0];

    let nextGenerator = createGenerator(nextGeneratorType);

    // ⭐ 新增：Boolean 默认使用 Random Boolean
    if (value === "Boolean" && nextGeneratorType === "random") {
      nextGenerator = {
        ...nextGenerator,
        randomType: "boolean",
      };
    }

    setDraft((prev) => ({
      ...prev,
      type: value,
      generator: nextGenerator,
    }));
  };

  // 应用规则前统一校验。
  const handleApply = () => {
    if (!draft) {
      return;
    }

    const validation = validateGenerator(generator);

    if (!validation.valid) {
      message.error(validation.message);
      return;
    }

    onChange?.({
      ...draft,
      generator: {
        ...generator,
      },
    });

    message.success("规则已应用");
  };

  const handleDelete = () => {
    // 至少保留一个字段
    if (fields.length <= 1) {
      return;
    }

    const currentIndex = fields.findIndex((item) => item.key === field.key);

    if (currentIndex === -1) {
      return;
    }

    // 删除当前字段
    const nextFields = fields.filter((item) => item.key !== field.key);

    // 更新字段列表
    onFieldsChange?.(nextFields);

    // =======================================================
    // 删除后自动选择：
    //
    // 1. 如果删除位置后面还有字段 → 选择后面的字段
    // 2. 如果删除的是最后一个 → 选择前一个字段
    // =======================================================
    const nextSelectedIndex =
      currentIndex < nextFields.length ? currentIndex : nextFields.length - 1;

    const nextSelectedField = nextFields[nextSelectedIndex];

    if (nextSelectedField) {
      onSelectField?.(nextSelectedField);
    }
  };

  return (
    <section className="df-rule-inspector df-card">
      {/* Header */}
      <div className="df-section-header">
        <div>
          <div className="df-section-title">规则检查器</div>

          <div className="df-section-subtitle">配置当前字段的数据生成规则</div>
        </div>

        <span className="df-rule-status">
          <CheckCircleOutlined />
          已配置
        </span>
      </div>

      <div className="df-rule-body">
        {/* 当前字段 */}
        <div className="df-rule-field-name">
          <span>{draft.name}</span>

          <code>{draft.key}</code>
        </div>

        {/* 字段类型 */}
        <div className="df-form-item">
          <label>字段类型</label>
          <Select
            value={draft.type}
            options={typeOptions}
            onChange={handleTypeChange}
            style={{ width: "100%" }}
          />
        </div>

        {/* Generator */}
        <div className="df-form-item">
          <label>生成器</label>
          <Select
            value={generator.type}
            // ⭐ 修改：只显示当前字段类型支持的 Generator
            options={getAvailableGeneratorOptions(draft.type)}
            onChange={handleGeneratorChange}
            style={{ width: "100%" }}
          />
        </div>

        {/* =========================
            Faker
        ========================== */}
        {generator.type === "faker" && (
          <div className="df-form-item">
            <label>Faker 方法</label>

            <Select
              value={generator.method || "name.chineseName"}
              options={fakerMethodOptions}
              onChange={(value) => updateGenerator("method", value)}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* =========================
            银行卡
        ========================== */}
        {generator.type === "bankcard" && (
          <div className="df-form-item">
            <label>银行卡长度</label>

            <Select
              value={generator.length || 19}
              options={[
                {
                  label: "16 位",
                  value: 16,
                },
                {
                  label: "17 位",
                  value: 17,
                },
                {
                  label: "18 位",
                  value: 18,
                },
                {
                  label: "19 位",
                  value: 19,
                },
              ]}
              onChange={(value) => updateGenerator("length", value)}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* =========================
            Random
        ========================== */}
        {generator.type === "random" && (
          <>
            <div className="df-form-item">
              <label>随机类型</label>

              <Select
                value={generator.randomType || "integer"}
                options={
                  draft.type === "Boolean"
                    ? [{ label: "布尔值", value: "boolean" }]
                    : draft.type === "Decimal"
                      ? [{ label: "金额", value: "amount" }]
                      : [{ label: "整数", value: "integer" }]
                }
                onChange={(value) => updateGenerator("randomType", value)}
                style={{
                  width: "100%",
                }}
              />
            </div>

            {/* ⭐ 修改：Boolean 不需要最小值和最大值 */}
            {generator.randomType !== "boolean" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="df-form-item">
                  <label>最小值</label>

                  <InputNumber
                    value={generator.min}
                    onChange={(value) => updateGenerator("min", value)}
                    style={{
                      width: "100%",
                    }}
                  />
                </div>

                <div className="df-form-item">
                  <label>最大值</label>

                  <InputNumber
                    value={generator.max}
                    onChange={(value) => updateGenerator("max", value)}
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            )}

            {generator.randomType === "amount" && (
              <div className="df-form-item">
                <label>小数位数</label>

                <InputNumber
                  min={0}
                  max={6}
                  value={generator.precision ?? 2}
                  onChange={(value) => updateGenerator("precision", value)}
                  style={{
                    width: "100%",
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* =========================
            Enum
        ========================== */}
        {generator.type === "enum" && (
          <div className="df-form-item">
            <label>枚举值</label>

            <Select
              mode="tags"
              value={generator.values || []}
              placeholder="输入后按 Enter 添加"
              onChange={(value) => updateGenerator("values", value)}
              style={{
                width: "100%",
              }}
            />
          </div>
        )}

        {/* =========================
            Sequence
        ========================== */}
        {generator.type === "sequence" && (
          <>
            <div className="df-form-item">
              <label>起始值</label>

              <InputNumber
                value={generator.start ?? 1}
                onChange={(value) => updateGenerator("start", value)}
                style={{
                  width: "100%",
                }}
              />
            </div>

            <div className="df-form-item">
              <label>前缀</label>

              <Input
                value={generator.prefix || ""}
                placeholder="例如 EMP-"
                onChange={(event) =>
                  updateGenerator("prefix", event.target.value)
                }
              />
            </div>

            <div className="df-form-item">
              <label>补零位数</label>

              <InputNumber
                min={0}
                max={20}
                value={generator.padding ?? 0}
                onChange={(value) => updateGenerator("padding", value)}
                style={{
                  width: "100%",
                }}
              />
            </div>

            <div className="df-form-item">
              <label>后缀</label>

              <Input
                value={generator.suffix || ""}
                placeholder="可选"
                onChange={(event) =>
                  updateGenerator("suffix", event.target.value)
                }
              />
            </div>
          </>
        )}

        {/* =========================
            Date
        ========================== */}
        {generator.type === "date" && (
          <>
            <div className="df-form-item">
              <label>开始日期</label>

              <Input
                value={generator.start || ""}
                placeholder="2020-01-01"
                onChange={(event) =>
                  updateGenerator("start", event.target.value)
                }
              />
            </div>

            <div className="df-form-item">
              <label>结束日期</label>

              <Input
                value={generator.end || ""}
                placeholder="2026-12-31"
                onChange={(event) => updateGenerator("end", event.target.value)}
              />
            </div>
          </>
        )}

        {/* =========================
            Constant
        ========================== */}
        {generator.type === "constant" && (
          <div className="df-form-item">
            <label>固定值</label>

            {draft.type === "Boolean" ? (
              <Select
                value={
                  generator.value === true || generator.value === "true"
                    ? "true"
                    : "false"
                }
                options={[
                  {
                    label: "true",
                    value: "true",
                  },
                  {
                    label: "false",
                    value: "false",
                  },
                ]}
                onChange={(value) => updateGenerator("value", value)}
                style={{
                  width: "100%",
                }}
              />
            ) : (
              <Input
                value={generator.value || ""}
                onChange={(event) =>
                  updateGenerator("value", event.target.value)
                }
              />
            )}
          </div>
        )}

        {/* 规则描述 */}
        <div className="df-form-item">
          <label>规则描述</label>

          <Input
            value={draft.description || ""}
            onChange={(event) => update("description", event.target.value)}
          />
        </div>

        {/* Switch */}
        <div className="df-rule-switches">
          <div className="df-rule-switch-item">
            <div>
              <div>唯一值</div>

              <span>确保生成数据不重复</span>
            </div>

            <Switch
              checked={!!generator.unique}
              onChange={(value) => updateGenerator("unique", value)}
            />
          </div>

          <div className="df-rule-switch-item">
            <div>
              <div>允许为空</div>

              <span>生成数据允许出现空值</span>
            </div>

            <Switch
              checked={!!draft.nullable}
              onChange={(value) => update("nullable", value)}
            />
          </div>
        </div>

        <div className="df-rule-actions">
          <Button danger onClick={handleDelete} disabled={fields.length <= 1}>
            删除字段
          </Button>

          <Button type="primary" onClick={handleApply}>
            应用规则变更
          </Button>
        </div>
      </div>
    </section>
  );
}
