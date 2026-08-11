const { chromium } = require("playwright");
const { spawn } = require("child_process");
const https = require("https");
const path = require("path");

const VITE_CLI = path.join(__dirname, "..", "node_modules", "vite", "bin", "vite.js");

const HOST = "127.0.0.1";
const PORT = process.env.SMOKE_PORT || "4175";
const BASE_URL = `https://${HOST}:${PORT}`;

const TEST_USER = {
  userId: "smoke-user@moa.test",
  email: "smoke-user@moa.test",
  nickname: "Smoke User",
  role: "USER",
  otpEnabled: false,
};

const TEST_ADMIN = {
  userId: "smoke-admin@moa.test",
  email: "smoke-admin@moa.test",
  nickname: "Smoke Admin",
  role: "ADMIN",
  otpEnabled: false,
};

const TEST_PRODUCT = {
  productId: 101,
  productName: "Smoke Premium",
  categoryId: 1,
  categoryName: "OTT",
  price: 12900,
  image: "",
  description: "Smoke test product",
  productStatus: "ACTIVE",
};

const createApiResponse = (data) =>
  JSON.stringify({ success: true, data, error: null });

const createTokenResponse = () =>
  createApiResponse({
    accessToken: "smoke-access-token",
    accessTokenExpiresIn: 3600,
  });

const createAdminUsersResponse = () =>
  createApiResponse({
    list: [
      {
        userId: TEST_USER.userId,
        nickname: TEST_USER.nickname,
        status: "ACTIVE",
        blacklisted: false,
        lastLoginDate: "2026-06-19T10:20:00",
        regDate: "2026-06-01T09:00:00",
      },
      {
        userId: TEST_ADMIN.userId,
        nickname: TEST_ADMIN.nickname,
        status: "ACTIVE",
        blacklisted: false,
        lastLoginDate: "2026-06-19T11:00:00",
        regDate: "2026-06-02T09:00:00",
      },
    ],
    totalCount: 2,
    totalPages: 1,
    size: 10,
  });

const createPushTemplatesResponse = () =>
  JSON.stringify([
    {
      pushCodeId: 1,
      codeName: "SMOKE_NOTICE",
      titleTemplate: "Smoke notice",
      contentTemplate: "Smoke push content",
      createdAt: "2026-06-19T12:00:00",
    },
  ]);

function startViteServer() {
  const child = spawn(process.execPath, [VITE_CLI, "preview", "--host", HOST, "--port", PORT, "--strictPort", "--configLoader", "runner"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      BROWSER: "none",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  child.stdout.on("data", (data) => {
    output += data.toString();
  });
  child.stderr.on("data", (data) => {
    output += data.toString();
  });

  child.output = () => output;
  return child;
}

async function waitForServer(timeoutMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const request = https.get(BASE_URL, { rejectUnauthorized: false }, (response) => {
          response.resume();
          if (response.statusCode && response.statusCode < 500) {
            resolve();
          } else {
            reject(new Error(`Unexpected status: ${response.statusCode}`));
          }
        });
        request.on("error", reject);
        request.setTimeout(1000, () => {
          request.destroy(new Error("Server poll timed out"));
        });
      });
      return;
    } catch {
      // Keep polling until Vite is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Vite smoke server did not start within ${timeoutMs}ms`);
}

async function withPage(run, options = {}) {
  const user = options.user || TEST_USER;
  let sessionAvailable = options.authenticated !== false;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  await context.addInitScript(() => {
    window.EventSource = class SmokeEventSource {
      constructor() {
        this.readyState = 1;
      }
      addEventListener() {}
      removeEventListener() {}
      close() {
        this.readyState = 2;
      }
    };
  });

  await context.route("**/api/users/me", (route) => {
    if (!sessionAvailable) {
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          data: null,
          error: { code: "UNAUTHORIZED", message: "Smoke unauthenticated" },
        }),
      });
      return;
    }

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: createApiResponse(user),
    });
  });

  await context.route("**/api/auth/login**", (route) => {
    const isOtpVerify = route.request().url().includes("/otp-verify");
    if (isOtpVerify) sessionAvailable = true;
    const body = isOtpVerify
      ? createTokenResponse()
      : createApiResponse({ otpRequired: true, otpToken: "smoke-otp-token" });

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body,
    });
  });

  await context.route("**/api/admin/users**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: createAdminUsersResponse(),
    });
  });

  await context.route("**/api/push/unread-count", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: createApiResponse(0),
    });
  });

  await context.route("**/api/push/admin/codes**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: createPushTemplatesResponse(),
    });
  });

  await context.route("**/api/push/admin/history**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        content: [],
        page: 1,
        totalPages: 1,
        total: 0,
      }),
    });
  });

  await context.route("**/api/push/admin/search**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([TEST_USER]),
    });
  });

  await context.route("**/api/product/101", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: TEST_PRODUCT, error: null }),
    });
  });

  await context.route("**/api/product", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [TEST_PRODUCT], error: null }),
    });
  });

  await context.route("**/api/product/categorie", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [{ categoryId: 1, categoryName: "OTT" }],
        error: null,
      }),
    });
  });

  await context.route("**/api/subscription", (route) => {
    const body = options.subscriptionSuccess
      ? { success: true, data: null, error: null }
      : {
          success: false,
          data: null,
          error: { code: "SUBSCRIPTION_FAILED", message: "Smoke subscription failed" },
        };

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  const page = await context.newPage();
  const dialogs = [];
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.accept();
  });

  try {
    await run(page, dialogs);
  } finally {
    await browser.close();
  }
}

