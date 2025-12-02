import httpClient from "./httpClient";

export const fetchCurrentUser = () => httpClient.get("/users/me");

export const login = (data) =>
  httpClient.post("/users/login", {
    userId: data.userId,
    password: data.password,
  });

export const logout = () => httpClient.post("/users/logout");

export const checkCommon = (data) => httpClient.post("/users/check", data);

export const checkPasswordFormat = (password) =>
  httpClient.post("/users/checkPasswordFormat", { password });

export const checkPasswordConfirm = (password, passwordConfirm) =>
  httpClient.post("/users/checkPasswordConfirm", { password, passwordConfirm });

export const startPassAuth = () => httpClient.get("/users/pass/start");

export const verifyPassAuth = (data) =>
  httpClient.post("/users/pass/verify", data);

export const verifyEmail = (token) =>
  httpClient.get("/users/verify-email", { params: { token } });

export const startRestoreVerify = (userId) =>
  httpClient.post("/users/restore/start", { userId });

// import httpClient from "./httpClient";

// export const fetchCurrentUser = () => httpClient.get("/api/users/me");

// export const login = (data) =>
//   httpClient.post("/api/users/login", {
//     userId: data.userId,
//     password: data.password,
//   });

// export const logout = () => httpClient.post("/api/users/logout");

// export const checkCommon = (data) => httpClient.post("/api/users/check", data);

// export const checkPasswordFormat = (password) =>
//   httpClient.post("/api/users/checkPasswordFormat", { password });

// export const checkPasswordConfirm = (password, passwordConfirm) =>
//   httpClient.post("/api/users/checkPasswordConfirm", { password, passwordConfirm });

// export const startPassAuth = () => httpClient.get("/api/users/pass/start");

// export const verifyPassAuth = (data) =>
//   httpClient.post("/api/users/pass/verify", data);

// export const verifyEmail = (token) =>
//   httpClient.get("/api/users/verify-email", { params: { token } });

// export const startRestoreVerify = (userId) =>
//   httpClient.post("/api/users/restore/start", { userId });
