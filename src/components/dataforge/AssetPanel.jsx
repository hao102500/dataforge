import React, { useState } from "react";

import { Input } from "antd";

import { SearchOutlined } from "@ant-design/icons";

import { schemaTemplates } from "@/data/schemaTemplates";

// 默认 Schema
const schemas = [
  {
    id: "hr-master",
    name: "员工薪资与档案",
    meta: "10 字段 · 24k 已生成",
    active: true,
  },
];

export default function AssetPanel({ onSelectTemplate, onSelectDefault }) {
  const [keyword, setKeyword] = useState("");

  /**
   * 我的 Schema 搜索
   */
  const filteredSchemas = schemas.filter((item) => {
    return item.name.includes(keyword);
  });

  /**
   * 预置模板搜索
   */
  const filteredTemplates = schemaTemplates.filter((item) => {
    const text = `${item.category}${item.name}`;

    return text.includes(keyword);
  });

  return (
    <aside className="df-asset-panel">
      <div className="df-asset-header">
        <div className="df-section-heading">
            <div className="df-section-title">资产与模板</div>

            <div className="df-section-subtitle">
              预设模板，一秒开启测试数据
            </div>
          </div>


        {/* <div className="df-asset-search">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索 Schema / 模板..."
            prefix={<SearchOutlined />}
            allowClear
          />
        </div> */}
      </div>

      <div className="df-asset-content">
        <div className="df-asset-section-title">我的 Schema</div>

        {filteredSchemas.map((item) => (
          <div
            key={item.name}
            className={["df-asset-item", item.active ? "is-active" : ""].join(
              " ",
            )}
            onClick={() => onSelectDefault?.()}
          >
            <div className="df-asset-name">{item.name}</div>

            <div className="df-asset-meta">{item.meta}</div>
          </div>
        ))}

        <div className="df-asset-section-title">预置模板</div>

        {filteredTemplates.map((item) => (
          <div
            key={item.id}
            className="df-asset-item"
            onClick={() => onSelectTemplate?.(item)}
          >
            <div className="df-asset-name">
              {item.category}
              {" / "}
              {item.name}
            </div>

            <div className="df-asset-meta">{item.fields.length} 字段</div>
          </div>
        ))}
      </div>

      <button type="button" className="df-asset-import">
        <span className="material-symbols-outlined">add</span>从 DDL / OpenAPI
        导入
      </button>
    </aside>
  );
}
