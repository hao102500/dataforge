export const schemaTemplates = [
  {
    id: "salary-payment",

    category: "企业人事",

    name: "代发薪资",

    icon: "💰",

    description: "适用于企业员工工资代发数据",

    fields: [
      {
        _key: "salary-payment-name",

        name: "name",

        label: "姓名",

        type: "string",

        generator: {
          type: "faker",
          method: "name.chineseName",
          unique: false,
        },
      },

      {
        _key: "salary-payment-salary",

        name: "salary",

        label: "实发工资",

        type: "number",

        generator: {
          type: "random",

          randomType: "amount",

          min: 3000,

          max: 30000,

          precision: 2,

          unique: false,
        },
      },

      {
        _key: "salary-payment-bankCard",

        name: "bankCard",

        label: "银行卡号",

        type: "string",

        generator: {
          type: "bankcard",

          length: 19,

          unique: true,
        },
      },

      {
        _key: "salary-payment-remark",

        name: "remark",

        label: "备注",

        type: "string",

        generator: {
          type: "constant",

          value: "",

          unique: false,
        },
      },
    ],
  },
  {
    id: "salary-slip",
    category: "企业人事",
    name: "工资条",
    icon: "🧾",
    description: "适用于员工工资条数据",

    fields: [
      {
        _key: "salary-slip-name",
        name: "name",
        label: "姓名",
        type: "string",

        generator: {
          type: "faker",
          method: "name.chineseName",
          unique: false,
        },
      },

      {
        _key: "salary-slip-phone",
        name: "phone",
        label: "手机号",
        type: "string",

        generator: {
          type: "phone",
          unique: true,
        },
      },

      {
        _key: "id_card-slip-idCard",
        name: "idCard",
        label: "身份证号",
        type: "string",

        generator: {
          type: "idcard",
          unique: true,
        },
      },

      {
        _key: "salary-slip-salary",
        name: "salary",
        label: "实发工资",
        type: "number",

        generator: {
          type: "random",
          randomType: "amount",
          min: 3000,
          max: 30000,
          precision: 2,
          unique: false,
        },
      },
    ],
  },
];
