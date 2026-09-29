import { useEffect, useState } from "react";

import { getLatestDeploy } from "@/api/github";

export default function DeployStatus() {
  const [deploy, setDeploy] = useState(null);

  useEffect(() => {
    let timer = null;

    async function load() {
      try {
        const data = await getLatestDeploy();

        setDeploy(data);

        /**
         * 如果正在部署
         * 继续轮询
         */
        if (data?.status === "in_progress") {
          timer = setTimeout(
            load,

            5000,
          );
        }
      } catch (error) {
        console.error(
          "获取部署状态失败",

          error,
        );
      }
    }

    load();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  if (!deploy) {
    return null;
  }

  const isSuccess =
    deploy.status === "completed" && deploy.conclusion === "success";

  const isRunning = deploy.status === "in_progress";

  return (
    <div className="df-deploy-status">
      <span>🚀 Deploy</span>

      {isRunning && <span className="deploy-running">🟡 Building</span>}

      {isSuccess && <span className="deploy-success">🟢 Production</span>}

      {deploy.status === "completed" && deploy.conclusion !== "success" && (
        <span className="deploy-error">🔴 Failed</span>
      )}

      <span>{deploy.head_branch}</span>

      <span>#{deploy.run_number}</span>
    </div>
  );
}
