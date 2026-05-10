import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageIcon, MessageSquareReply } from "lucide-react";
import CommunityLayout from "../../components/community/CommunityLayout";
import InquiryStatusBadge from "../../components/community/InquiryStatusBadge";
import InquiryDetailModal from "../../components/community/InquiryDetailModal";
import InquiryAnswerModal from "../../components/community/InquiryAnswerModal";
import { useAuthStore } from "@/store/authStore";
import { formatDate, getCategoryName } from "../../utils/communityUtils";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaEmptyState,
} from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";

const pageSize = 10;

const InquiryAdmin = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useI18n();
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const loadAllInquiries = useCallback(async (page) => {
    try {
      const response = await fetch(`/api/community/inquiry?page=${page}&size=${pageSize}`);

      if (!response.ok) {
        setInquiries([]);
        return;
      }

      const data = await response.json();
      setInquiries(data.content || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.totalPages || 0);
    } catch {
      setInquiries([]);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      Promise.resolve().then(() => loadAllInquiries(1));
    }
  }, [isAdmin, loadAllInquiries]);

  const handleTitleClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  };

  const handleAnswerClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsAnswerModalOpen(true);
  };

  const handleAnswerSubmit = async (communityId, answerContent) => {
    const isUpdate = selectedInquiry?.answerContent;

    try {
      const response = await fetch("/api/community/inquiry/answer", {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          communityId,
          answerContent,
        }),
      });

      if (response.ok) {
        setIsAnswerModalOpen(false);
        loadAllInquiries(currentPage);
      } else {
        alert("답변 처리에 실패했습니다.");
      }
    } catch {
      alert("답변 처리 중 오류가 발생했습니다.");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    loadAllInquiries(page);
  };

  if (!isAdmin) {
    return (
      <CommunityLayout>
        <MoaEmptyState
          title={t("community.adminOnly")}
          action={
            <MoaButton onClick={() => navigate("/community/inquiry")}>
              {t("community.inquiry.create")}
            </MoaButton>
          }
        />
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--theme-text)]">문의 관리</h2>
          <p className="mt-2 text-sm text-[var(--theme-text-muted)]">
            접수된 1:1 문의를 확인하고 답변을 등록합니다.
          </p>
        </div>

        <MoaCard className="overflow-hidden">
          <div className="hidden grid-cols-[72px_120px_minmax(0,1fr)_140px_120px_120px_100px] gap-4 border-b border-[var(--theme-border-light)] bg-[var(--theme-surface-muted)] px-5 py-3 text-sm font-bold text-[var(--theme-text-muted)] lg:grid">
            <div className="text-center">번호</div>
            <div className="text-center">카테고리</div>
            <div>제목</div>
            <div className="text-center">작성자</div>
            <div className="text-center">작성일</div>
            <div className="text-center">상태</div>
            <div className="text-center">관리</div>
          </div>

          {inquiries.length === 0 ? (
            <MoaEmptyState title={t("community.inquiry.empty")} className="m-5" />
          ) : (
            inquiries.map((inquiry, index) => (
              <div
                key={inquiry.communityId}
                onClick={() => handleTitleClick(inquiry)}
                className="grid cursor-pointer gap-3 border-b border-[var(--theme-border-light)] px-5 py-4 text-sm transition hover:bg-[var(--theme-surface-muted)] last:border-b-0 lg:grid-cols-[72px_120px_minmax(0,1fr)_140px_120px_120px_100px] lg:items-center lg:gap-4"
              >
                <div className="font-semibold text-[var(--theme-text-muted)] lg:text-center">
                  {(currentPage - 1) * pageSize + index + 1}
                </div>
                <div className="lg:flex lg:justify-center">
                  <MoaBadge tone="primary">{getCategoryName(inquiry.communityCodeId)}</MoaBadge>
                </div>
                <div className="flex min-w-0 items-center gap-2 font-bold text-[var(--theme-text)]">
                  <span className="truncate">{inquiry.title}</span>
                  {inquiry.fileOriginal && (
                    <ImageIcon className="h-4 w-4 flex-shrink-0 text-[var(--theme-text-muted)]" />
                  )}
                </div>
                <div className="truncate font-semibold text-[var(--theme-text-muted)] lg:text-center">
                  {inquiry.userId}
                </div>
                <div className="font-semibold text-[var(--theme-text-muted)] lg:text-center">
                  {formatDate(inquiry.createdAt)}
                </div>
                <div className="lg:flex lg:justify-center">
                  <InquiryStatusBadge status={inquiry.answerStatus} />
                </div>
                <div className="lg:text-center">
                  <MoaButton
                    size="sm"
                    variant={inquiry.answerStatus === "답변완료" ? "secondary" : "primary"}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAnswerClick(inquiry);
                    }}
                  >
                    <MessageSquareReply className="h-4 w-4" />
                    {inquiry.answerStatus === "답변완료" ? "수정" : "답변"}
                  </MoaButton>
                </div>
              </div>
            ))
          )}

          {totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-[var(--theme-border-light)] px-5 py-4">
              <MoaButton
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {t("common.prev")}
              </MoaButton>
              <span className="text-sm font-semibold text-[var(--theme-text-muted)]">
                {currentPage} / {Math.max(totalPages, 1)}
              </span>
              <MoaButton
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {t("common.next")}
              </MoaButton>
            </div>
          )}
        </MoaCard>
      </div>

      <InquiryDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        inquiry={selectedInquiry}
      />

      <InquiryAnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => setIsAnswerModalOpen(false)}
        inquiry={selectedInquiry}
        onAnswerSubmit={handleAnswerSubmit}
      />
    </CommunityLayout>
  );
};

export default InquiryAdmin;
