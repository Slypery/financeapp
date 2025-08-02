import { create } from "zustand";

const useTransitonKey = create((set) => ({
    key: 1,
    incrementKey: () => set((state) => ({ key: state.key + 1 }))
}))

export default useTransitonKey;