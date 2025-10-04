"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Store } from "@/types/database";

interface StoreContextType {
  currentStore: Store | null;
  setCurrentStore: (store: Store | null) => void;
  clearCurrentStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORE_KEY = "sellbox_current_store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);

  // 초기화: localStorage에서 스토어 로드
  useEffect(() => {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) {
      try {
        setCurrentStoreState(JSON.parse(stored));
      } catch (error) {
        console.error("스토어 로드 실패:", error);
        localStorage.removeItem(STORE_KEY);
      }
    }
  }, []);

  const setCurrentStore = (store: Store | null) => {
    setCurrentStoreState(store);
    if (store) {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } else {
      localStorage.removeItem(STORE_KEY);
    }
  };

  const clearCurrentStore = () => {
    setCurrentStoreState(null);
    localStorage.removeItem(STORE_KEY);
  };

  return (
    <StoreContext.Provider value={{ currentStore, setCurrentStore, clearCurrentStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

