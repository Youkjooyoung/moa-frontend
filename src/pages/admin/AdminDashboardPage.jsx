import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import {
    Loader2,
    DollarSign,
    Users,
    PartyPopper,
    TrendingUp,
    Wallet,
    CreditCard,
    Clock,
    UserPlus,
    Activity,
    ArrowUpRight,
    ArrowRight,
    Calendar,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    PieChart,
} from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from "chart.js";

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

// Animated Background Gradient (T 스타일)
const AnimatedGradient = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(99, 91, 255, 0.08) 0%, transparent 70%)",
                top: "-200px",
                right: "-200px",
            }}
            animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
                background: "radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%)",
                bottom: "100px",
                left: "-100px",
            }}
            animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.6, 0.4],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

// Grid Pattern
const GridPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <svg width="100%" height="100%">
            <defs>
                <pattern id="adminGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#adminGrid)" />
        </svg>
    </div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
    >
        {/* Background Accent */}
        <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 transition-transform duration-300 group-hover:scale-150"
            style={{ background: color }}
        />

        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}15` }}
                >
                    <Icon className="w-6 h-6" style={{ color }} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
            <div className="text-2xl font-black text-gray-900">{value}</div>
            {subtitle && (
                <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
            )}
        </div>
    </motion.div>
);

// Quick Action Button
const QuickActionButton = ({ icon: Icon, label, to, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
    >
        <Link
            to={to}
            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: `${color}15` }}
            >
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </Link>
    </motion.div>
);

// Recent Activity Item
const ActivityItem = ({ type, title, subtitle, time, status }) => {
    const statusColors = {
        COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '완료' },
        PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: '대기' },
        FAILED: { bg: 'bg-red-100', text: 'text-red-700', label: '실패' },
    };

    const statusStyle = statusColors[status] || statusColors.PENDING;

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white text-sm font-bold">
                {title?.[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{title}</div>
                <div className="text-sm text-gray-500 truncate">{subtitle}</div>
            </div>
            <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    {statusStyle.label}
                </span>
                <div className="text-xs text-gray-400 mt-1">{time}</div>
            </div>
        </div>
    );
};

// OTT Service Stats
const OttServiceStats = ({ stats }) => {
    if (!stats || stats.length === 0) return null;

    const colors = {
        'Netflix': '#E50914',
        'Disney+': '#113CCF',
        'Wavve': '#1351F9',
        'Watcha': '#FF0558',
        'TVING': '#FF153C',
        'Coupang Play': '#5F0080',
    };

    return (
        <div className="space-y-3">
            {stats.map((ott, index) => (
                <motion.div
                    key={ott.ottName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: colors[ott.ottName] || '#635bff' }}
                    >
                        {ott.ottName?.[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{ott.ottName}</span>
                            <span className="text-sm text-gray-500">{ott.partyCount}개 파티</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(ott.activeCount / Math.max(ott.partyCount, 1)) * 100}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="h-full rounded-full"
                                style={{ background: colors[ott.ottName] || '#635bff' }}
                            />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">활성 {ott.activeCount}개</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default function AdminDashboardPage() {
    const { stats, loading, error } = useAdminDashboard();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 animate-spin text-[#635bff]" />
                    <p className="text-gray-500 font-medium">대시보드 로딩 중...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100"
                >
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">데이터 로드 실패</h2>
                    <p className="text-gray-500">통계 데이터를 불러오는데 실패했습니다.</p>
                </motion.div>
            </div>
        );
    }

    // 차트 데이터 구성
    const dailyRevenueData = {
        labels: stats.dailyRevenues?.map(d => d.date?.slice(5)) || [],
        datasets: [
            {
                label: '일별 매출',
                data: stats.dailyRevenues?.map(d => d.amount) || [],
                fill: true,
                borderColor: '#635bff',
                backgroundColor: 'rgba(99, 91, 255, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#635bff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const dailyRevenueOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0a2540',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.parsed.y.toLocaleString()}원`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' },
            },
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                ticks: {
                    color: '#94a3b8',
                    callback: (value) => `${(value / 1000).toFixed(0)}K`,
                },
            },
        },
    };

    // 파티 상태 도넛 차트
    const partyStatusData = {
        labels: ['활성', '모집중', '기타'],
        datasets: [
            {
                data: [
                    stats.activePartyCount || 0,
                    stats.recruitingPartyCount || 0,
                    Math.max(0, (stats.totalPartyCount || 0) - (stats.activePartyCount || 0) - (stats.recruitingPartyCount || 0)),
                ],
                backgroundColor: ['#10b981', '#635bff', '#e2e8f0'],
                borderColor: ['#fff', '#fff', '#fff'],
                borderWidth: 3,
            },
        ],
    };

    const partyStatusOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0a2540',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <AnimatedGradient />
            <GridPattern />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                                관리자 대시보드
                            </h1>
                            <p className="text-gray-500 text-sm">
                                서비스 현황을 한눈에 확인하세요
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={DollarSign}
                        title="총 매출"
                        value={`${(stats.totalRevenue || 0).toLocaleString()}원`}
                        subtitle="전체 누적"
                        color="#635bff"
                        delay={0}
                    />
                    <StatCard
                        icon={Wallet}
                        title="이번 달 매출"
                        value={`${(stats.thisMonthRevenue || 0).toLocaleString()}원`}
                        subtitle={`${stats.thisMonthPaymentCount || 0}건 결제`}
                        color="#00d4ff"
                        delay={0.1}
                    />
                    <StatCard
                        icon={Users}
                        title="총 회원"
                        value={`${(stats.totalUserCount || 0).toLocaleString()}명`}
                        subtitle={`오늘 +${stats.todayNewUsers || 0}명`}
                        color="#10b981"
                        delay={0.2}
                    />
                    <StatCard
                        icon={PartyPopper}
                        title="활성 파티"
                        value={`${stats.activePartyCount || 0}개`}
                        subtitle={`전체 ${stats.totalPartyCount || 0}개`}
                        color="#f59e0b"
                        delay={0.3}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={Activity}
                        title="모집중 파티"
                        value={`${stats.recruitingPartyCount || 0}개`}
                        color="#8b5cf6"
                        delay={0.4}
                    />
                    <StatCard
                        icon={Clock}
                        title="결제 대기"
                        value={`${stats.pendingPaymentCount || 0}건`}
                        color="#f97316"
                        delay={0.5}
                    />
                    <StatCard
                        icon={CheckCircle2}
                        title="완료된 결제"
                        value={`${(stats.completedPaymentCount || 0).toLocaleString()}건`}
                        color="#06b6d4"
                        delay={0.6}
                    />
                    <StatCard
                        icon={UserPlus}
                        title="오늘 가입"
                        value={`${stats.todayNewUsers || 0}명`}
                        color="#ec4899"
                        delay={0.7}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">최근 7일 매출</h3>
                                <p className="text-sm text-gray-500">일별 매출 추이</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-[#635bff]/10 rounded-full">
                                <TrendingUp className="w-4 h-4 text-[#635bff]" />
                                <span className="text-sm font-semibold text-[#635bff]">매출 현황</span>
                            </div>
                        </div>
                        <div className="h-[280px]">
                            <Line data={dailyRevenueData} options={dailyRevenueOptions} />
                        </div>
                    </motion.div>

                    {/* Party Status Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">파티 현황</h3>
                                <p className="text-sm text-gray-500">상태별 분포</p>
                            </div>
                            <PieChart className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-[200px] mb-4">
                            <Doughnut data={partyStatusData} options={partyStatusOptions} />
                        </div>
                        <div className="flex justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-sm text-gray-600">활성 {stats.activePartyCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#635bff]" />
                                <span className="text-sm text-gray-600">모집중 {stats.recruitingPartyCount || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* OTT Service Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">OTT별 파티</h3>
                                <p className="text-sm text-gray-500">서비스별 현황</p>
                            </div>
                        </div>
                        <OttServiceStats stats={stats.ottPartyStats} />
                    </motion.div>

                    {/* Recent Users */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">최근 가입</h3>
                                <p className="text-sm text-gray-500">신규 회원</p>
                            </div>
                            <Link
                                to="/admin/users"
                                className="flex items-center gap-1 text-sm font-medium text-[#635bff] hover:underline"
                            >
                                전체보기 <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-1">
                            {stats.recentUsers?.map((user, index) => (
                                <motion.div
                                    key={user.odUserId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center text-white text-sm font-bold">
                                        {user.userName?.[0] || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{user.userName}</div>
                                        <div className="text-xs text-gray-500 truncate">{user.userEmail}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">{user.regDate?.slice(5)}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">최근 결제</h3>
                                <p className="text-sm text-gray-500">결제 내역</p>
                            </div>
                            <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                            {stats.recentPayments?.map((payment, index) => (
                                <ActivityItem
                                    key={payment.paymentId}
                                    title={payment.odUserId}
                                    subtitle={`${payment.amount?.toLocaleString()}원 - ${payment.partyName}`}
                                    time={payment.paymentDate?.slice(5)}
                                    status={payment.status}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">빠른 작업</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        <QuickActionButton
                            icon={Users}
                            label="회원 관리"
                            to="/admin/users"
                            color="#635bff"
                            delay={0}
                        />
                        <QuickActionButton
                            icon={PartyPopper}
                            label="파티 목록"
                            to="/party"
                            color="#10b981"
                            delay={0.1}
                        />
                        <QuickActionButton
                            icon={AlertCircle}
                            label="블랙리스트"
                            to="/admin/blacklist/add"
                            color="#ef4444"
                            delay={0.2}
                        />
                        <QuickActionButton
                            icon={Activity}
                            label="공지사항"
                            to="/community/notice"
                            color="#f59e0b"
                            delay={0.3}
                        />
                        <QuickActionButton
                            icon={Calendar}
                            label="FAQ 관리"
                            to="/community/faq"
                            color="#8b5cf6"
                            delay={0.4}
                        />
                        <QuickActionButton
                            icon={CreditCard}
                            label="문의 관리"
                            to="/community/inquiry/admin"
                            color="#06b6d4"
                            delay={0.5}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
