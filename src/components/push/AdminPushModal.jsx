import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, FileText, History, Send } from "lucide-react";
import { useAdminPush } from "@/hooks/push/useAdminPush";
import TemplatesTab from "./admin/TemplatesTab";
import HistoryTab from "./admin/HistoryTab";
import SendTab from "./admin/SendTab";
import TemplateForm from "./forms/TemplateForm";
import { useThemeStore } from "@/store/themeStore";

// 테마별 스타일
const adminPushThemeStyles = {
    default: {
        // Neo/Pop 스타일 - 핑크, 시안 계열 (깔끔한 흰색 배경)
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
        tabActive: "data-[state=active]:border-pink-500 data-[state=active]:text-pink-600",
        headerBg: "bg-white",
        headerBorder: "border-gray-100",
        titleText: "text-pink-600",
    },
    christmas: {
        iconBg: "bg-red-100",
        iconColor: "text-[#c41e3a]",
        tabActive: "data-[state=active]:border-[#c41e3a] data-[state=active]:text-[#c41e3a]",
        headerBg: "bg-red-50",
        headerBorder: "border-red-100",
        titleText: "text-[#c41e3a]",
    },
};

const AdminPushModal = ({ isOpen, onClose }) => {
    const { theme } = useThemeStore();
    const themeStyle = adminPushThemeStyles[theme] || adminPushThemeStyles.pop;
    const {
        activeTab,
        setActiveTab,
        isLoading,
        templates,
        editingTemplate,
        isTemplateModalOpen,
        setIsTemplateModalOpen,
        handleAddTemplate,
        handleEditTemplate,
        handleSaveTemplate,
        handleDeleteTemplate,
        setEditingTemplate,
        history,
        historyPage,
        historyTotalPages,
        historyTotalCount,
        historyPageSize,
        historyFilters,
        handleHistoryFilterChange,
        handleHistorySearch,
        handleHistoryPageChange,
        handleHistoryPageSizeChange,
        users,
        usersTotalCount,
        usersPage,
        usersTotalPages,
        selectedUsers,
        sendForm,
        handleUserSearch,
        handleUsersPageChange,
        handleSelectUser,
        handleSelectAllUsers,
        handleRemoveUser,
        handleClearSelectedUsers,
        handleSendFormChange,
        handleSendPush,
        handleSendToAll,
    } = useAdminPush();

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl h-[700px] p-0 flex flex-col">
                    <DialogHeader className={`px-6 py-4 border-b ${themeStyle.headerBorder} ${themeStyle.headerBg} flex-shrink-0`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${themeStyle.iconBg} flex items-center justify-center`}>
                                <Bell className={`w-5 h-5 ${themeStyle.iconColor}`} />
                            </div>
                            <div>
                                <DialogTitle className={`text-lg font-semibold ${themeStyle.titleText}`}>
                                    {theme === 'christmas' ? '🎄 푸시 알림 관리' : '푸시 알림 관리'}
                                </DialogTitle>
                                <p className="text-sm text-slate-500">
                                    템플릿 관리 · 발송 내역 · 수동 발송
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <div className={`px-6 border-b ${themeStyle.headerBorder} flex-shrink-0`}>
                            <TabsList className="bg-transparent h-12 p-0 gap-1">
                                <TabsTrigger
                                    value="templates"
                                    className={`data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 ${themeStyle.tabActive} rounded-none px-4 h-12`}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    템플릿 관리
                                </TabsTrigger>
                                <TabsTrigger
                                    value="history"
                                    className={`data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 ${themeStyle.tabActive} rounded-none px-4 h-12`}
                                >
                                    <History className="w-4 h-4 mr-2" />
                                    발송 내역
                                </TabsTrigger>
                                <TabsTrigger
                                    value="send"
                                    className={`data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 ${themeStyle.tabActive} rounded-none px-4 h-12`}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    수동 발송
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col">
                            {activeTab === "templates" && (
                                <TemplatesTab
                                    templates={templates}
                                    isLoading={isLoading}
                                    onAdd={handleAddTemplate}
                                    onEdit={handleEditTemplate}
                                    onDelete={handleDeleteTemplate}
                                />
                            )}

                            {activeTab === "history" && (
                                <HistoryTab
                                    history={history}
                                    page={historyPage}
                                    totalPages={historyTotalPages}
                                    totalCount={historyTotalCount}
                                    pageSize={historyPageSize}
                                    filters={historyFilters}
                                    templates={templates}
                                    isLoading={isLoading}
                                    onFilterChange={handleHistoryFilterChange}
                                    onSearch={handleHistorySearch}
                                    onPageChange={handleHistoryPageChange}
                                    onPageSizeChange={handleHistoryPageSizeChange}
                                />
                            )}

                            {activeTab === "send" && (
                                <SendTab
                                    users={users}
                                    usersTotalCount={usersTotalCount}
                                    usersPage={usersPage}
                                    usersTotalPages={usersTotalPages}
                                    selectedUsers={selectedUsers}
                                    sendForm={sendForm}
                                    isLoading={isLoading}
                                    onSearch={handleUserSearch}
                                    onPageChange={handleUsersPageChange}
                                    onSelectUser={handleSelectUser}
                                    onSelectAll={handleSelectAllUsers}
                                    onRemoveUser={handleRemoveUser}
                                    onClearSelected={handleClearSelectedUsers}
                                    onFormChange={handleSendFormChange}
                                    onSend={handleSendPush}
                                    onSendToAll={handleSendToAll}
                                />
                            )}
                        </div>
                    </Tabs>
                </DialogContent>
            </Dialog>

            <TemplateForm
                isOpen={isTemplateModalOpen}
                onClose={() => {
                    setIsTemplateModalOpen(false);
                    setEditingTemplate(null);
                }}
                template={editingTemplate}
                onSave={handleSaveTemplate}
                isLoading={isLoading}
            />
        </>
    );
};

export default AdminPushModal;