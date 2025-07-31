// /lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  watchlist: string[];
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlist: [],
      addToWatchlist: (id) =>
        set((state) => ({
          watchlist: [...new Set([...state.watchlist, id])],
        })),
      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((coinId) => coinId !== id),
        })),
    }),
    {
      name: "watchlist-storage", // key in localStorage
    }
  )
);
