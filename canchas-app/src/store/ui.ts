import { create } from "zustand";

type View = "buscar" | "jugar" | "torneos" | "admin";

interface UIState {
  view: View;
  setView: (v: View) => void;
  userPos: { lat: number; lng: number } | null;
  setUserPos: (p: { lat: number; lng: number } | null) => void;
  toast: { msg: string; warn?: boolean } | null;
  showToast: (msg: string, warn?: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  view: "buscar",
  setView: (view) => set({ view }),
  userPos: null,
  setUserPos: (userPos) => set({ userPos }),
  toast: null,
  showToast: (msg, warn) => {
    set({ toast: { msg, warn } });
    setTimeout(() => set({ toast: null }), 3000);
  },
}));
