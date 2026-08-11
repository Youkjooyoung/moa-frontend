import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SocialLoginButtons } from "./SocialLoginButtons";

describe("SocialLoginButtons", () => {
  it("renders accessible Kakao and Google login actions", () => {
    render(
      <SocialLoginButtons
        onKakao={vi.fn()}
        onGoogle={vi.fn()}
        loginLoading={false}
      />
    );

    expect(screen.getByRole("button", { name: "카카오 로그인" }).disabled).toBe(false);
    expect(screen.getByRole("button", { name: /Google/ }).disabled).toBe(false);
  });

  it("disables both social login actions while loading", () => {
    render(
      <SocialLoginButtons
        onKakao={vi.fn()}
        onGoogle={vi.fn()}
        loginLoading
      />
    );

    expect(screen.getByRole("button", { name: "카카오 로그인" }).disabled).toBe(true);
    expect(screen.getByRole("button", { name: /Google/ }).disabled).toBe(true);
  });
});