async function runSuccessFlow() {
  await withPage(
    async (page) => {
      await page.goto(`${BASE_URL}/product/101`);
      await page.getByText(TEST_PRODUCT.productName).waitFor();
      await page.getByTestId("product-subscribe-link").click();
      await page.getByTestId("subscription-add-page").waitFor();
      await page.getByTestId("subscription-open-confirm").click();
      await page.getByTestId("subscription-confirm-submit").click();
      await page.waitForURL("**/subscriptions", { timeout: 10000 });
    },
    { subscriptionSuccess: true }
  );
}

async function runFailureFlow() {
  await withPage(
    async (page, dialogs) => {
      await page.goto(`${BASE_URL}/subscription/add/101?startDate=2026-06-19`);
      try {
        await page.getByTestId("subscription-add-page").waitFor({ timeout: 10000 });
      } catch (error) {
        throw new Error(`Subscription failure page did not render; current URL is ${page.url()}; ${error.message}`);
      }
      await page.getByTestId("subscription-open-confirm").click();
      await page.getByTestId("subscription-confirm-submit").click();
      await page.waitForFunction(
        () => window.location.pathname.includes("/subscription/add/101"),
        null,
        { timeout: 10000 }
      );

      if (!dialogs.some((message) => message.includes("Smoke subscription failed"))) {
        throw new Error("Expected failure alert was not shown");
      }
    },
    { subscriptionSuccess: false }
  );
}

async function runLoginOtpFlow() {
  await withPage(
    async (page) => {
      await page.goto(`${BASE_URL}/login`);
      await page.locator("#loginEmail").fill(TEST_USER.email);
      await page.locator("#loginPassword").fill("SmokePassword1!");
      await page.locator("#btnLogin").click();
      await page.getByTestId("login-otp-dialog").waitFor();
      await page.getByTestId("login-otp-input").fill("123456");
      const otpResponse = page
        .waitForResponse((response) => response.url().includes("/api/auth/login/otp-verify"), {
          timeout: 5000,
        })
        .catch(() => null);
      await page.getByTestId("login-otp-confirm").click();
      const response = await otpResponse;

      if (!response) {
        throw new Error(`OTP verify request was not sent; current URL is ${page.url()}`);
      }

      try {
        await page.waitForFunction(() => window.location.pathname === "/mypage", null, {
          timeout: 10000,
        });
      } catch (error) {
        throw new Error(
          `OTP flow did not navigate home; current URL is ${page.url()}; ${error.message}`
        );
      }

      const persistedAuth = await page.evaluate(() => window.localStorage.getItem("auth-storage"));
      if (persistedAuth !== null) {
        throw new Error("Authentication tokens were persisted to localStorage");
      }
    },
    { authenticated: false }
  );
}

async function runAccountVerificationFlow() {
  await withPage(async (page) => {
    await page.goto(`${BASE_URL}/user/account-register`);
    await page.getByTestId("bank-verification-page").waitFor();
    await page.getByPlaceholder("숫자만 입력").waitFor();
  });
}

async function runAdminUserListFlow() {
  await withPage(
    async (page) => {
      await page.goto(`${BASE_URL}/admin/users`);
      await page.getByTestId("admin-user-list-page").waitFor();
      await page.getByText(TEST_USER.userId).waitFor();
    },
    { user: TEST_ADMIN }
  );
}

async function runAdminPushFlow() {
  await withPage(
    async (page) => {
      await page.goto(`${BASE_URL}/admin/users`);
      await page.getByTestId("notification-button").click();
      await page.getByTestId("admin-push-modal").waitFor();
      await page.getByText("SMOKE_NOTICE").waitFor();
    },
    { user: TEST_ADMIN }
  );
}

async function main() {
  const server = startViteServer();
  const stopServer = () => {
    if (!server.killed) {
      server.kill();
    }
  };

  process.on("exit", stopServer);
  process.on("SIGINT", () => {
    stopServer();
    process.exit(130);
  });

  try {
    await waitForServer();
    await runSuccessFlow();
    await runFailureFlow();
    await runLoginOtpFlow();
    await runAccountVerificationFlow();
    await runAdminUserListFlow();
    await runAdminPushFlow();
    console.log("Smoke tests passed: subscription, login OTP, account verification, admin users, admin push");
  } catch (error) {
    console.error(error);
    console.error(server.output());
    process.exitCode = 1;
  } finally {
    stopServer();
  }
}

main();
