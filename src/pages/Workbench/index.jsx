import React, { useMemo, useState } from "react";

import CommandStrip from "../../components/dataforge/CommandStrip";

import AssetPanel from "../../components/dataforge/AssetPanel";

import FieldComposer, {
  initialFields,
} from "../../components/dataforge/FieldComposer";

import RuleInspector from "../../components/dataforge/RuleInspector";

import DataStream from "../../components/dataforge/DataStream";

import ExportPipeline from "../../components/dataforge/ExportPipeline";

// ⭐ 删除
// import { generateData } from "../../core/generator";

// ⭐ 新增
// Worker生成入口
import { generateByWorker } from "../../core/generator/workerClient";

import { convertTemplateFields } from "../../core/schema/convertTemplate";

import { saveSchema } from "@/core/schema/schemaStore";

import "./index.css";

const DEFAULT_BATCH = 1000;

const PREVIEW_COUNT = 100;

export default function Workbench() {
  /**
   * 当前字段
   */
  const [fields, setFields] = useState(initialFields);

  /**
   * 吞吐率
   */
  const [throughput, setThroughput] = useState(0);

  /**
   * Schema信息
   */
  const [schemaInfo, setSchemaInfo] = useState({
    name: "员工薪资与档案",

    code: "HR Staff Master",

    version: "v2.4.1",

    template: "企业人事 / 员工档案",
  });

  /**
   * 当前字段
   */
  const [selectedFieldKey, setSelectedFieldKey] = useState(
    initialFields[0]?.key,
  );

  /**
   * 数量
   */
  const [batch, setBatch] = useState(DEFAULT_BATCH);

  /**
   * 生成数据
   *
   * ⭐ 修改
   *
   * Worker异步
   * 所以不能初始化生成
   */
  const [generatedData, setGeneratedData] = useState([]);

  /**
   * ⭐ 新增
   *
   * 统一Worker生成入口
   *
   */
  const generateWithWorker = async (nextFields, count) => {
    const start = performance.now();

    const data = await generateByWorker(nextFields, count);

    const end = performance.now();

    const seconds = (end - start) / 1000;

    const speed = seconds > 0 ? Math.floor(count / seconds) : 0;

    setThroughput(speed);

    setGeneratedData(data);

    return data;
  };

  /**
   * 页面初始化生成默认数据
   */
  React.useEffect(() => {
    generateWithWorker(initialFields, DEFAULT_BATCH);
  }, []);

  /**
   * 当前字段
   */
  const selectedField = useMemo(() => {
    return fields.find((item) => item.key === selectedFieldKey);
  }, [fields, selectedFieldKey]);

  /**
   * Schema加载
   */
  const loadSchema = (nextFields, info) => {
    setFields(nextFields);

    setSelectedFieldKey(nextFields[0]?.key);

    setSchemaInfo(info);

    // ⭐ 修改
    // 原 generateData 改成 Worker
    generateWithWorker(nextFields, batch);
  };

  /**
   * 选择模板
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
   * 默认Schema
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
   * 重新生成
   */
  const handleRegenerate = () => {
    // ⭐ 修改
    generateWithWorker(fields, batch);
  };

  /**
   * 修改数量
   */
  const handleBatchChange = (value) => {
    setBatch(value);

    // ⭐ 修改
    generateWithWorker(fields, value);
  };

  /**
   * 字段变化
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

    // ⭐ 修改
    generateWithWorker(nextFields, batch);
  };

  /**
   * 保存Schema
   */
  const handleSaveSchema = () => {
    saveSchema({
      id: schemaInfo.code,

      name: schemaInfo.name,

      version: schemaInfo.version,

      fields,
    });
  };

  /**
   * 预览100条
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
        throughput={throughput}
        onSaveSchema={handleSaveSchema}
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
