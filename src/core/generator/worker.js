import { generateRow } from "./index";

self.onmessage = function (event) {
  const data = event.data || {};

  const fields = data.fields || [];
  const count = Number(data.count) || 0;

  if (count <= 0) {
    self.postMessage({
      type: "complete",
      data: [],
    });

    return;
  }

  const result = new Array(count);

  const batchSize = 1000;

  /**
   * 当前这一次生成任务的唯一值集合。
   *
   * 注意：
   * 必须放在 for 循环外面。
   *
   * 不同字段分别进行去重。
   *
   * 例如：
   *
   * {
   *   phone: Set(...),
   *   idCard: Set(...),
   *   bankCard: Set(...),
   *   email: Set(...)
   * }
   */
  const usedValues = {};

  try {
    /**
     * 数据生成
     */
    for (let i = 0; i < count; i++) {
      /**
       * 传入 usedValues，
       * 保证整个生成任务中的 unique 生效。
       */
      result[i] = generateRow(fields, i, usedValues);

      /**
       * 生成进度
       */
      if ((i + 1) % batchSize === 0 || i === count - 1) {
        const progress = Math.floor(((i + 1) / count) * 100);

        self.postMessage({
          type: "progress",
          progress: progress,
          current: i + 1,
          total: count,
        });
      }
    }

    /**
     * ============================
     * 生成完成
     * ============================
     */
    self.postMessage({
      type: "complete",
      data: result,
    });
  } catch (error) {
    /**
     * ============================
     * 数据生成失败
     * ============================
     *
     * 例如：
     *
     * Enum：
     * 男
     * 女
     *
     * 要生成 100 条唯一数据
     *
     * 最终 index.js 会：
     *
     * throw new Error(...)
     *
     * 这里捕获后返回给主线程。
     */
    self.postMessage({
      type: "error",

      message: error && error.message ? error.message : "数据生成失败",
    });
  }
};
