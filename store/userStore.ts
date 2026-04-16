import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedTryOn {
    id: string;
    imageUrl: string;
    productId: string;
    date: string;
}

interface UserState {
    wishlist: string[]; // array of product IDs
    savedTryOns: SavedTryOn[];
    recommendedSize: string | null;
    recentlyViewed: string[]; // array of product IDs
    toggleWishlist: (productId: string) => void;
    saveTryOn: (tryOn: SavedTryOn) => void;
    removeTryOn: (id: string) => void;
    setRecommendedSize: (size: string | null) => void;
    addRecentlyViewed: (productId: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            wishlist: [],
            savedTryOns: [],
            recommendedSize: null,
            recentlyViewed: [],

            toggleWishlist: (productId) => set((state) => ({
                wishlist: state.wishlist.includes(productId)
                    ? state.wishlist.filter(id => id !== productId)
                    : [...state.wishlist, productId]
            })),

            saveTryOn: (tryOn) => set((state) => ({
                savedTryOns: [tryOn, ...state.savedTryOns]
            })),

            removeTryOn: (id) => set((state) => ({
                savedTryOns: state.savedTryOns.filter(tryOn => tryOn.id !== id)
            })),

            setRecommendedSize: (size) => set({ recommendedSize: size }),

            addRecentlyViewed: (productId) => set((state) => {
                const filtered = state.recentlyViewed.filter(id => id !== productId);
                return { recentlyViewed: [productId, ...filtered].slice(0, 15) }; // Keep last 15
            }),
        }),
        {
            name: 'aura-user-storage',
        }
    )
);
