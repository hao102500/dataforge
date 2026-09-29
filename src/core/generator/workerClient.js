/**
 * Worker 数据生成客户端
 *
 * 主线程调用
 * Worker负责大量数据生成
 */

export function generateByWorker(fields, count, onProgress) {
  return new Promise((resolve, reject) => {
    /**
     * 创建 Worker
     */
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });

    /**
     * 接收 Worker 消息
     */
    worker.onmessage = function (event) {
      const data = event.data || {};

      /**
       * 生成进度
       */
      if (data.type === "progress") {
        onProgress?.({
          progress: data.progress,

          current: data.current,

          total: data.total,
        });

        return;
      }

      /**
       * 完成
       */
      if (data.type === "complete") {
        worker.terminate();

        resolve(data.data);

        return;
      }

      /**
       * 错误
       */
      if (data.type === "error") {
        worker.terminate();

        reject(new Error(data.message));
      }
    };

    /**
     * Worker异常
     */
    worker.onerror = function (error) {
      worker.terminate();

      reject(error);
    };

    /**
     * 发送生成任务
     */
    worker.postMessage({
      fields,

      count,
    });
  });
}
