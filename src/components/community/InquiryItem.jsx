import InquiryStatusBadge from './InquiryStatusBadge';
import { formatDate, getCategoryName } from '../../utils/communityUtils';
import { MoaBadge } from "@/components/common/MoaPage";

const InquiryItem = ({ inquiry, onClick }) => {
    return (
        <div
            onClick={() => onClick(inquiry)}
            className="min-w-0 cursor-pointer border-b border-[var(--theme-border-light)] py-4 transition hover:bg-[var(--theme-surface-muted)] last:border-b-0"
        >
            <div className="flex items-start justify-between mb-2 min-w-0">
                <h4 className="min-w-0 flex-1 truncate pr-3 font-bold text-[var(--theme-text)]">
                    {inquiry.title}
                </h4>
                <InquiryStatusBadge status={inquiry.answerStatus} />
            </div>
            <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-[var(--theme-text-muted)]">{formatDate(inquiry.createdAt)}</span>
                <MoaBadge tone="primary">{getCategoryName(inquiry.communityCodeId)}</MoaBadge>
            </div>
        </div>
    );
};

export default InquiryItem;
