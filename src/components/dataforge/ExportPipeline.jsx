import React, { useMemo, useState } from "react";
import { Checkbox, Button, App } from "antd";

import { exportData } from "../../core/exporter";

const formats = [
  {
    key: "xlsx",
    title: "Excel",
    ext: ".xlsx",
    icon: "table_view",
  },
  {
    key: "csv",
    title: "CSV",
    ext: ".csv",
    icon: "description",
  },
  {
    key: "json",
    title: "JSON",
    ext: ".json",
    icon: "data_object",
  },
  {
    key: "sql",
    title: "SQL INSERT",
    ext: ".sql",
    icon: "database",
  },
];

export default function ExportPipeline({ fields = [], data = [], batch = 0 }) {
  const [format, setFormat] = useState("xlsx");

  const [bom, setBom] = useState(true);

  const [gzip, setGzip] = useState(true);

  const [exporting, setExporting] = useState(false);

  const { message } = App.useApp();

  /**
   * 当前格式
   */
  const currentFormat = useMemo(() => {
    return formats.find((item) => item.key === format);
  }, [format]);

  /**
   * 文件名
   */
  const filename = useMemo(() => {
    const extension = currentFormat?.ext || ".xlsx";

    return "员工薪资与档案_" + batch + "条" + extension;
  }, [currentFormat, batch]);

  /**
   * 预计文件大小
   *
   * 这里先做一个简单估算。
   *
   * 后续可以根据实际数据进行精确计算。
   */
  const estimatedSize = useMemo(() => {
    if (!data || data.length === 0) {
      return "0 KB";
    }

    try {
      let total = 0;

      /**
       * 只采样前 100 条，
       * 避免为了计算文件大小再次遍历 10 万条。
       */
      const sample = data.slice(0, Math.min(100, data.length));

      sample.forEach((row) => {
        fields.forEach((field) => {
          const value = row[field.key];

          if (value !== null && value !== undefined) {
            total += String(value).length;
          }
        });
      });

      /**
       * 按平均值估算全部数据
       */
      const average = total / sample.length;

      const estimatedBytes = average * data.length;

      if (estimatedBytes < 1024) {
        return Math.round(estimatedBytes) + " B";
      }

      if (estimatedBytes < 1024 * 1024) {
        return (estimatedBytes / 1024).toFixed(0) + " KB";
      }

      return (estimatedBytes / 1024 / 1024).toFixed(2) + " MB";
    } catch (error) {
      return "--";
    }
  }, [data, fields]);

  /**
   * 开始导出
   */
  const handleExport = () => {
    if (exporting) {
      return;
    }

    if (!data || data.length === 0) {
      message.warning("当前没有可以导出的数据");

      return;
    }

    if (!fields || fields.length === 0) {
      message.warning("当前没有可导出的字段");

      return;
    }

    setExporting(true);

    /**
     * 使用 setTimeout 让 loading
     * 先渲染出来。
     */
    setTimeout(() => {
      try {
        exportData(data, fields, format, filename, {
          bom,
          gzip,
          tableName: "dataforge_data",
        });

        message.success("导出成功");
      } catch (error) {
        console.error("DataForge 导出失败：", error);

        message.error(error?.message || "导出失败，请稍后重试");
      } finally {
        setExporting(false);
      }
    }, 50);
  };

  return (
    <section className="df-card df-export-pipeline" id="export-dock">
      {/* Header */}
      <div className="df-card-header">
        <div>
          <div className="df-card-title">流式导出与分发管道</div>

          <div className="df-export-subtitle">Zero-Copy Turbo Pipeline</div>
        </div>

        <span className="df-export-status">
          {exporting ? "EXPORTING" : "READY"}
        </span>
      </div>

      {/* Options */}
      <div className="df-export-options">
        <Checkbox
          checked={bom}
          onChange={(event) => setBom(event.target.checked)}
        >
          UTF-8 BOM、防乱码
        </Checkbox>

        <Checkbox
          checked={gzip}
          onChange={(event) => setGzip(event.target.checked)}
        >
          .gz 极速压缩
        </Checkbox>
      </div>

      {/* Format */}
      <div className="df-format-list">
        {formats.map((item) => {
          const selected = format === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={["df-format-card", selected ? "is-selected" : ""].join(
                " ",
              )}
              onClick={() => setFormat(item.key)}
            >
              {/* <span className="material-symbols-outlined">
                {item.icon}
              </span> */}

              <div>
                <div className="df-format-title">{item.title}</div>

                <div className="df-format-ext">{item.ext}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Size */}
      <div className="df-export-size">
        <span>预计文件大小</span>

        <strong>~{estimatedSize}</strong>

        <span>（{batch.toLocaleString()} 条）</span>
      </div>

      {/* Mode */}
      <div className="df-export-mode">
        <button type="button" className="df-mode-button is-active">
          cURL
        </button>

        <button type="button" className="df-mode-button">
          Mock
        </button>
      </div>

      {/* Export */}
      <Button
        type="primary"
        block
        loading={exporting}
        className="df-export-button"
        onClick={handleExport}
      >
        {exporting ? "正在极速打包流式传输..." : "开始极速流式导出"}

        {!exporting && <span className="df-button-shortcut">⌘E</span>}
      </Button>
    </section>
  );
}
