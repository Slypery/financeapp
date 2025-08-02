import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


const useMeta = create(persist(
	(set) => ({
		meta: {},
		setMeta: (newMeta) => set({ meta: newMeta }),
		updateMeta: (key, value) => {
			set((state) => ({ meta: { ...state.meta, [key]: value } }));
		},
	}),
	{
		name: 'meta-storage',
		storage: createJSONStorage(() => sessionStorage)
	}
));

export default useMeta;