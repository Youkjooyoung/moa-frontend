import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommunityLayout from "../../components/community/CommunityLayout";
import NoticeForm from "../../components/community/NoticeForm";
import { useAuthStore } from "@/store/authStore";
import { MoaButton, MoaCard, MoaEmptyState, MoaPageHeader } from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";

const UpdateNotice = () => {
  const navigate = useNavigate();
  const params = useParams();
  const noticeId = params.id || params.communityId;
  const { user } = useAuthStore();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    communityCodeId: 10,
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";
  const userId = user?.userId || "admin@moa.com";

  useEffect(() => {
    const loadNoticeDetail = async () => {
      if (!noticeId || noticeId === "undefined") {
        navigate("/community/notice");
        return;
      }

      try {
        const response = await fetch(`/api/community/notice/${noticeId}`);

        if (!response.ok) {
          alert(t("community.notice.notFound"));
          navigate("/community/notice");
          return;
        }

        const data = await response.json();
        setFormData({
          communityCodeId: data.communityCodeId,
          title: data.title,
          content: data.content,
        });
      } catch {
        alert(t("community.notice.loadError"));
        navigate("/community/notice");
      } finally {
        setIsLoading(false);
      }
    };

    loadNoticeDetail();
  }, [navigate, noticeId, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert(t("community.faq.validation"));
      return;
    }

    try {
      const response = await fetch(`/api/community/notice/${noticeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      });

      if (response.ok) {
        navigate(`/community/notice/${noticeId}`);
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch {
      alert("수정 중 오류가 발생했습니다.");
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

  if (isLoading) {
    return (
      <CommunityLayout>
        <MoaEmptyState title={t("community.loading")} />
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="mx-auto max-w-3xl">
        <MoaPageHeader
          onBack={() => navigate(`/community/notice/${noticeId}`)}
          eyebrow={t("community.notice.title")}
          title={t("community.notice.editTitle")}
        />
        <MoaCard className="p-5 sm:p-6">
          <NoticeForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitText={t("community.form.update")}
            cancelPath={`/community/notice/${noticeId}`}
          />
        </MoaCard>
      </div>
    </CommunityLayout>
  );
};

export default UpdateNotice;
