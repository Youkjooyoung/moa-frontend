import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit3 } from "lucide-react";
import CommunityLayout from "../../components/community/CommunityLayout";
import { useAuthStore } from "@/store/authStore";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
  MoaPageHeader,
} from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";
import { formatLocalizedDate } from "@/utils/localeFormat";

const GetNotice = () => {
  const navigate = useNavigate();
  const params = useParams();
  const noticeId = params.id || params.communityId;
  const { user } = useAuthStore();
  const { locale, t } = useI18n();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const loadNotice = async () => {
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
        setNotice(data);
      } catch {
        alert(t("community.notice.loadError"));
        navigate("/community/notice");
      } finally {
        setLoading(false);
      }
    };

    loadNotice();
  }, [navigate, noticeId, t]);

  if (loading) {
    return (
      <CommunityLayout>
        <MoaEmptyState title={t("community.loading")} />
      </CommunityLayout>
    );
  }

  if (!notice) {
    return (
      <CommunityLayout>
        <MoaEmptyState title={t("community.notice.notFound")} />
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="mx-auto max-w-3xl">
        <MoaPageHeader
          onBack={() => navigate("/community/notice")}
          eyebrow={t("community.notice.title")}
          title={notice.title}
          action={
            isAdmin && (
              <MoaButton
                size="sm"
                onClick={() => navigate(`/community/notice/update/${noticeId}`)}
              >
                <Edit3 className="h-4 w-4" />
                {t("community.form.update")}
              </MoaButton>
            )
          }
        />

        <MoaCard className="overflow-hidden">
          <div className="flex flex-wrap gap-2 border-b border-[var(--theme-border-light)] px-6 py-5">
            <MoaBadge tone="primary">
              {t("community.notice.createdAt")}: {formatLocalizedDate(notice.createdAt, locale)}
            </MoaBadge>
            <MoaBadge>
              {t("community.notice.views")}: {notice.viewCount || 0}
            </MoaBadge>
          </div>

          <div className="min-h-80 whitespace-pre-wrap break-words px-6 py-8 text-base leading-8 text-[var(--theme-text)]">
            {notice.content}
          </div>

          <div className="flex justify-end border-t border-[var(--theme-border-light)] px-6 py-5">
            <MoaButton variant="secondary" onClick={() => navigate("/community/notice")}>
              {t("community.backToList")}
            </MoaButton>
          </div>
        </MoaCard>
      </div>
    </CommunityLayout>
  );
};

export default GetNotice;
