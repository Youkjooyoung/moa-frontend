import httpClient from "./httpClient";

export const requestVerification = async (bankCode, accountNum, accountHolder) => {
  try {
    const apiResponse = await httpClient.post("/bank-account/verify-request", {
      bankCode,
      accountNum,
      accountHolder,
    });
    return apiResponse.data || apiResponse;
  } catch (error) {
    console.error("Failed to request bank account verification:", error);
    throw error;
  }
};

export const verifyAndRegister = async (bankTranId, verifyCode) => {
  try {
    const apiResponse = await httpClient.post("/bank-account/verify", {
      bankTranId,
      verifyCode,
    });
    return apiResponse.data || apiResponse;
  } catch (error) {
    console.error("Failed to verify bank account code:", error);
    throw error;
  }
};

export const getAccount = async () => {
  try {
    const apiResponse = await httpClient.get("/bank-account");
    return apiResponse.data || apiResponse;
  } catch (error) {
    console.error("Failed to fetch bank account:", error);
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const apiResponse = await httpClient.delete("/bank-account");
    return apiResponse.data || apiResponse;
  } catch (error) {
    console.error("Failed to delete bank account:", error);
    throw error;
  }
};

export const changeAccount = async (bankCode, accountNum, accountHolder) => {
  try {
    const apiResponse = await httpClient.post("/bank-account/change", {
      bankCode,
      accountNum,
      accountHolder,
    });
    return apiResponse.data || apiResponse;
  } catch (error) {
    console.error("Failed to change bank account:", error);
    throw error;
  }
};

export const BANK_CODES = [
  { code: "088", name: "\uc2e0\ud55c\uc740\ud589" },
  { code: "004", name: "KB\uad6d\ubbfc\uc740\ud589" },
  { code: "020", name: "\uc6b0\ub9ac\uc740\ud589" },
  { code: "081", name: "\ud558\ub098\uc740\ud589" },
  { code: "011", name: "NH\ub18d\ud611\uc740\ud589" },
  { code: "003", name: "IBK\uae30\uc5c5\uc740\ud589" },
  { code: "023", name: "SC\uc81c\uc77c\uc740\ud589" },
  { code: "089", name: "\ucf00\uc774\ubc45\ud06c" },
  { code: "090", name: "\uce74\uce74\uc624\ubc45\ud06c" },
  { code: "092", name: "\ud1a0\uc2a4\ubc45\ud06c" },
  { code: "071", name: "\uc6b0\uccb4\uad6d" },
  { code: "045", name: "\uc0c8\ub9c8\uc744\uae08\uace0" },
  { code: "048", name: "\uc2e0\ud611" },
];
