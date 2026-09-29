import { useEffect, useState } from "react";

import { getLatestDeploy } from "@/api/github";
import { getDeployStatus } from "@/config/deployStatusMap";
// css
import "./DeployStatus.css";

const POLL_TIME = 5000;

export default function DeployStatus() {
  const [deploy, setDeploy] = useState(null);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let timer = null;

    let destroyed = false;

    async function load() {
      try {
        const data = await getLatestDeploy();

        if (destroyed) {
          return;
        }

        /**
         * GitHub Actions 还没有生成记录
         */
        if (!data) {
          setDeploy(null);

          setChecking(true);

          timer = setTimeout(load, POLL_TIME);

          return;
        }

        setDeploy(data);

        setChecking(false);

        /**
         * queued / in_progress
         * 继续轮询
         */
        if (data.status === "queued" || data.status === "in_progress") {
          timer = setTimeout(load, POLL_TIME);
        }
      } catch (error) {
        console.error("获取部署状态失败", error);

        if (!destroyed) {
          setChecking(true);

          timer = setTimeout(load, POLL_TIME);
        }
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
   * 状态显示
   */
  function renderStatus() {
    /**
     * 没有 workflow
     */
    if (!deploy) {
      return (
        <>
          <span className="df-deploy-dot waiting"></span>
          <span className="deploy-checking">Waiting</span>
        </>
      );
    }

    /**
     * 排队等待 Runner
     */
    if (deploy.status === "queued") {
      return (
        <>
          <span className="df-deploy-dot queued"></span>
          <span className="deploy-running">Queued</span>
        </>
      );
    }

    /**
     * 正在执行
     */
    if (deploy.status === "in_progress") {
      return (
        <>
          <span className="df-deploy-dot building "></span>
          <span className="deploy-running">Building</span>
        </>
      );
    }

    /**
     * 成功
     */
    if (deploy.status === "completed" && deploy.conclusion === "success") {
      return (
        <>
          <span className="df-deploy-dot success"></span>
          <span className="deploy-success">Production-</span>
        </>
      );
    }

    /**
     * 失败
     */
    if (deploy.status === "completed" && deploy.conclusion !== "success") {
      return (
        <>
          <span className="df-deploy-dot failed"></span>
          <span className="deploy-error">Failed</span>
        </>
      );
    }

    return (
      <>
        <span className="df-deploy-dot waiting"></span>
        <span className="deploy-checking">Checking</span>
      </>
    );
  }

  /**
   * 状态
   */
  const status = getDeployStatus(deploy);

  console.log(deploy);
  

  return (
    <div className="df-deploy-status">
      
      {/* {renderStatus()} */}
      <span className={`df-deploy-dot ${status.className}`} />
      <span className="deploy-title">Deploy：</span>
      <span className={`deploy-${status.className}`}>{status.text}</span>
      <span className="df-command-meta">分支：{deploy?.head_branch}</span>
      <span className="df-command-meta">构建编号：{deploy?.run_number}</span>
    </div>
  );
}
