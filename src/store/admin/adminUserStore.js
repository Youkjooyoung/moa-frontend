import { create } from "zustand";

export const useAdminUserStore = create((set) => ({
  users: [],
  totalCount: 0,
  totalPages: 1,

  page: 1,
  size: 10,
  sort: "regDate,desc",

  filters: {
    q: "",
    status: "ALL",
    joinStart: "",
    joinEnd: "",
  },

  loading: false,
  error: null,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  setPage: (value) => set({ page: value }),
  setSize: (value) => set({ size: value }),
  setSort: (value) => set({ sort: value }),

  setData: (data) =>
    set({
      users: data.list,
      totalCount: data.totalCount,
      totalPages: data.totalPages,
    }),

  setLoading: (value) => set({ loading: value }),
  setError: (value) => set({ error: value }),

  resetFilters: () =>
    set({
      filters: {
        q: "",
        status: "ALL",
        joinStart: "",
        joinEnd: "",
      },
      page: 1,
    }),
}));
