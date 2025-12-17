import { useAdminUserListLogic } from "@/hooks/admin/useAdminUserList";
import { useThemeStore } from "@/store/themeStore";
import { ChristmasBackground } from "@/config/themeConfig";
import UserListBackground from "./components/pages/userList/UserListBackground";
import UserListHero from "./components/pages/userList/UserListHero";
import UserListTableCard from "./components/pages/userList/UserListTableCard";

export default function AdminUserListPage() {
  const {
    users,
    page,
    sort,
    totalPages,
    totalCount,
    filters,
    searchValue,
    loading,
    error,
    pageNumbers,

    handlers,

    utils: { formatDate },
  } = useAdminUserListLogic();

  const { theme } = useThemeStore();

  const bgClass = theme === 'dark'
    ? 'bg-[#0B1120] text-white'
    : theme === 'christmas'
    ? 'bg-transparent text-black'
    : 'bg-slate-50 text-black';

  return (
    <div className="min-h-screen bg-transparent overflow-hidden relative z-10">
      {theme === 'christmas' && <ChristmasBackground />}
      {theme !== 'dark' && theme !== 'christmas' && <UserListBackground />}
      <UserListHero totalCount={totalCount} />
      <UserListTableCard
        users={users}
        page={page}
        sort={sort}
        totalPages={totalPages}
        totalCount={totalCount}
        filters={filters}
        searchValue={searchValue}
        loading={loading}
        error={error}
        pageNumbers={pageNumbers}
        handlers={handlers}
        formatDate={formatDate}
      />
    </div>
  );
}
