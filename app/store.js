import create from 'zustand';

const useStore = create((set) => ({
  tabs: [],
  addTab: (tab) => set((state) => {
    const newTabs = [...state.tabs, tab].slice(-3);
    return { tabs: newTabs };
  }),
  removeTab: (index) => set((state) => ({
    tabs: state.tabs.filter((_, i) => i !== index)
  })),
  clearTabs: () => set({ tabs: [] }),
}));

export default useStore;