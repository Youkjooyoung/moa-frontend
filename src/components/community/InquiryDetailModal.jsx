import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoaBadge, MoaCard } from "@/components/common/MoaPage";
import InquiryStatusBadge from "./InquiryStatusBadge";
import { formatDate, getCategoryName } from "../../utils/communityUtils";
import { useI18n } from "@/hooks/useI18n";

const InquiryDetailModal = ({ isOpen, onClose, inquiry }) => {
  const { t } = useI18n();

  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[82vh] max-w-2xl overflow-y-auto rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-0 text-[var(--theme-text)]">
        <DialogHeader className="border-b border-[var(--theme-border-light)] px-6 py-5">
          <DialogTitle className="text-xl font-bold">
            {t("community.inquiry.detail")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 py-6">
          <div className="flex flex-wrap items-center gap-2">
            <MoaBadge tone="primary">{getCategoryName(inquiry.communityCodeId)}</MoaBadge>
            <InquiryStatusBadge status={inquiry.answerStatus} />
            <span className="text-sm font-semibold text-[var(--theme-text-muted)]">
              {formatDate(inquiry.createdAt)}
            </span>
          </div>

          <div>
            <h3 className="break-words text-xl font-bold">{inquiry.title}</h3>
          </div>

          <MoaCard className="p-5">
            <p className="mb-3 text-sm font-bold text-[var(--theme-text-muted)]">
              {t("community.inquiry.content")}
            </p>
            <p className="whitespace-pre-wrap break-words text-sm leading-7">
              {inquiry.content}
            </p>
          </MoaCard>

          {inquiry.fileOriginal && (
            <div>
              <p className="mb-3 text-sm font-bold text-[var(--theme-text-muted)]">
                {t("community.inquiry.attachment")}
              </p>
              <img
                src={`/uploads/community/inquiry/${inquiry.fileUuid}`}
                alt={inquiry.fileOriginal}
                className="max-h-64 max-w-full rounded-xl border border-[var(--theme-border)] object-contain"
              />
              <p className="mt-2 text-xs font-semibold text-[var(--theme-text-muted)]">
                {inquiry.fileOriginal}
              </p>
            </div>
          )}

          {inquiry.answerContent && (
            <MoaCard className="border-[var(--theme-primary-light)] bg-[var(--theme-primary-light)] p-5">
              <p className="mb-3 text-sm font-bold text-[var(--theme-primary)]">
                {t("community.inquiry.answer")}
              </p>
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[var(--theme-text)]">
                {inquiry.answerContent}
              </p>
              {inquiry.answeredAt && (
                <p className="mt-4 text-xs font-semibold text-[var(--theme-text-muted)]">
                  {t("community.inquiry.answeredAt")}: {formatDate(inquiry.answeredAt)}
                </p>
              )}
            </MoaCard>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDetailModal;
