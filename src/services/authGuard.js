import httpClient from "@/api/httpClient";

export async function requireLogin() {
  try {
    const res = await httpClient.get("/users/me");
    return res?.success === true;
  } catch (e) {
    return false;
  }
}
