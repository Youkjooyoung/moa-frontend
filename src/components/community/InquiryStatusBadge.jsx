import { MoaBadge } from "@/components/common/MoaPage";
import { useI18n } from "@/hooks/useI18n";

const InquiryStatusBadge = ({ status }) => {
    const { t } = useI18n();

    if (status === '답변완료') {
        return (
            <MoaBadge tone="success">{t("community.inquiry.status.done")}</MoaBadge>
        );
    }
    return (
        <MoaBadge tone="warning">{t("community.inquiry.status.pending")}</MoaBadge>
    );
};

export default InquiryStatusBadge;
