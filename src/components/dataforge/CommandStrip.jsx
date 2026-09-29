import { useState, useRef, useEffect } from "react";

import { Button } from "antd";

import { RocketOutlined } from "@ant-design/icons";

import { batches } from "@/constants/batch";

import CommandStatus from "./CommandStatus";

// deploy status
import DeployStatus from "./DeployStatus";



export default function CommandStrip({
  batch = 1000,

  onBatchChange,

  onRegenerate,
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
        <span className="df-command-status" />

        <div className="df-command-title">
          <strong>员工薪资与档案</strong>

          {/* <span>HR Staff Master</span> */}
        </div>

        {/* <CommandStatus /> */}
        <DeployStatus />

        <span className="df-version">v2.4.1</span>

        <span className="df-command-meta">10 字段</span>

        <span className="df-command-meta">引用模板：企业人事 / 代发薪资</span>
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
          type="primary"
          className="df-command-button"
          disabled={regenerating}
          onClick={handleRegenerate}
        >
          重新生成
          <kbd>⌘R</kbd>
        </Button>

        <Button
          type="primary"
          className="df-command-export"
          icon={<RocketOutlined />}
          onClick={handleExport}
        >
          极速压测导出
        </Button>

        {/* <Button type="text" className="df-command-button">
          DDL 逆向
        </Button> */}

        

        
      </div>
    </header>
  );
}
