import { generateChineseName } from "./chinese";

/**
 * Faker 方法统一配置
 *
 * key:
 *   对应 schema generator.method
 *
 * label:
 *   页面显示名称
 *
 * generate:
 *   实际生成函数
 */
export const fakerMethods = {
  /**
   * 中文姓名
   */
  "name.chineseName": {
    label: "中文姓名",

    generate() {
      return generateChineseName();
    },
  },

  /**
   * 英文姓名
   */
  "name.name": {
    label: "英文姓名",

    generate() {
      return "John Smith";
    },
  },

  /**
   * 公司名称
   */
  "company.companyName": {
    label: "公司名称",

    generate() {
      const list = [
        "阿里云科技有限公司",

        "腾讯科技有限公司",

        "字节跳动有限公司",

        "华为技术有限公司",

        "西安科技有限公司",
      ];

      return list[Math.floor(Math.random() * list.length)];
    },
  },

  /**
   * 城市
   */
  "address.city": {
    label: "城市",

    generate() {
      const list = ["北京", "上海", "广州", "深圳", "西安", "杭州"];

      return list[Math.floor(Math.random() * list.length)];
    },
  },

  /**
   * 邮箱
   */
  "internet.email": {
    label: "邮箱",

    generate() {
      const random = Math.random().toString(36).substring(2, 8);

      return `${random}@example.com`;
    },
  },
};

/**
 * 给 RuleInspector 使用
 *
 * 自动生成 Select options
 */
export const fakerMethodOptions = Object.entries(fakerMethods).map(
  ([value, item]) => {
    return {
      label: item.label,

      value,
    };
  },
);
