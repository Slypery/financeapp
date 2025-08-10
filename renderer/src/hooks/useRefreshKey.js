import { create } from "zustand";

const useRefreshKey = create(set => ({
  refreshKey: 0,
  triggerRefresh: () => set(state => ({ refreshKey: state.refreshKey + 1 })),
}));

export default useRefreshKey;