/**
 * 默认 Schema
 *
 * 员工薪资与档案
 */

export const defaultSchema = {
  id: "hr-master",

  name: "员工薪资与档案",

  version: "v2.4.1",

  fields: [
    /**
     * 姓名
     */
    {
      key: "name",

      name: "姓名",

      description: "Faker · 中文姓名",

      type: "String",

      generator: {
        type: "faker",
        method: "name.chineseName",
        unique: false,
      },

      nullable: false,
    },

    /**
     * 手机号码
     */
    {
      key: "phone",

      name: "手机号码",

      description: "中国大陆 11 位手机号",

      type: "String",

      generator: {
        type: "phone",
        unique: true,
      },

      nullable: false,
    },

    /**
     * 身份证号
     */
    {
      key: "id_card",

      name: "身份证号",

      description: "中国大陆 18 位身份证号",

      type: "String",

      generator: {
        type: "idcard",
        unique: true,
      },

      nullable: false,
    },

    /**
     * 工号
     */
    {
      key: "staff_no",

      name: "工号",

      description: "EMP-00001 序列递增",

      type: "String",

      generator: {
        type: "sequence",

        start: 1,

        prefix: "EMP-",

        padding: 5,

        suffix: "",

        unique: true,
      },

      nullable: false,
    },

    /**
     * 所属部门
     */
    {
      key: "department",

      name: "所属部门",

      description: "研发中心、产品中心、商业运营部",

      type: "Enum",

      generator: {
        type: "enum",

        values: [
          "研发中心",

          "平台产品部",

          "商业化运营部",

          "财经与风控中心",

          "人力资源部",
        ],

        unique: false,
      },

      nullable: false,
    },

    /**
     * 岗位职级
     */
    {
      key: "job_level",

      name: "岗位职级",

      description: "P5、P6、P7、M1",

      type: "Enum",

      generator: {
        type: "enum",

        values: ["P5", "P6", "P7", "M1", "M2"],

        unique: false,
      },

      nullable: false,
    },

    /**
     * 基本工资
     */
    {
      key: "base_salary",

      name: "基本工资",

      description: "¥8,000 - ¥45,000",

      type: "Decimal",

      generator: {
        type: "random",

        randomType: "amount",

        min: 8000,

        max: 45000,

        precision: 2,

        unique: false,
      },

      nullable: false,
    },

    /**
     * 入职日期
     */
    {
      key: "hire_date",

      name: "入职日期",

      description: "2020-01-01 至 2024-03-31",

      type: "DateTime",

      generator: {
        type: "date",

        start: "2020-01-01",

        end: "2024-03-31",

        unique: false,
      },

      nullable: false,
    },
  ],

  createdAt: new Date().toISOString(),

  updatedAt: new Date().toISOString(),
};
