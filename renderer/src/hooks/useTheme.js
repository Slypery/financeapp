import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTheme = create(persist(
    (set) => ({
        theme: 'forest',
        setTheme: (theme) => set({theme: theme})
    })
))

export default useTheme;