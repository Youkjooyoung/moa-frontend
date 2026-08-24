import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaField,
  MoaInput,
  MoaPageHeader,
  MoaStatusState,
} from "./MoaPage";

describe("Moa shared UI", () => {
  it("renders page header actions and localised back text", () => {
    render(
      <MoaPageHeader
        eyebrow="관리"
        title="정산 관리"
        description="정산 상태를 확인합니다."
        onBack={vi.fn()}
        action={<MoaButton>저장</MoaButton>}
      />
    );

    expect(screen.getByRole("button", { name: "뒤로가기" })).not.toBeNull();
    expect(screen.getByRole("heading", { name: "정산 관리" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "저장" })).not.toBeNull();
  });

  it("renders form, badge, card, and empty state primitives", () => {
    render(
      <MoaCard>
        <MoaBadge tone="success">정상</MoaBadge>
        <MoaField label="검색어" hint="서비스명을 입력하세요.">
          <MoaInput placeholder="Netflix" />
        </MoaField>
        <MoaEmptyState title="결과 없음" description="조건을 바꿔 다시 검색하세요." />
      </MoaCard>
    );

    expect(screen.getByText("정상")).not.toBeNull();
    expect(screen.getByPlaceholderText("Netflix")).not.toBeNull();
    expect(screen.getByText("결과 없음")).not.toBeNull();
  });

  it("announces loading and error states to assistive technology", () => {
    const { rerender } = render(<MoaStatusState title="불러오는 중" />);
    expect(screen.getByRole("status")).not.toBeNull();

    rerender(<MoaStatusState tone="error" title="불러오지 못했습니다" />);
    expect(screen.getByRole("alert")).not.toBeNull();
  });
});
