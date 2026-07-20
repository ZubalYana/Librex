import { create } from "zustand";

type AlertType = "success" | "error" | "info";

type Alert = {
  type: AlertType;
  text: string;
};

type AlertState = {
  alert: Alert | null;
  setAlert: (type: AlertType, text: string) => void;
  clearAlert: () => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  alert: null,
  setAlert: (type, text) => {
    set({ alert: { type, text } });
    setTimeout(() => set({ alert: null }), 4000);
  },
  clearAlert: () => set({ alert: null }),
}));