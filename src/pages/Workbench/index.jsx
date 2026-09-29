import React, { useMemo, useState } from "react";

import CommandStrip from "../../components/dataforge/CommandStrip";

import AssetPanel from "../../components/dataforge/AssetPanel";

import FieldComposer, {
  initialFields,
} from "../../components/dataforge/FieldComposer";

import RuleInspector from "../../components/dataforge/RuleInspector";

import DataStream from "../../components/dataforge/DataStream";

import ExportPipeline from "../../components/dataforge/ExportPipeline";

import { generateData } from "../../core/generator";
import { convertTemplateFields } from "../../core/schema/convertTemplate";

import "./index.css";

const DEFAULT_BATCH = 1000;

const PREVIEW_COUNT = 100;

/**
 * Generator 描述
 */
function getGeneratorDescription(generator) {
  switch (generator.type) {
    case "faker":
      return "Faker · 中文姓名";

    case "phone":
      return "中国大陆 11 位手机号";

    case "idcard":
      return "18 位身份证号";

    case "bankcard":
      return "银行卡号";

    case "random":
      return `随机 ${generator.min}-${generator.max}`;

    case "enum":
      return generator.values.join("、");

    case "sequence":
      return "序列递增";

    case "date":
      return "日期范围生成";

    default:
      return "固定值";
  }
}


export default function Workbench() {
  /**
   * 当前字段
   */
  const [fields, setFields] = useState(initialFields);

  /**
   * 当前 Schema 信息
   */
  const [schemaInfo, setSchemaInfo] = useState({
    name: "员工薪资与档案",

    code: "HR Staff Master",

    version: "v2.4.1",

    template: "企业人事 / 员工档案",
  });

  /**
   * 当前选中字段
   */
  const [selectedFieldKey, setSelectedFieldKey] = useState(
    initialFields[0]?.key,
  );

  /**
   * 生成数量
   */
  const [batch, setBatch] = useState(DEFAULT_BATCH);

  /**
   * 生成数据
   */
  const [generatedData, setGeneratedData] = useState(() => {
    return generateData(initialFields, DEFAULT_BATCH);
  });

  /**
   * 当前字段
   */
  const selectedField = useMemo(() => {
    return fields.find((item) => item.key === selectedFieldKey);
  }, [fields, selectedFieldKey]);

  /**
   * ==================================
   *
   * ⭐ Schema统一加载入口
   *
   * 默认 Schema
   * 预置模板
   *
   * 都走这里
   *
   * ==================================
   */
  const loadSchema = (nextFields, info) => {
    /**
     * 更新字段
     */
    setFields(nextFields);

    /**
     * 默认选中第一列
     */
    setSelectedFieldKey(nextFields[0]?.key);

    /**
     * 更新顶部信息
     */
    setSchemaInfo(info);

    /**
     * 重新生成数据
     */
    const data = generateData(nextFields, batch);

    setGeneratedData(data);
  };

  /**
   * ==================================
   *
   * ⭐ 点击预置模板
   *
   * ==================================
   */
  const handleSelectTemplate = (template) => {
    const nextFields = convertTemplateFields(template);

    loadSchema(
      nextFields,

      {
        name: template.name,

        code: template.id,

        version: "v1.0.0",

        template: `${template.category} / ${template.name}`,
      },
    );
  };

  /**
   * ==================================
   *
   * ⭐ 点击默认 Schema
   *
   * 员工薪资与档案
   *
   * ==================================
   */
  const handleSelectDefault = () => {
    loadSchema(
      initialFields,

      {
        name: "员工薪资与档案",

        code: "HR Staff Master",

        version: "v2.4.1",

        template: "企业人事 / 员工档案",
      },
    );
  };

  /**
   * 顶部重新生成
   */
  const handleRegenerate = () => {
    const data = generateData(fields, batch);

    setGeneratedData(data);
  };

  /**
   * 修改批量数量
   */
  const handleBatchChange = (value) => {
    setBatch(value);

    const data = generateData(fields, value);

    setGeneratedData(data);
  };

  /**
   * 字段拖动
   */
  const handleFieldsChange = (nextFields) => {
    setFields(nextFields);
  };

  /**
   * 选择字段
   */
  const handleSelectField = (field) => {
    setSelectedFieldKey(field.key);
  };

  /**
   * 修改规则
   */
  const handleFieldChange = (updatedField) => {
    const nextFields = fields.map((field) => {
      return field.key === updatedField.key ? updatedField : field;
    });

    setFields(nextFields);

    const data = generateData(nextFields, batch);

    setGeneratedData(data);
  };

  /**
   * 预览数据
   */
  const previewData = useMemo(() => {
    return generatedData.slice(0, PREVIEW_COUNT);
  }, [generatedData]);

  return (
    <div className="df-app">
      <CommandStrip
        batch={batch}
        onBatchChange={handleBatchChange}
        onRegenerate={handleRegenerate}
        schemaInfo={schemaInfo}
        fieldCount={fields.length}
      />

      <div className="df-workspace">
        <AssetPanel
          onSelectTemplate={handleSelectTemplate}
          onSelectDefault={handleSelectDefault}
        />

        <main className="df-field-column">
          <FieldComposer
            fields={fields}
            selectedFieldKey={selectedFieldKey}
            onSelectField={handleSelectField}
            onFieldsChange={handleFieldsChange}
          />
        </main>

        <aside className="df-rule-column">
          <RuleInspector
            field={selectedField}
            fields={fields}
            onChange={handleFieldChange}
            onFieldsChange={handleFieldsChange}
            onSelectField={handleSelectField}
          />
        </aside>

        <aside className="df-right-column">
          <DataStream fields={fields} data={previewData} />

          <ExportPipeline fields={fields} data={generatedData} batch={batch} />
        </aside>
      </div>
    </div>
  );
}
