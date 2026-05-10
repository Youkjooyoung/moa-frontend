import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommunityLayout from "../../components/community/CommunityLayout";
import NoticeForm from "../../components/community/NoticeForm";
import { useAuthStore } from "@/store/authStore";
import { MoaButton, MoaCard, MoaEmptyState, MoaPageHeader } from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";

const AddNotice = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    communityCodeId: 10,
    title: "",
    content: "",
  });

  const isAdmin = user?.role === "ADMIN";
  const userId = user?.userId || "admin@moa.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert(t("community.faq.validation"));
      return;
    }

    try {
      const response = await fetch("/api/community/notice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      if (response.ok) {
        navigate("/community/notice");
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
            <MoaButton onClick={() => navigate("/community/notice")}>
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
          onBack={() => navigate("/community/notice")}
          eyebrow={t("community.notice.title")}
          title={t("community.notice.addTitle")}
        />
        <MoaCard className="p-5 sm:p-6">
          <NoticeForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitText={t("community.form.submit")}
            cancelPath="/community/notice"
          />
        </MoaCard>
      </div>
    </CommunityLayout>
  );
};

export default AddNotice;
