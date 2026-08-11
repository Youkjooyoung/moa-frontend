import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaField,
  MoaInput,
  MoaPage,
  MoaPageHeader,
  MoaSelect,
  MoaTextarea,
} from "@/shared/ui/MoaPage";

const meta = {
  title: "MOA/Shared UI",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const FormSurface = {
  render: () => (
    <MoaPage className="bg-[var(--theme-bg)]">
      <MoaPageHeader
        eyebrow="운영"
        title="정산 요청 검토"
        description="공통 페이지, 카드, 입력 요소, 상태 배지를 한 화면에서 확인합니다."
        action={<MoaButton>변경 저장</MoaButton>}
      />
      <MoaCard className="grid gap-5 p-6 md:grid-cols-2">
        <MoaField label="서비스명" hint="구독 상품명을 입력합니다.">
          <MoaInput defaultValue="Netflix Premium" />
        </MoaField>
        <MoaField label="상태">
          <MoaSelect defaultValue="active">
            <option value="active">정상</option>
            <option value="pending">확인 필요</option>
          </MoaSelect>
        </MoaField>
        <MoaField label="운영 메모">
          <MoaTextarea rows={4} defaultValue="다음 정산일 전에 참여자 상태를 확인합니다." />
        </MoaField>
        <div className="flex items-start gap-2">
          <MoaBadge tone="success">정상</MoaBadge>
          <MoaBadge tone="warning">확인 필요</MoaBadge>
          <MoaBadge tone="danger">실패</MoaBadge>
        </div>
      </MoaCard>
    </MoaPage>
  ),
};

export const EmptyState = {
  render: () => (
    <MoaPage className="bg-[var(--theme-bg)]">
      <MoaEmptyState
        title="표시할 정산 내역이 없습니다"
        description="필터를 변경하거나 새 정산 주기가 시작된 뒤 다시 확인하세요."
        action={<MoaButton variant="secondary">필터 초기화</MoaButton>}
      />
    </MoaPage>
  ),
};
