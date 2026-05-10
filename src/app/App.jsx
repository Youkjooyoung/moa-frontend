import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import PineappleEasterEgg from "@/components/common/PineappleEasterEgg";
import FloatingButtonsContainer from "@/components/common/FloatingButtonsContainer";
import { useGlobalLinkHandler } from "@/hooks/common/useGlobalLinkHandler";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { useLocaleStore } from "@/store/localeStore";
import { useThemeStore } from "@/store/themeStore";

import AdminAuthGuard from "@/pages/admin/components/AdminAuthGuard";

const BankVerificationPage = lazy(() => import("@/pages/account/BankVerificationPage"));
const AddBlacklistPage = lazy(() => import("@/pages/admin/AddBlacklistPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminLoginHistoryPage = lazy(() => import("@/pages/admin/AdminLoginHistoryPage"));
const AdminBlacklistDeletePage = lazy(() => import("@/pages/admin/RemoveBlacklistPage"));
const AdminUserDetailPage = lazy(() => import("@/pages/admin/AdminUserDetailPage"));
const AdminUserListPage = lazy(() => import("@/pages/admin/AdminUserListPage"));
const ChartComparisonPage = lazy(() => import("@/pages/admin/ChartComparisonPage"));
const LandingContentAdminPage = lazy(() => import("@/pages/admin/LandingContentAdminPage"));
const PassRedirect = lazy(() => import("@/pages/auth/PassRedirect"));
const AddFaq = lazy(() => import("@/pages/community/AddFaq"));
const AddNotice = lazy(() => import("@/pages/community/AddNotice"));
const GetNotice = lazy(() => import("@/pages/community/GetNotice"));
const Inquiry = lazy(() => import("@/pages/community/Inquiry"));
const InquiryAdmin = lazy(() => import("@/pages/community/InquiryAdmin"));
const ListFaq = lazy(() => import("@/pages/community/ListFaq"));
const ListNotice = lazy(() => import("@/pages/community/ListNotice"));
const UpdateNotice = lazy(() => import("@/pages/community/UpdateNotice"));
const MainPage = lazy(() => import("@/pages/main/MainPage"));
const OAuthCallbackPage = lazy(() => import("@/pages/oauth/OAuthCallbackPage"));
const PhoneConnectPage = lazy(() => import("@/pages/oauth/PhoneConnectPage"));
const MyPartyListPage = lazy(() => import("@/pages/party/MyPartyListPage"));
const PartyCreatePage = lazy(() => import("@/pages/party/PartyCreatePage"));
const PartyDetailPage = lazy(() => import("@/pages/party/PartyDetailPage"));
const PartyListPage = lazy(() => import("@/pages/party/PartyListPage"));
const BillingFailPage = lazy(() => import("@/pages/payment/BillingFailPage"));
const BillingRegisterPage = lazy(() => import("@/pages/payment/BillingRegisterPage"));
const BillingSuccessPage = lazy(() => import("@/pages/payment/BillingSuccessPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/payment/PaymentSuccessPage"));
const DeleteProduct = lazy(() => import("@/pages/product/DeleteProduct"));
const GetProduct = lazy(() => import("@/pages/product/GetProduct"));
const GetProductList = lazy(() => import("@/pages/product/GetProductList"));
const AddSubscription = lazy(() => import("@/pages/subscription/AddSubscription"));
const CancelSubscription = lazy(() => import("@/pages/subscription/CancelSubscription"));
const GetSubscription = lazy(() => import("@/pages/subscription/GetSubscription"));
const GetSubscriptionList = lazy(() => import("@/pages/subscription/GetSubscriptionList"));
const UpdateSubscription = lazy(() => import("@/pages/subscription/UpdateSubscription"));
const UserSubscriptionList = lazy(() => import("@/pages/subscription/UserSubscriptionList"));
const FinancialHistoryPage = lazy(() => import("@/pages/user/FinancialHistoryPage"));
const MyWalletPage = lazy(() => import("@/pages/user/MyWalletPage"));
const FindIdPage = lazy(() => import("@/pages/user/findId/FindIdPage"));
const LoginPage = lazy(() => import("@/pages/user/login/LoginPage"));
const MyPage = lazy(() => import("@/pages/user/mypage/MyPage"));
const UpdateUserPage = lazy(() => import("@/pages/user/mypage/UpdateUserPage"));
const AddUserPage = lazy(() => import("@/pages/user/register/AddUserPage"));
const DeleteUserPage = lazy(() => import("@/pages/user/register/DeleteUserPage"));
const EmailVerifiedPage = lazy(() => import("@/pages/user/register/EmailVerifiedPage"));
const SocialRegisterPage = lazy(() => import("@/pages/user/register/SocialRegisterPage"));
const ResetPwdPage = lazy(() => import("@/pages/user/resetPwd/ResetPwdPage"));
const UpdatePwdPage = lazy(() => import("@/pages/user/resetPwd/UpdatePwdPage"));

function AdminRoute({ children }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm font-bold text-[var(--theme-text-muted)]">
      화면을 불러오는 중입니다.
    </div>
  );
}

function AppContent() {
  useGlobalLinkHandler();

  const { user } = useAuthStore();
  const { locale } = useLocaleStore();
  const { resolvedTheme, setSystemTheme } = useThemeStore();
  const [pineappleEnabled, setPineappleEnabled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.lang = locale;
  }, [resolvedTheme, locale]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => setSystemTheme(media.matches ? "dark" : "light");

    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, [setSystemTheme]);

  const showEasterEgg =
    user && (user.userId === "usertest1" || user.userId === "admintest");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300">
      <ScrollToTop />
      {showEasterEgg && pineappleEnabled && (
        <PineappleEasterEgg showToggle={false} />
      )}
      <FloatingButtonsContainer
        showPineapple={showEasterEgg}
        pineappleEnabled={pineappleEnabled}
        setPineappleEnabled={setPineappleEnabled}
      />

      <Header />

      <main className="flex-1 transition-all duration-300" style={{ paddingTop: "5rem" }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/party" element={<PartyListPage />} />
            <Route path="/party/create" element={<PartyCreatePage />} />
            <Route path="/party/:id" element={<PartyDetailPage />} />

            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/oauth/phone-connect" element={<PhoneConnectPage />} />
            <Route path="/auth/pass/redirect" element={<PassRedirect />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<AddUserPage />} />
            <Route path="/find-email" element={<FindIdPage />} />
            <Route path="/register/social" element={<SocialRegisterPage />} />
            <Route path="/reset-password" element={<ResetPwdPage />} />
            <Route path="/email-verified" element={<EmailVerifiedPage />} />

            <Route path="/mypage" element={<ProtectedRoute element={<MyPage />} />} />
            <Route path="/mypage/password" element={<ProtectedRoute element={<UpdatePwdPage />} />} />
            <Route path="/mypage/delete" element={<ProtectedRoute element={<DeleteUserPage />} />} />
            <Route path="/mypage/edit" element={<ProtectedRoute element={<UpdateUserPage />} />} />
            <Route path="/mypage/wallet" element={<ProtectedRoute element={<MyWalletPage />} />} />
            <Route path="/user/financial-history" element={<ProtectedRoute element={<FinancialHistoryPage />} />} />
            <Route path="/user/wallet" element={<ProtectedRoute element={<MyWalletPage />} />} />
            <Route path="/user/my-wallet" element={<ProtectedRoute element={<MyWalletPage />} />} />
            <Route path="/user/account-register" element={<ProtectedRoute element={<BankVerificationPage />} />} />
            <Route path="/user/account-verify" element={<ProtectedRoute element={<BankVerificationPage />} />} />
            <Route path="/account/verify" element={<ProtectedRoute element={<BankVerificationPage />} />} />
            <Route path="/my-parties" element={<ProtectedRoute element={<MyPartyListPage />} />} />

            <Route path="/admin/blacklist/add" element={<AdminRoute><AddBlacklistPage /></AdminRoute>} />
            <Route path="/admin/blacklist/delete" element={<AdminRoute><AdminBlacklistDeletePage /></AdminRoute>} />
            <Route path="/admin/chart-comparison" element={<AdminRoute><ChartComparisonPage /></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/landing" element={<AdminRoute><LandingContentAdminPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUserListPage /></AdminRoute>} />
            <Route path="/admin/users/:userId" element={<AdminRoute><AdminUserDetailPage /></AdminRoute>} />
            <Route path="/admin/users/:userId/login-history" element={<AdminRoute><AdminLoginHistoryPage /></AdminRoute>} />

            <Route path="/product" element={<GetProductList />} />
            <Route path="/product/:id" element={<GetProduct />} />
            <Route path="/product/:id/delete" element={<ProtectedRoute element={<DeleteProduct />} />} />

            <Route path="/subscription/add/:productId" element={<ProtectedRoute element={<AddSubscription />} />} />
            <Route path="/subscription" element={<ProtectedRoute element={<GetSubscriptionList />} />} />
            <Route path="/subscription/:id" element={<ProtectedRoute element={<GetSubscription />} />} />
            <Route path="/subscription/:id/edit" element={<ProtectedRoute element={<UpdateSubscription />} />} />
            <Route path="/subscription/:id/cancel" element={<ProtectedRoute element={<CancelSubscription />} />} />
            <Route path="/subscriptions" element={<GetProductList />} />
            <Route path="/my/subscriptions" element={<UserSubscriptionList />} />

            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/billing/register" element={<BillingRegisterPage />} />
            <Route path="/payment/billing/success" element={<BillingSuccessPage />} />
            <Route path="/payment/billing/fail" element={<BillingFailPage />} />

            <Route path="/community/notice" element={<ListNotice />} />
            <Route path="/community/notice/:communityId" element={<GetNotice />} />
            <Route path="/community/notice/add" element={<AddNotice />} />
            <Route path="/community/notice/update/:communityId" element={<UpdateNotice />} />
            <Route path="/community/faq" element={<ListFaq />} />
            <Route path="/community/faq/add" element={<AddFaq />} />
            <Route path="/community/inquiry" element={<Inquiry />} />
            <Route path="/community/inquiry/admin" element={<InquiryAdmin />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
