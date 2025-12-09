import { create } from 'zustand';
import {
    fetchPartyList,
    fetchMyParties,
    fetchPartyDetail,
    createParty,
    joinParty,
    leaveParty,
    fetchProducts,
    updateOttAccount,
    processLeaderDeposit
} from '@/hooks/party/partyService';

export const usePartyStore = create((set, get) => ({
    parties: [],
    myParties: [],
    currentParty: null,
    products: [],
    loading: false,
    error: null,

    // Actions
    loadParties: async (params) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchPartyList(params);
            set({ parties: data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    loadMyParties: async () => {
        // Only load if not already loading to avoid race conditions if needed, 
        // but for now simple allow multiple calls or just setLoading
        // If we want to avoid global loading flicker, we might use separate loading states.
        // For simplicity, reusing global loading is fine for full page loads.
        try {
            const data = await fetchMyParties();
            set({ myParties: data || [] });
        } catch (error) {
            console.error("Failed to load my parties", error);
            // Don't set global error here to avoid breaking the main list view if just my parties fails
        }
    },

    loadPartyDetail: async (id) => {
        set({ loading: true, error: null, currentParty: null });
        try {
            const data = await fetchPartyDetail(id);
            set({ currentParty: data });
            return data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    loadProducts: async () => {
        try {
            const data = await fetchProducts();
            set({ products: data || [] });
        } catch (error) {
            console.error("Failed to load products", error);
        }
    },

    createNewParty: async (partyData) => {
        set({ loading: true });
        try {
            const data = await createParty(partyData);
            // Optionally refresh lists
            return data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Join/Leave/Update actions wrappers if needed for state updates
    joinPartyAction: async (partyId, paymentData) => {
        set({ loading: true });
        try {
            const res = await joinParty(partyId, paymentData);
            // Refresh current party
            await get().loadPartyDetail(partyId);
            // Refresh my parties
            get().loadMyParties();
            return res;
        } catch (error) {
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Clear error
    clearError: () => set({ error: null })
}));
