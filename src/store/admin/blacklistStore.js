import { create } from "zustand";

export const useBlacklistStore = create((set) => ({
  list: [],
  loading: false,
  page: 1,
  size: 10,
  totalCount: 0,
  reason: "",
  targetUserId: "",

  setLoading: (value) => set({ loading: value }),
  setPage: (value) => set({ page: value }),
  setSize: (value) => set({ size: value }),
  setReason: (value) => set({ reason: value }),
  setTargetUserId: (value) => set({ targetUserId: value }),

  setList: (items, count) =>
    set({
      list: items,
      totalCount: count,
    }),

  reset: () =>
    set({
      page: 1,
      size: 10,
      reason: "",
      targetUserId: "",
    }),
}));
