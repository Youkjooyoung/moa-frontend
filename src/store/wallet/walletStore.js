import { create } from 'zustand';
import { getMyAccount, getMyCard } from '@/api/userApi';
import { getMyDeposits } from '@/api/depositApi';

export const useWalletStore = create((set) => ({
    deposits: [],
    account: null,
    card: null,
    loading: false,
    error: null,

    loadWalletData: async () => {
        set({ loading: true, error: null });
        try {
            const [depositsRes, accountRes, cardRes] = await Promise.all([
                getMyDeposits().catch(() => ({ data: [] })),
                getMyAccount().catch(() => ({ data: null })),
                getMyCard().catch(() => ({ data: null })),
            ]);

            set({
                deposits: depositsRes?.data || [],
                account: accountRes?.data || null,
                card: cardRes?.data || null
            });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // Total Deposit Selector Helper
    getTotalDeposit: () => {
        // access state via get() if needed, but this is a hook store.
        // Consumers can derive this: deposits.reduce(...)
        return 0;
    }
}));
