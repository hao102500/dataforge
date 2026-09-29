import React, { useState } from "react";
import { Listy, Button, Input, Modal, Select } from "antd";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/**
 * 可拖拽字段
 */
function SortableField({ field, selected, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "df-field-item",
        selected ? "is-selected" : "",
        isDragging ? "is-dragging" : "",
      ].join(" ")}
      onClick={onClick}
    >
      {/* 拖拽手柄 */}
      <button
        type="button"
        className="df-field-drag"
        {...attributes}
        {...listeners}
        onClick={(event) => {
          event.stopPropagation();
        }}
        aria-label={`拖拽 ${field.name}`}
      >
        <HolderOutlined />
      </button>
      {/* 字段内容 */}
      <div className="df-field-main">
        <div className="df-field-title">
          <span className="df-field-name">{field.name}</span>

          <span className="df-field-key">{field.key}</span>
        </div>

        <div className="df-field-description">{field.description}</div>
      </div>
      {/* 字段类型 */}
      <span className="df-field-type">{field.type}</span>
    </div>
  );
}

/**
 * ⭐ 新增
 * 根据 Generator 类型生成默认配置
 */
function getDefaultGenerator(generatorType) {
  switch (generatorType) {
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
        length: 16,
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
        values: ["选项一", "选项二", "选项三"],
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
        end: "2025-12-31",
        unique: false,
      };

    case "constant":
    default:
      return {
        type: "constant",
        value: "",
        unique: false,
      };
  }
}

/**
 * 生成默认字段 Key
 * 如果用户没有填写 Key，则使用：field_1、field_2……
 */
function getDefaultFieldKey(fields) {
  const existingKeys = new Set(
    fields.map((item) => String(item.key || "").toLowerCase()),
  );
  let index = fields.length + 1;
  let key = `field_${index}`;
  while (existingKeys.has(key.toLowerCase())) {
    index += 1;
    key = `field_${index}`;
  }
  return key;
}

// 生成唯一 Key
function createUniqueFieldKey(baseKey, fields) {
  const existingKeys = new Set(
    fields.map((item) => String(item.key || "").toLowerCase()),
  );
  let key = String(baseKey || "").trim();
  if (!key) {
    key = getDefaultFieldKey(fields);
  }
  if (!existingKeys.has(key.toLowerCase())) {
    return key;
  }
  let index = 2;
  while (existingKeys.has(`${key}_${index}`.toLowerCase())) {
    index += 1;
  }
  return `${key}_${index}`;
}

/**
 * 默认 Schema
 *
 * generator 使用对象结构：
 *
 * generator: {
 *   type: "...",
 *   ...
 * }
 *
 * 与 core/generator/index.js 保持一致。
 */
