/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo } from "react";
import { AppModel, type SelectedEntity } from "./models/AppModel";

const AppContext = createContext<AppModel | null>(null);

const persistKey = "app-data";

export function AppProvider({ children }: { children: ReactNode }) {
  const appModel = useMemo(() => {
    const persistedData = localStorage.getItem(persistKey);
    return new AppModel();
  }, []);

  return <AppContext.Provider value={appModel}>{children}</AppContext.Provider>;
}

export function useApp(): AppModel {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
