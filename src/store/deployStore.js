import { create } from "zustand";
import { getLatestDeploy } from "@/api/github";

export const useDeployStore = create((set) => ({
  deploy: null,

  loading: false,

  /**
   * 获取部署状态
   */
  fetchDeploy: async () => {
    set({
      loading: true,
    });

    try {
      const data = await getLatestDeploy();

      set({
        deploy: data,

        loading: false,
      });
    } catch (e) {
      console.error(e);

      set({
        loading: false,
      });
    }
  },
}));
