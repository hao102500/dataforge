import React, { useMemo, useState } from "react";
import { Button, Input, Table } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

export default function DataStream({ fields = [], data = [] }) {
  const [keyword, setKeyword] = useState("");

  /**
   * 根据字段动态生成表格列
   */
  const columns = useMemo(() => {
    return fields.map((field) => ({
      title: field.name,
      dataIndex: field.key,
      key: field.key,
      width: 160,
      ellipsis: true,
      render: (value) => {
        if (value === null || value === undefined || value === "") {
          return "-";
        }

        return value;
      },
    }));
  }, [fields]);

  /**
   * 搜索
   */
  const filteredData = useMemo(() => {
    if (!keyword.trim()) {
      return data;
    }

    const searchValue = keyword.trim().toLowerCase();

    return data.filter((row) => {
      return fields.some((field) => {
        const value = row[field.key];

        return String(value ?? "")
          .toLowerCase()
          .includes(searchValue);
      });
    });
  }, [data, fields, keyword]);

  return (
    <section className="df-data-stream df-card">
      <div className="df-section-header">
        <div>
          <div className="df-section-title">实时仿真数据流</div>

          <div className="df-section-subtitle">Schema 驱动生成 · 实时预览</div>
        </div>

        {/* <Button type="text" icon={<ReloadOutlined />} /> */}
        <Input
          style={{ width: 180 }}
          size="small"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          prefix={<SearchOutlined />}
          placeholder="搜索数据..."
          allowClear
        />
      </div>

      {/* <div className="df-data-toolbar">
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          prefix={<SearchOutlined />}
          placeholder="搜索数据..."
          allowClear
        />

        <span className="df-data-count">{filteredData.length} 条</span>
      </div> */}

      <div className="df-data-table">
        <Table
          rowKey="_key"
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          size="small"
          scroll={{
            x: "max-content",
            y: 180,
          }}
        />
      </div>
    </section>
  );
}
