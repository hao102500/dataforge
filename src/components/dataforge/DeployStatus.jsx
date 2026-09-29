import { useEffect, useState } from "react";

import { getLatestDeploy } from "@/api/github";

import "./DeployStatus.css";

const POLL_TIME = 5000;

export default function DeployStatus() {
  const [deploy, setDeploy] = useState(null);

  useEffect(() => {
    let timer = null;

    let destroyed = false;

    async function load() {
      try {
        const data = await getLatestDeploy();

        if (destroyed) {
          return;
        }

        setDeploy(data || null);

        /**
         * 没有数据
         * 或正在部署
         * 继续轮询
         */
        if (
          !data ||
          data.status === "queued" ||
          data.status === "in_progress"
        ) {
          timer = setTimeout(load, POLL_TIME);
        }
      } catch (error) {
        console.error("获取部署状态失败", error);

        timer = setTimeout(load, POLL_TIME);
      }
    }

    load();

    return () => {
      destroyed = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  /**
   * 当前状态
   */
  const deployStatus = !deploy
    ? "waiting"
    : deploy.status === "queued"
      ? "queued"
      : deploy.status === "in_progress"
        ? "building"
        : deploy.status === "completed" && deploy.conclusion === "success"
          ? "success"
          : "failed";

  const statusMap = {
    waiting: "⚪ Waiting",

    queued: "🟡 Queued",

    building: "🟡 Building",

    success: "🟢 Production",

    failed: "🔴 Failed",
  };

  return (
    <div className="df-deploy-status">
      {/* 状态灯 */}

      <span className={["df-deploy-dot", deployStatus].join(" ")} />

      <span className="deploy-title">🚀 Deploy</span>

      <span className={`deploy-${deployStatus}`}>
        {statusMap[deployStatus]}
      </span>

      {deploy?.head_branch && (
        <span className="deploy-branch">{deploy.head_branch}</span>
      )}

      {deploy?.run_number && (
        <span className="deploy-run">#{deploy.run_number}</span>
      )}
    </div>
  );
}
