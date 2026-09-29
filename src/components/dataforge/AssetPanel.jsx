import React, { useState } from "react";

import { Input } from "antd";

import { SearchOutlined } from "@ant-design/icons";

import { getSchemas } from "@/core/schema/schemaStore";

import { schemaTemplates } from "@/data/schemaTemplates";

export default function AssetPanel({
  onSelectTemplate,
  onSelectDefault,
  activeSchemaId,
}) {
  /**
   * 本地 Schema
   */
  const [schemas] = useState(() => getSchemas());

  /**
   * 搜索关键字
   */
  const [keyword, setKeyword] = useState("");

  /**
   * 我的 Schema 搜索
   */
  const filteredSchemas = schemas.filter((item) => {
    return item.name.includes(keyword);
  });

  /**
   * 模板搜索
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

          <div className="df-section-subtitle">预设模板，一秒开启测试数据</div>
        </div>

        {/* 搜索先保留 */}

        {/* 
        <div className="df-asset-search">

          <Input
            value={keyword}
            onChange={(e)=>{
              setKeyword(e.target.value);
            }}
            placeholder="搜索 Schema / 模板..."
            prefix={<SearchOutlined />}
            allowClear
          />

        </div>
        */}
      </div>

      <div className="df-asset-content">
        {/* ===================
            我的 Schema
        =================== */}

        <div className="df-asset-section-title">我的 Schema</div>

        {filteredSchemas.length === 0 && (
          <div className="df-empty">暂无 Schema</div>
        )}

        {filteredSchemas.map((item) => {
          const active = item.id === activeSchemaId;

          return (
            <div
              key={item.id}
              className={["df-asset-item", active ? "is-active" : ""].join(" ")}
              onClick={() => {
                onSelectDefault?.(item);
              }}
            >
              <div className="df-asset-name">{item.name}</div>

              <div className="df-asset-meta">
                {item.fields?.length || 0}
                {" 字段 "}

                {item.updatedAt &&
                  new Date(item.updatedAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}

        {/* ===================
            预置模板
        =================== */}

        <div className="df-asset-section-title">预置模板</div>

        {filteredTemplates.map((item) => {
          return (
            <div
              key={item.id}
              className="df-asset-item"
              onClick={() => {
                onSelectTemplate?.(item);
              }}
            >
              <div className="df-asset-name">
                {item.category}

                {" / "}

                {item.name}
              </div>

              <div className="df-asset-meta">{item.fields.length} 字段</div>
            </div>
          );
        })}
      </div>

      <button type="button" className="df-asset-import">
        <span className="material-symbols-outlined">add</span>从 DDL / OpenAPI
        导入
      </button>
    </aside>
  );
}
