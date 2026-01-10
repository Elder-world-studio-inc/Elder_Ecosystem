"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type GuestContextValue = {
  guestId: string | null;
};

const GuestContext = createContext<GuestContextValue | undefined>(undefined);

const STORAGE_KEY = "omnivael_guest_id";

function createGuestId() {
  const random = Math.random().toString(16).slice(2);
  const time = Date.now().toString(16);
  return `guest_${time}_${random}`;
}

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guestId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const next = createGuestId();
    window.localStorage.setItem(STORAGE_KEY, next);
    return next;
  });

  return <GuestContext.Provider value={{ guestId }}>{children}</GuestContext.Provider>;
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) {
    throw new Error("useGuest must be used within GuestProvider");
  }
  return ctx;
}
