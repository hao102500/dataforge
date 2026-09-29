/**
 * GitHub Actions 状态映射
 *
 * status:
 * queued
 * in_progress
 * completed
 *
 * conclusion:
 * success
 * failure
 * cancelled
 * skipped
 */

export const deployStatusMap = {
  waiting: {
    text: "等待部署",
    className: "waiting",
  },

  queued: {
    text: "排队中",
    className: "queued",
  },

  building: {
    text: "构建中",
    className: "building",
  },

  success: {
    text: "部署成功",
    className: "success",
  },

  failure: {
    text: "构建失败",
    className: "failed",
  },

  cancelled: {
    text: "已取消",
    className: "failed",
  },

  skipped: {
    text: "已跳过",
    className: "waiting",
  },

  checking: {
    text: "检查中",
    className: "waiting",
  },
};

/**
 * GitHub Actions 状态转换
 */
export function getDeployStatus(deploy) {
  /**
   * 没有记录
   */
  if (!deploy) {
    return deployStatusMap.waiting;
  }

  /**
   * 等待 Runner
   */
  if (deploy.status === "queued") {
    return deployStatusMap.queued;
  }

  /**
   * 执行中
   */
  if (deploy.status === "in_progress") {
    return deployStatusMap.building;
  }

  /**
   * 完成
   */
  if (deploy.status === "completed") {
    switch (deploy.conclusion) {
      case "success":
        return deployStatusMap.success;

      case "failure":
        return deployStatusMap.failure;

      case "cancelled":
        return deployStatusMap.cancelled;

      case "skipped":
        return deployStatusMap.skipped;

      default:
        return deployStatusMap.checking;
    }
  }

  return deployStatusMap.checking;
}
