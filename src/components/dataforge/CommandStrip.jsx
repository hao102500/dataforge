import React, { useState } from "react";
import { Button } from "antd";
import { RocketOutlined } from "@ant-design/icons";

const batches = [
  {
    value: 100,
    label: "100",
  },
  {
    value: 1000,
    label: "1k",
  },
  {
    value: 10000,
    label: "10k",
  },
  {
    value: 50000,
    label: "50k",
  },
  {
    value: 100000,
    label: "100k",
    badge: "10万",
  },
];

export default function CommandStrip({
  batch = 1000,
  onBatchChange,
  onRegenerate,
}) {
  const [regenerating, setRegenerating] = useState(false);

  /**
   * 重新生成
   */
  const handleRegenerate = () => {
    if (regenerating) {
      return;
    }

    setRegenerating(true);

    /**
     * 通知 Workbench 重新生成数据
     */
    onRegenerate?.();

    /**
     * 保留原有 500ms 状态
     */
    setTimeout(() => {
      setRegenerating(false);
    }, 500);
  };

  /**
   * 极速压测导出
   */
  const handleExport = () => {
    const element = document.getElementById("export-dock");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <header className="df-command-strip">
      <div className="df-command-left">
        <span className="df-command-live" />

        <div className="df-command-title">
          <strong>员工薪资与档案11</strong>

          <span>HR Staff Master</span>
        </div>

        <span className="df-version">v2.4.1</span>

        <span className="df-command-meta">10 字段</span>

        <span className="df-command-meta">引用模板：企业人事 / 代发薪资</span>
      </div>

      <div className="df-command-right">
        <div className="df-batch-group">
          {batches.map((item) => (
            <button
              key={item.value}
              type="button"
              className={[
                "df-batch-button",
                batch === item.value ? "is-active" : "",
              ].join(" ")}
              onClick={() => onBatchChange?.(item.value)}
            >
              {item.label}

              {item.badge && <span>{item.badge}</span>}
            </button>
          ))}
        </div>

        <Button
          type="text"
          className="df-command-button"
          onClick={handleRegenerate}
          disabled={regenerating}
        >
          重新生成 <kbd>⌘R</kbd>
        </Button>

        <Button
          type="primary"
          className="df-command-export"
          onClick={handleExport}
          icon={<RocketOutlined />}
        >
          极速压测导出
        </Button>

        <Button type="text" className="df-command-button">
          DDL 逆向
        </Button>

        <span className="df-saved">Saved</span>

        <span className="df-throughput">86,400 rec/s</span>
      </div>
    </header>
  );
}
