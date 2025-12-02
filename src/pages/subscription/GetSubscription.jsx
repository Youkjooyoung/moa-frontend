import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const GetSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get(`/subscription/${id}`);
                if (response.success) {
                    setSubscription(response.data);
                } else {
                    throw new Error(response.error?.message || "Failed to fetch subscription");
                }
            } catch (error) {
                console.error("Failed to fetch subscription", error);
                alert("구독 정보를 불러오는데 실패했습니다.");
                navigate('/subscriptions');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [id, navigate]);

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (!subscription) return null;

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
                    <img
                        src={subscription.product?.image || '/placeholder.png'}
                        alt={subscription.product?.productName}
                        className="w-24 h-24 rounded-xl object-cover mx-auto mb-4 shadow-sm"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{subscription.product?.productName}</h1>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {subscription.status === 'ACTIVE' ? '이용중' : '해지됨'}
                    </span>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-500">시작일</span>
                            <span className="font-medium text-gray-900">{subscription.startDate}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-500">다음 결제일</span>
                            <span className="font-medium text-gray-900">{subscription.nextBillingDate}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-500">결제 금액</span>
                            <span className="font-bold text-brand-600">{subscription.product?.price?.toLocaleString()}원</span>
                        </div>
                    </div>

                    {subscription.status === 'ACTIVE' && (
                        <div className="mt-10 flex gap-3">
                            <button
                                onClick={() => navigate(`/subscriptions/${id}/edit`)}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                옵션 변경
                            </button>
                            <button
                                onClick={() => navigate(`/subscriptions/${id}/cancel`)}
                                className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
                            >
                                구독 해지
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetSubscription;
