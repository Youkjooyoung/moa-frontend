import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, CalendarPlus, Sparkles, LayoutGrid, Bell, Users, Lightbulb } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { useAuthStore } from '../../store/authStore';
import UpdateProductModal from '../../components/product/UpdateProductModal';
import { useThemeStore } from '@/store/themeStore';
import { useTheme, ChristmasBackground } from '@/config/themeConfig';

const GetProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { theme } = useThemeStore();
    const { accentColor, bgColor, cardBg } = useTheme();

    const getAccentColor = () => {
        switch (theme) {
            case 'classic':
            case 'dark':
                return '#635bff';
            case 'pop':
                return '#ec4899';
            case 'christmas':
                return '#c41e3a';
            default:
                return '#635bff';
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await httpClient.get(`/product/${id}`);
            if (response.success) {
                setProduct(response.data);
            } else {
                throw new Error(response.error?.message || "Failed to fetch product");
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
            alert("상품 정보를 불러오는데 실패했습니다.");
            navigate('/product');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id, navigate]);

    const handleSubscribe = () => {
        // 구독 등록 로직 (추후 구현)
        navigate(`/subscription/add/${id}?startDate=${startDate}`);
    };

    const accent = getAccentColor();

    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${theme === 'christmas' ? '' : theme === 'dark' ? 'bg-[#0B1120]' : 'bg-stone-50'}`}>
                {theme === 'christmas' && <ChristmasBackground />}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: accent }}></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className={`min-h-screen ${theme === 'christmas' ? '' : theme === 'dark' ? 'bg-[#0B1120]' : 'bg-stone-50'}`}>
            {theme === 'christmas' && <ChristmasBackground />}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className={`rounded-[2rem] shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#1E293B] border border-gray-700' : 'bg-white'}`}>
                    {/* Header Section (Horizontal Layout with Gradient) */}
                    <div className={`p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50' : ''
                        }`}
                        style={{
                            background: theme === 'dark' ? undefined : `linear-gradient(135deg, ${accent}15 0%, ${accent}05 100%)`
                        }}>
                        {/* Blur Circles */}
                        <div className="absolute top-0 left-0 w-32 h-32 rounded-full filter blur-3xl opacity-30 -ml-10 -mt-10"
                            style={{ backgroundColor: accent }}></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full filter blur-3xl opacity-30 -mr-10 -mb-10"
                            style={{ backgroundColor: theme === 'pop' ? '#f472b6' : accent }}></div>

                        {/* Icon */}
                        <div className="relative z-10 flex-shrink-0">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.productName}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-3xl shadow-lg object-cover bg-white"
                                />
                            ) : (
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white shadow-lg flex items-center justify-center text-gray-400">
                                    No Img
                                </div>
                            )}
                        </div>

                        {/* Title + Category + Price */}
                        <div className="relative z-10 text-center md:text-left flex-1">
                            <h1 className={`text-2xl md:text-3xl font-extrabold leading-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                {product.productName}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{
                                    color: accent,
                                    backgroundColor: `${accent}20`
                                }}>
                                    {product.categoryName || '구독'}
                                </span>
                                {product.productStatus === 'INACTIVE' && (
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${theme === 'dark'
                                            ? 'text-gray-400 bg-gray-700'
                                            : 'text-gray-600 bg-gray-100'
                                        }`}>
                                        판매중지
                                    </span>
                                )}
                                <span className={`font-extrabold text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>
                                    ₩{product.price?.toLocaleString()}
                                    <span className={`text-sm font-normal ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>/월</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        {/* Description */}
                        {product.description && (
                            <div className="mb-8">
                                <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-stone-600'}`}>
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* MoA 구독 관리 혜택 */}
                        <div className="mb-8">
                            <h3 className={`font-bold mb-6 flex items-center gap-2 text-base ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                                <Sparkles className="w-5 h-5" style={{ color: accent }} /> MoA 구독 관리 혜택
                            </h3>
                            <div className="space-y-5">
                                {[
                                    {
                                        icon: LayoutGrid,
                                        bgColor: accent,
                                        title: "1. 모든 구독을 한눈에 정리하세요",
                                        desc: "흩어진 구독을 한 곳에서 확인하고 더 쉽고 편하게 관리할 수 있어요."
                                    },
                                    {
                                        icon: Bell,
                                        bgColor: '#ef4444',
                                        title: "2. 매달 빠져나가는 구독비, 미리 대비하세요",
                                        desc: "결제일을 자동으로 알려주어 불필요한 지출을 막아줘요."
                                    },
                                    {
                                        icon: Users,
                                        bgColor: '#f97316',
                                        title: "3. 가족의 구독도 함께 관리하는 패밀리 센터",
                                        desc: "가족이 어떤 서비스에 가입했는지 쉽고 투명하게 관리하세요."
                                    },
                                    {
                                        icon: Lightbulb,
                                        bgColor: '#eab308',
                                        title: "4. 꼭 필요한 구독만 남기는 똑똑한 소비 도우미",
                                        desc: "활용도가 낮은 구독을 알려줘서 해지·유지 판단을 도와줘요."
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}
                                            style={{
                                                backgroundColor: `${item.bgColor}20`,
                                                color: item.bgColor
                                            }}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`text-sm font-bold leading-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                                                {item.title}
                                            </h4>
                                            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 구독 시작일 선택 (일반 사용자만) */}
                        {user?.role !== 'ADMIN' && (
                            <div className={`mb-8 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-stone-100'}`}>
                                <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-700'}`}>
                                    구독 시작일 (결제일) 지정
                                </label>
                                <div className="relative">
                                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-stone-400'}`} />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:border-transparent font-medium ${theme === 'dark'
                                                ? 'bg-[#0B1120] border border-gray-600 text-white'
                                                : 'bg-stone-50 border border-stone-200 text-stone-900'
                                            }`}
                                        style={{
                                            '--tw-ring-color': accent
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            {user?.role === 'ADMIN' ? (
                                <>
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${theme === 'dark'
                                                ? 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                                                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                                            }`}
                                    >
                                        수정하기
                                    </button>
                                    <button
                                        onClick={() => navigate(`/product/${id}/delete`)}
                                        className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${theme === 'dark'
                                                ? 'bg-red-900/30 border border-red-700 text-red-400 hover:bg-red-900/50'
                                                : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                                            }`}
                                    >
                                        삭제하기
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/product')}
                                        className={`flex-1 py-3.5 rounded-xl font-bold transition-colors ${theme === 'dark'
                                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                            }`}
                                    >
                                        뒤로가기
                                    </button>
                                    <button
                                        onClick={handleSubscribe}
                                        className="flex-[2] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: accent,
                                            boxShadow: `0 10px 15px -3px ${accent}33`
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
                                        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                                    >
                                        <CalendarPlus className="w-5 h-5" />
                                        구독 일정에 등록
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Update Product Modal */}
                <UpdateProductModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    productId={id}
                    initialData={product}
                    onSuccess={() => {
                        navigate('/product');
                    }}
                />
            </div>
        </div>
    );
};

export default GetProduct;