const initialFields = [
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
    description: "EMP- 序列递增",
    type: "String",

    generator: {
      type: "sequence",
      start: 1,
      prefix: "EMP-",
      padding: 5,
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
    description: "研发中心、产品中心、商业运营部...",
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
    description: "P5、P6、P7、M1...",
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
];

export { initialFields };

export default function FieldComposer({
  fields = initialFields,
  selectedFieldKey,
  onSelectField,
  onFieldsChange,
}) {
  const [addFieldOpen, setAddFieldOpen] = useState(false);

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldType, setNewFieldType] = useState("String");
  const [newGeneratorType, setNewGeneratorType] = useState("constant");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleOpenAddField = () => {
    setNewFieldName("");
    setNewFieldKey("");
    setNewFieldType("String");
    setNewGeneratorType("constant");
    setAddFieldOpen(true);
  };

  const handleCloseAddField = () => {
    setAddFieldOpen(false);
    setNewFieldName("");
    setNewFieldKey("");
    setNewFieldType("String");
    setNewGeneratorType("constant");
  };

  const handleAddField = () => {
    const name = newFieldName.trim();

    if (!name) {
      return;
    }

    let key = newFieldKey.trim();

    // 用户没有填写 Key
    if (!key) {
      key = getDefaultFieldKey(fields);
    } else {
      // Key 重复时自动处理
      key = createUniqueFieldKey(key, fields);
    }

    const newField = {
      key,
      name,
      description: "",
      type: newFieldType,
      nullable: false,

      generator: getDefaultGenerator(newGeneratorType),
    };

    const nextFields = [...fields, newField];

    // 更新字段
    onFieldsChange?.(nextFields);

    // 自动选中新字段
    onSelectField?.(newField);

    // 关闭弹窗
    handleCloseAddField();
  };

  const handleFieldNameChange = (event) => {
    setNewFieldName(event.target.value);
  };

  /**
   * 拖拽结束
   */
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = fields.findIndex((item) => item.key === active.id);

    const newIndex = fields.findIndex((item) => item.key === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nextFields = arrayMove(fields, oldIndex, newIndex);

    onFieldsChange?.(nextFields);
  };

  return (
    <>
      <section className="df-field-composer df-card">
        {/* Header */}
        <div className="df-section-header">
          <div className="df-section-heading">
            <div className="df-section-title">字段编排</div>

            <div className="df-section-subtitle">
              拖拽调整字段顺序，点击字段编辑生成规则
            </div>
          </div>

          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={handleOpenAddField}
          />
    
        </div>

        {/* Field List */}
        <div className="df-field-list">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((item) => item.key)}
              strategy={verticalListSortingStrategy}
            >
              <Listy
                items={fields}
                rowKey="key"
                virtual={false}
                itemRender={(field) => (
                  <SortableField
                    field={field}
                    selected={selectedFieldKey === field.key}
                    onClick={() => onSelectField?.(field)}
                  />
                )}
              />
            </SortableContext>
          </DndContext>
        </div>
      </section>

      <Modal
        title="添加字段"
        open={addFieldOpen}
        onCancel={handleCloseAddField}
        onOk={handleAddField}
        okText="添加"
        cancelText="取消"
        destroyOnHidden
      >
        <div className="df-field-form">
          {/* ⭐ 新增：字段名称 */}
          <div className="df-form-item">
            <div className="df-form-label">字段名称</div>

            <Input
              value={newFieldName}
              placeholder="例如：邮箱地址"
              maxLength={50}
              onChange={handleFieldNameChange}
            />
          </div>

          {/* ⭐ 新增：字段 Key */}
          <div className="df-form-item">
            <div className="df-form-label">字段 Key</div>

            <Input
              value={newFieldKey}
              placeholder="例如：email"
              maxLength={50}
              onChange={(event) => {
                setNewFieldKey(event.target.value);
              }}
            />
          </div>

          {/* ⭐ 新增：数据类型 */}
          <div className="df-form-item">
            <div className="df-form-label">数据类型</div>

            <Select
              value={newFieldType}
              style={{
                width: "100%",
              }}
              onChange={setNewFieldType}
              options={[
                { value: "String", label: "String" },
                { value: "Integer", label: "Integer" },
                { value: "Decimal", label: "Decimal" },
                { value: "Boolean", label: "Boolean" },
                { value: "DateTime", label: "DateTime" },
              ]}
            />
          </div>

          {/* ⭐ 新增：Generator */}
          <div className="df-form-item">
            <div className="df-form-label">Generator</div>

            <Select
              value={newGeneratorType}
              style={{
                width: "100%",
              }}
              onChange={setNewGeneratorType}
              options={[
                { value: "constant", label: "固定值" },
                { value: "faker", label: "中文姓名" },
                { value: "phone", label: "手机号" },
                { value: "idcard", label: "身份证" },
                { value: "bankcard", label: "银行卡" },
                { value: "random", label: "随机数" },
                { value: "enum", label: "枚举" },
                { value: "sequence", label: "序列" },
                { value: "date", label: "日期" },
              ]}
            ></Select>
          </div>
        </div>
      </Modal>
    </>
  );
}
