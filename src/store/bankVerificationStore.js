import { create } from "zustand";

const initialFormData = {
  bankCode: "",
  bankName: "",
  accountNum: "",
  accountHolder: "",
};

const initialVerification = {
  bankTranId: null,
  maskedAccount: "",
  expiresAt: null,
  verifyCode: "",
  verificationType: "ONE_WON",
  remainingAttempts: 3,
};

const useBankVerificationStore = create((set, get) => ({
  step: "input",
  formData: initialFormData,
  verification: initialVerification,
  isLoading: false,
  error: null,
  showVirtualBankModal: false,

  setStep: (step) => set({ step }),
  nextStep: () => {
    const stepOrder = ["input", "processing", "verify", "complete"];
    const currentIndex = stepOrder.indexOf(get().step);
    if (currentIndex < stepOrder.length - 1) {
      set({ step: stepOrder[currentIndex + 1] });
    }
  },
  prevStep: () => {
    const stepOrder = ["input", "processing", "verify", "complete"];
    const currentIndex = stepOrder.indexOf(get().step);
    if (currentIndex > 0) {
      set({ step: stepOrder[currentIndex - 1] });
    }
  },
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setVerification: (data) =>
    set((state) => ({
      verification: { ...state.verification, ...data },
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  toggleVirtualBankModal: () =>
    set((state) => ({ showVirtualBankModal: !state.showVirtualBankModal })),
  openVirtualBankModal: () => set({ showVirtualBankModal: true }),
  closeVirtualBankModal: () => set({ showVirtualBankModal: false }),
  reset: () =>
    set({
      step: "input",
      formData: initialFormData,
      verification: initialVerification,
      isLoading: false,
      error: null,
      showVirtualBankModal: false,
    }),
  setVerificationSuccess: (response, targetStep = "verify") =>
    set({
      step: targetStep,
      verification: {
        bankTranId: response.bankTranId,
        maskedAccount: response.maskedAccount || "",
        expiresAt: response.expiresAt,
        verifyCode: response.verifyCode || response.printContent || "",
        verificationType: response.verificationType || "ONE_WON",
        remainingAttempts: 3,
      },
      error: null,
    }),
  decrementAttempts: () =>
    set((state) => ({
      verification: {
        ...state.verification,
        remainingAttempts: Math.max(0, state.verification.remainingAttempts - 1),
      },
    })),
}));

export default useBankVerificationStore;
