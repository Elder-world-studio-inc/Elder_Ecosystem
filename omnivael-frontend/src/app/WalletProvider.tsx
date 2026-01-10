"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useGuest } from "./GuestProvider";

type WalletContextValue = {
  balance: number;
  addShards: (amount: number) => void;
  spendShards: (amount: number) => boolean;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const STORAGE_KEY = "omnivael_shard_balance";

export function WalletProvider({ children }: { children: ReactNode }) {
  const { guestId } = useGuest();
  const { status } = useSession();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const gid =
      window.localStorage.getItem("omnivael_guest_id") ??
      guestId ??
      "guest";
    const key = `${STORAGE_KEY}_${gid}`;
    const existing = window.localStorage.getItem(key);
    const initialBalance = existing ? Number.parseInt(existing, 10) || 0 : 500;
    setBalance(initialBalance);
  }, [guestId]);

  useEffect(() => {
    if (status === "authenticated") {
      const load = async () => {
        try {
          const response = await fetch("/api/wallet", { cache: "no-store" });
          if (!response.ok) return;
          const data = (await response.json()) as {
            authenticated: boolean;
            shardBalance: number;
          };
          if (data.authenticated) {
            setBalance(data.shardBalance);
          }
        } catch {
        }
      };
      void load();
    }
  }, [status, guestId]);

  useEffect(() => {
    if (status !== "unauthenticated") return;
    if (typeof window === "undefined" || !guestId) return;
    const key = `${STORAGE_KEY}_${guestId}`;
    window.localStorage.setItem(key, String(balance));
  }, [balance, guestId, status]);

  const addShards = (amount: number) => {
    setBalance((prev) => Math.max(0, prev + amount));
  };

  const spendShards = (amount: number) => {
    let success = false;
    setBalance((prev) => {
      if (prev < amount) {
        success = false;
        return prev;
      }
      success = true;
      return prev - amount;
    });
    return success;
  };

  return <WalletContext.Provider value={{ balance, addShards, spendShards }}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
