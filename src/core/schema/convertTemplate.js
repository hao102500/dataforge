/**
 * 模板字段转换
 *
 * schemaTemplates:
 *
 * {
 *   _key,
 *   name,
 *   label,
 *   type,
 *   generator
 * }
 *
 *
 * FieldComposer:
 *
 * {
 *   key,
 *   name,
 *   description,
 *   type,
 *   generator,
 *   nullable
 * }
 */

function getDescription(generator) {
  if (!generator) {
    return "";
  }

  switch (generator.type) {
    case "faker":
      return "Faker · 中文姓名";

    case "phone":
      return "中国大陆 11 位手机号";

    case "idcard":
      return "18 位身份证号";

    case "bankcard":
      return `${generator.length || 19} 位银行卡号`;

    case "random":
      if (generator.randomType === "amount") {
        return `金额 ${generator.min}-${generator.max}`;
      }

      return `随机 ${generator.min}-${generator.max}`;

    case "constant":
      return "固定值";

    case "enum":
      return generator.values?.join("、") || "枚举";

    case "sequence":
      return "序列递增";

    case "date":
      return `${generator.start} 至 ${generator.end}`;

    default:
      return "";
  }
}

/**
 * 类型转换
 */
function convertType(type) {
  switch (type) {
    case "string":
      return "String";

    case "number":
      return "Decimal";

    case "integer":
      return "Integer";

    default:
      return type;
  }
}



/**
 * 模板转字段
 */
export function convertTemplateFields(template) {
  return template.fields.map((field) => {
    return {
      /**
       * 保留模板 key
       */
      key: field.name,

      /**
       * 页面显示
       */
      name: field.label,

      /**
       * 描述
       */
      description: getDescription(field.generator),

      /**
       * 类型
       */
      type: convertType(field.type),

      /**
       * 生成规则
       */
      generator: field.generator,

      nullable: false,
    };
  });
}
