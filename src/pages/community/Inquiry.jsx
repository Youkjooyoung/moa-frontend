import { useCallback, useEffect, useState } from 'react';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryForm from '../../components/community/InquiryForm';
import InquiryItem from '../../components/community/InquiryItem';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import { useAuthStore } from '@/store/authStore';
import { MoaButton, MoaCard, MoaEmptyState } from '@/components/common/MoaPage';
import { useI18n } from '@/hooks/useI18n';

const Inquiry = () => {
    const { user } = useAuthStore();
    const { t } = useI18n();
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        communityCodeId: 1,
        title: '',
        content: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const pageSize = 5;

    const userId = user?.userId;

    const loadMyInquiries = useCallback(async (page) => {
        if (!userId) return;

        try {
            const response = await fetch(`/api/community/inquiry/my?userId=${userId}&page=${page}&size=${pageSize}`);

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
    }, [userId]);

    useEffect(() => {
        if (userId) {
            Promise.resolve().then(() => loadMyInquiries(1));
        }
    }, [loadMyInquiries, userId]);

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert(t("form.requiredTitle"));
            return;
        }

        if (!formData.content.trim()) {
            alert(t("form.requiredContent"));
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('userId', userId);
            submitData.append('communityCodeId', formData.communityCodeId);
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);

            if (imageFile) {
                submitData.append('file', imageFile);
            }

            const response = await fetch('/api/community/inquiry', {
                method: 'POST',
                body: submitData
            });

            if (response.ok) {
                alert(t("community.inquiry.created"));
                setFormData({
                    communityCodeId: 1,
                    title: '',
                    content: ''
                });
                setImageFile(null);
                setImagePreview(null);
                loadMyInquiries(1);
            } else {
                alert(t("form.createFailed"));
            }
        } catch {
            alert(t("form.createError"));
        }
    };

    const handleInquiryClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsDetailModalOpen(true);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadMyInquiries(page);
    };


    return (
        <CommunityLayout>
            <div className="max-w-[1100px] mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--theme-text)]">
                        {t("community.inquiry.title")}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--theme-text-muted)]">
                        {t("community.inquiry.description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="min-w-0 overflow-hidden">
                        <h3 className="mb-4 text-lg font-bold text-[var(--theme-text)]">
                            {t("community.inquiry.create")}
                        </h3>
                        <InquiryForm
                            formData={formData}
                            setFormData={setFormData}
                            imagePreview={imagePreview}
                            setImageFile={setImageFile}
                            setImagePreview={setImagePreview}
                            onSubmit={handleSubmit}
                        />
                    </div>

                    <div className="min-w-0 overflow-hidden">
                        <h3 className="mb-4 text-lg font-bold text-[var(--theme-text)]">
                            {t("community.inquiry.mine")}
                        </h3>

                        <MoaCard className="flex min-h-[520px] flex-col p-5 sm:p-6">
                            {inquiries.length === 0 ? (
                                <MoaEmptyState
                                    title={t("community.inquiry.empty")}
                                    className="flex-1 border-0"
                                />
                            ) : (
                                <div className="flex-1 overflow-y-auto">
                                    {inquiries.map((inquiry) => (
                                        <InquiryItem
                                            key={inquiry.communityId}
                                            inquiry={inquiry}
                                            onClick={handleInquiryClick}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-between border-t border-[var(--theme-border-light)] pt-4">
                                <MoaButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    {t("common.prev")}
                                </MoaButton>
                                <span className="text-sm font-semibold text-[var(--theme-text-muted)]">
                                    {currentPage} / {Math.max(totalPages, 1)}
                                </span>
                                <MoaButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    {t("common.next")}
                                </MoaButton>
                            </div>
                        </MoaCard>
                    </div>
                </div>
            </div>

            <InquiryDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                inquiry={selectedInquiry}
            />
        </CommunityLayout>
    );
};

export default Inquiry;
