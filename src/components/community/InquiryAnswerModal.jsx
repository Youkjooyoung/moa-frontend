import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoaBadge,
  MoaButton,
  MoaCard,
  MoaField,
  MoaTextarea,
} from "@/components/common/MoaPage";
import { formatDate, getCategoryName } from "../../utils/communityUtils";
import { useI18n } from "@/hooks/useI18n";

const InquiryAnswerModalContent = ({ inquiry, onClose, onAnswerSubmit }) => {
  const [answerContent, setAnswerContent] = useState(inquiry?.answerContent || "");
  const { t } = useI18n();

  const handleSubmit = async () => {
    if (!answerContent.trim()) {
      alert(t("community.form.answerPlaceholder"));
      return;
    }

    await onAnswerSubmit(inquiry.communityId, answerContent);
  };

  return (
    <>
      <DialogHeader className="border-b border-[var(--theme-border-light)] px-6 py-5">
        <DialogTitle className="text-xl font-bold text-[var(--theme-text)]">
          {inquiry.answerContent ? "답변 수정" : "답변 작성"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 px-6 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <MoaBadge tone="primary">{getCategoryName(inquiry.communityCodeId)}</MoaBadge>
          <span className="text-sm font-semibold text-[var(--theme-text-muted)]">
            {formatDate(inquiry.createdAt)}
          </span>
        </div>

        <div>
          <h3 className="break-words text-xl font-bold text-[var(--theme-text)]">
            {inquiry.title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[var(--theme-text-muted)]">
            작성자: {inquiry.userId}
          </p>
        </div>

        <MoaCard className="p-5">
          <p className="mb-2 text-sm font-bold text-[var(--theme-text-muted)]">
            {t("community.inquiry.content")}
          </p>
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[var(--theme-text)]">
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

        <MoaField label="답변 작성">
          <MoaTextarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder={t("community.form.answerPlaceholder")}
            rows={8}
          />
        </MoaField>
      </div>

      <DialogFooter className="border-t border-[var(--theme-border-light)] px-6 py-5">
        <MoaButton variant="secondary" onClick={onClose}>
          {t("community.form.cancel")}
        </MoaButton>
        <MoaButton onClick={handleSubmit}>
          {inquiry.answerContent ? t("community.form.update") : t("community.form.submit")}
        </MoaButton>
      </DialogFooter>
    </>
  );
};

const InquiryAnswerModal = ({ isOpen, onClose, inquiry, onAnswerSubmit }) => {
  if (!inquiry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[82vh] max-w-2xl overflow-y-auto rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-0">
        <InquiryAnswerModalContent
          key={inquiry.communityId}
          inquiry={inquiry}
          onClose={onClose}
          onAnswerSubmit={onAnswerSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InquiryAnswerModal;
