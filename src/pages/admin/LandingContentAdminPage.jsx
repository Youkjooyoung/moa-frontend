import { Save, RotateCcw } from "lucide-react";
import {
  MoaButton,
  MoaCard,
  MoaField,
  MoaInput,
  MoaPage,
  MoaPageHeader,
  MoaTextarea,
} from "@/components/common/MoaPage";
import { useLandingEditorStore } from "@/features/landing/model/landingEditorStore";

const locales = [
  { id: "ko", label: "한국어" },
  { id: "en", label: "English" },
];

const textFields = [
  { name: "badge", label: "히어로 배지", type: "input" },
  { name: "title", label: "히어로 제목", type: "input" },
  { name: "description", label: "히어로 설명", type: "textarea" },
  { name: "primaryLabel", label: "기본 버튼", type: "input" },
  { name: "secondaryLabel", label: "보조 버튼", type: "input" },
  { name: "ctaTitle", label: "CTA 제목", type: "input" },
  { name: "ctaDescription", label: "CTA 설명", type: "textarea" },
  { name: "ctaButton", label: "CTA 버튼", type: "input" },
];

export default function LandingContentAdminPage() {
  const {
    localeContent,
    metricValues,
    productMaxItems,
    partyMaxItems,
    publishedAt,
    updateLocaleContent,
    updateMetricValue,
    updateSectionLimit,
    publish,
    reset,
  } = useLandingEditorStore();

  return (
    <MoaPage>
      <MoaPageHeader
        eyebrow="Low-code"
        title="랜딩 콘텐츠 관리"
        description="개발 배포 없이 메인 랜딩의 문구, 지표, 노출 개수를 조정합니다. 비워두면 기본 번역 문구가 사용됩니다."
        action={
          <div className="flex gap-2">
            <MoaButton variant="secondary" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              초기화
            </MoaButton>
            <MoaButton onClick={publish}>
              <Save className="h-4 w-4" />
              게시
            </MoaButton>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {locales.map((locale) => (
            <MoaCard key={locale.id} className="p-5 sm:p-6">
              <h2 className="mb-5 text-xl font-bold text-[var(--theme-text)]">
                {locale.label}
              </h2>
              <div className="grid gap-5">
                {textFields.map((field) => {
                  const value = localeContent[locale.id]?.[field.name] || "";
                  const Component = field.type === "textarea" ? MoaTextarea : MoaInput;

                  return (
                    <MoaField key={field.name} label={field.label}>
                      <Component
                        value={value}
                        rows={field.type === "textarea" ? 4 : undefined}
                        onChange={(event) =>
                          updateLocaleContent(locale.id, {
                            [field.name]: event.target.value,
                          })
                        }
                      />
                    </MoaField>
                  );
                })}
              </div>
            </MoaCard>
          ))}
        </div>

        <div className="space-y-6">
          <MoaCard className="p-5 sm:p-6">
            <h2 className="mb-5 text-xl font-bold text-[var(--theme-text)]">노출 설정</h2>
            <div className="space-y-5">
              {metricValues.map((value, index) => (
                <MoaField key={index} label={`상단 지표 ${index + 1}`}>
                  <MoaInput
                    value={value}
                    onChange={(event) => updateMetricValue(index, event.target.value)}
                  />
                </MoaField>
              ))}
              <MoaField label="상품 최대 노출 수">
                <MoaInput
                  type="number"
                  min="1"
                  max="12"
                  value={productMaxItems}
                  onChange={(event) => updateSectionLimit("productMaxItems", event.target.value)}
                />
              </MoaField>
              <MoaField label="파티 최대 노출 수">
                <MoaInput
                  type="number"
                  min="1"
                  max="12"
                  value={partyMaxItems}
                  onChange={(event) => updateSectionLimit("partyMaxItems", event.target.value)}
                />
              </MoaField>
            </div>
          </MoaCard>

          <MoaCard className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--theme-text)]">게시 상태</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--theme-text-muted)]">
              {publishedAt
                ? `마지막 게시: ${new Date(publishedAt).toLocaleString()}`
                : "아직 게시 기록이 없습니다."}
            </p>
            <p className="mt-4 text-xs leading-5 text-[var(--theme-text-muted)]">
              현재 버전은 브라우저 저장소 기반의 기본 Low-code 편집입니다. 운영 서버 반영용 DB 저장 API는 배포 전 백엔드 단계에서 연결하면 됩니다.
            </p>
          </MoaCard>
        </div>
      </div>
    </MoaPage>
  );
}
