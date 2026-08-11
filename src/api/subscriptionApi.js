import httpClient from "@/api/httpClient";

export const unwrapApiData = (response) => {
  if (!response?.success) {
    throw new Error(response?.error?.message || "요청을 처리하지 못했습니다.");
  }
  return response.data;
};

export const getMySubscriptions = async () =>
  unwrapApiData(await httpClient.get("/subscription")) || [];

export const getSubscription = async (subscriptionId) =>
  unwrapApiData(await httpClient.get(`/subscription/${subscriptionId}`));

export const createSubscription = async (request) =>
  unwrapApiData(await httpClient.post("/subscription", request));

