import React from "react";

export default function StatusBar() {
  return (
    <footer className="df-status-bar">
      <div className="df-status-left">
        <span className="df-status-online" />

        <span>DataForge Engine v2.4.0</span>

        <span className="df-status-online-text">Online</span>
      </div>

      <div className="df-status-metrics">
        <span>RAM 24.2 MB</span>

        <span>GC 0.8ms</span>

        <span>Collision 0.000%</span>
      </div>

      <div className="df-status-shortcuts">
        <span>⌘R 重新生成</span>

        <span>⌘S 保存规则</span>

        <span>⌘K 资源搜索</span>
      </div>

      <div className="df-status-right">
        <strong>86,400 rec/s</strong>

        <span>UTF-8</span>
      </div>
    </footer>
  );
}
