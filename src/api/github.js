import axios from "axios";

const github = axios.create({
  baseURL: "https://api.github.com",
  timeout: 5000,
});

const OWNER = "hao102500";
const REPO = "dataforge";

/**
 * 获取最新部署
 */
export async function getLatestDeploy() {
  const res = await github.get(`/repos/${OWNER}/${REPO}/actions/runs`, {
    params: {
      per_page: 1,
    },
  });

  return res.data.workflow_runs[0];
}
