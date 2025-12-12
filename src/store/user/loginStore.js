import { create } from "zustand";

console.log("🔥 loginStore loaded");
export const useLoginStore = create((set) => ({
  email: "",
  password: "",
  remember: false,
  otpRequired: false,
  otpModalOpen: false,
  otpCode: "",
  otpToken: null,

  setField: (key, value) => set({ [key]: value }),

  resetOtp: () =>
    set({
      otpRequired: false,
      otpModalOpen: false,
      otpCode: "",
      otpToken: null,
    }),
}));
