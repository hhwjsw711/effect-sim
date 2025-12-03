/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo } from "react";
import { AppModel, type SelectedEntity } from "./models/AppModel";

const AppContext = createContext<AppModel | null>(null);

export function AppProvider({
  children,
  flexLayoutStorageKey = "flexlayout:model:v1",
}: {
  children: ReactNode;
  flexLayoutStorageKey?: string;
}) {
  const appModel = useMemo(
    () => new AppModel(flexLayoutStorageKey),
    [flexLayoutStorageKey],
  );
  return <AppContext.Provider value={appModel}>{children}</AppContext.Provider>;
}

export function useApp(): AppModel {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
