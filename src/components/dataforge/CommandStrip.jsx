import { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { batches } from "@/constants/batch";

// deploy status
import DeployStatus from "./DeployStatus";

export default function CommandStrip({
  batch = 100,
  onBatchChange,
  onRegenerate,
  onSaveSchema,
  schemaInfo,
  fieldCount = 0,
  throughput = 0,
}) {
  const [regenerating, setRegenerating] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * 重新生成
   */
  const handleRegenerate = () => {
    if (regenerating) {
      return;
    }

    setRegenerating(true);

    onRegenerate?.();

    timerRef.current = setTimeout(() => {
      setRegenerating(false);
    }, 500);
  };

  /**
   * 导出
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
      {/* 左侧信息 */}

      <div className="df-command-left">
        {/* <span className="df-command-status" /> */}

        {/* <div className="df-command-title">
          <strong>{schemaInfo?.name}</strong>
        </div> */}

        <DeployStatus />

        {/* <span className="df-version">{schemaInfo?.version}</span> */}

        {/* <span className="df-command-meta">{fieldCount} 字段</span> */}

        {/* <span className="df-command-meta">引用模板：企业人事 / 代发薪资</span> */}
      </div>

      {/* 右侧操作 */}

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
              onClick={() => {
                onBatchChange?.(item.value);
              }}
            >
              {item.label}

              {item.badge && <span>{item.badge}</span>}
            </button>
          ))}
        </div>

        <Button
          type="text"
          className="df-command-button"
          disabled={regenerating}
          onClick={handleRegenerate}
        >
          重新生成
          <kbd>⌘R</kbd>
        </Button>

        {/* <Button
          type="primary"
          className="df-command-export"
          icon={<RocketOutlined />}
          onClick={handleExport}
        >
          极速压测导出
        </Button> */}

        <Button type="text" className="df-command-button">
          DDL 逆向
        </Button>

        {/* <span className="df-saved">Saved</span> */}
        <Button type="text" className="df-command-button" onClick={onSaveSchema}>
          保存
        </Button>

        <span className="df-throughput">
          {throughput > 0 ? `${throughput.toLocaleString()} rec/s` : "Ready"}
        </span>
      </div>
    </header>
  );
}
