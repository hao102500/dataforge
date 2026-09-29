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

import "./index.css";

const DEFAULT_BATCH = 1000;
const PREVIEW_COUNT = 100;

export default function Workbench() {
  const [fields, setFields] = useState(initialFields);

  const [selectedFieldKey, setSelectedFieldKey] = useState(
    initialFields[0]?.key,
  );

  /**
   * 当前生成数量
   */
  const [batch, setBatch] = useState(DEFAULT_BATCH);

  /**
   * 当前生成的数据
   */
  const [generatedData, setGeneratedData] = useState(() =>
    generateData(initialFields, DEFAULT_BATCH),
  );

  /**
   * 当前选中的字段
   */
  const selectedField = useMemo(() => {
    return fields.find((item) => item.key === selectedFieldKey);
  }, [fields, selectedFieldKey]);

  /**
   * 重新生成数据
   */
  const regenerateData = (nextFields = fields, nextBatch = batch) => {
    const data = generateData(nextFields, nextBatch);

    setGeneratedData(data);
  };

  /**
   * 点击顶部「重新生成」
   */
  const handleRegenerate = () => {
    regenerateData(fields, batch);
  };

  /**
   * 切换生成数量
   */
  const handleBatchChange = (value) => {
    setBatch(value);

    regenerateData(fields, value);
  };

  /**
   * 字段拖拽排序
   *
   * 排序不会改变字段规则，
   * 数据列顺序会跟着 fields 改变。
   */
  const handleFieldsChange = (nextFields) => {
    setFields(nextFields);
  };

  /**
   * 点击字段
   */
  const handleSelectField = (field) => {
    setSelectedFieldKey(field.key);
  };

  /**
   * 修改字段规则
   */
  const handleFieldChange = (updatedField) => {
    const nextFields = fields.map((field) =>
      field.key === updatedField.key ? updatedField : field,
    );

    setFields(nextFields);

    /**
     * 修改规则后重新生成数据
     */
    regenerateData(nextFields, batch);
  };

  /**
   * DataStream 只展示前 100 条
   *
   * 实际 generatedData 仍然保留完整数据，
   * 导出使用完整 generatedData。
   */
  const previewData = useMemo(() => {
    return generatedData.slice(0, PREVIEW_COUNT);
  }, [generatedData]);

  return (
    <div className="df-app">
      {/* ========================================
          顶部 Command Strip
      ======================================== */}
      <CommandStrip
        batch={batch}
        onBatchChange={handleBatchChange}
        onRegenerate={handleRegenerate}
      />

      {/* ========================================
          4 列主工作区
      ======================================== */}
      <div className="df-workspace">
        {/* ========================================
            第一列：资产与模板
        ======================================== */}
        <AssetPanel />

        {/* ========================================
            第二列：字段编排
        ======================================== */}
        <main className="df-field-column">
          <FieldComposer
            fields={fields}
            selectedFieldKey={selectedFieldKey}
            onSelectField={handleSelectField}
            onFieldsChange={handleFieldsChange}
          />
        </main>

        {/* ========================================
            第三列：规则检查器
        ======================================== */}
        <aside className="df-rule-column">
          {/* <RuleInspector field={selectedField} onChange={handleFieldChange} /> */}
          <RuleInspector
            field={selectedField}
            fields={fields}
            onChange={handleFieldChange}
            onFieldsChange={handleFieldsChange}
            onSelectField={handleSelectField}
          />
        </aside>

        {/* ========================================
            第四列：数据流 + 导出
        ======================================== */}
        <aside className="df-right-column">
          <DataStream fields={fields} data={previewData} />

          <ExportPipeline fields={fields} data={generatedData} batch={batch} />
        </aside>
      </div>
    </div>
  );
}
