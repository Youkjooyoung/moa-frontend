import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommunityLayout from "../../components/community/CommunityLayout";
import { useAuthStore } from "@/store/authStore";
import {
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaField,
  MoaInput,
  MoaPageHeader,
  MoaSelect,
  MoaTextarea,
} from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";

const categoryOptions = [
  { value: "회원", key: "category.member" },
  { value: "결제", key: "category.payment" },
  { value: "구독", key: "category.subscription" },
  { value: "파티", key: "category.party" },
  { value: "정산", key: "category.settlement" },
  { value: "기타", key: "category.etc" },
];

const AddFaq = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useI18n();
  const [category, setCategory] = useState("회원");
  const [formData, setFormData] = useState({
    communityCodeId: 4,
    title: "",
    content: "",
  });

  const isAdmin = user?.role === "ADMIN";
  const userId = user?.userId || "admin@moa.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert(t("community.faq.validation"));
      return;
    }

    try {
      const response = await fetch("/api/community/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          title: `[${category}] ${formData.title}`,
          userId,
        }),
      });

      if (response.ok) {
        navigate("/community/faq");
      } else {
        alert("등록에 실패했습니다.");
      }
    } catch {
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  if (!isAdmin) {
    return (
      <CommunityLayout>
        <MoaEmptyState
          title={t("community.adminOnly")}
          action={
            <MoaButton onClick={() => navigate("/community/faq")}>
              {t("community.backToList")}
            </MoaButton>
          }
        />
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="mx-auto max-w-3xl">
        <MoaPageHeader
          onBack={() => navigate("/community/faq")}
          eyebrow={t("community.faq.title")}
          title={t("community.faq.addTitle")}
        />

        <MoaCard className="p-5 sm:p-6">
          <div className="space-y-6">
            <MoaField label={t("community.form.category")}>
              <MoaSelect value={category} onChange={(e) => setCategory(e.target.value)}>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.key)}
                  </option>
                ))}
              </MoaSelect>
            </MoaField>

            <MoaField label={t("community.form.question")}>
              <MoaInput
                name="title"
                type="text"
                placeholder={t("community.form.questionPlaceholder")}
                value={formData.title}
                onChange={handleChange}
              />
            </MoaField>

            <MoaField label={t("community.form.answer")}>
              <MoaTextarea
                name="content"
                placeholder={t("community.form.answerPlaceholder")}
                value={formData.content}
                onChange={handleChange}
                rows={10}
              />
            </MoaField>

            <div className="flex justify-end gap-3 pt-2">
              <MoaButton variant="secondary" onClick={() => navigate("/community/faq")}>
                {t("community.form.cancel")}
              </MoaButton>
              <MoaButton onClick={handleSubmit}>{t("community.form.submit")}</MoaButton>
            </div>
          </div>
        </MoaCard>
      </div>
    </CommunityLayout>
  );
};

export default AddFaq;
