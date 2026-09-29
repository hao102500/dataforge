import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const schemas = [
  {
    name: "员工薪资与档案",
    meta: "10 字段 · 24k 已生成",
    active: true,
  },
  {
    name: "电商订单与结算",
    meta: "14 字段 · 120k 已生成",
  },
  {
    name: "用户行为日志",
    meta: "8 字段 · 500k 已生成",
  },
];

const templates = [
  "企业人事 / 代发薪资",
  "金融 / 借记卡流水",
  "跨境电商 / 订单履约",
  "SaaS 多租户账单",
];

export default function AssetPanel() {
  const [keyword, setKeyword] = useState("");

  const filteredSchemas = schemas.filter((item) => item.name.includes(keyword));

  return (
    <aside className="df-asset-panel">
      <div className="df-asset-header">
        <div className="df-asset-title">
          <span>资产与模板</span>

          <span className="df-asset-count">8 方案</span>
        </div>

        <div className="df-asset-search">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索 Schema / 模板..."
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      </div>

      <div className="df-asset-content">
        <div className="df-asset-section-title">我的 Schema</div>

        {filteredSchemas.map((item) => (
          <div
            key={item.name}
            className={["df-asset-item", item.active ? "is-active" : ""].join(
              " ",
            )}
          >
            <div className="df-asset-name">{item.name}</div>

            <div className="df-asset-meta">{item.meta}</div>
          </div>
        ))}

        <div className="df-asset-section-title">预置模板</div>

        {templates.map((item) => (
          <div key={item} className="df-asset-item">
            <div className="df-asset-name">{item}</div>
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
