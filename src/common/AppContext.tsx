/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { AppModel } from "./models/AppModel";

const AppContext = createContext<AppModel | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const appModel = useMemo(() => new AppModel(), []);
  return (
    <AppContext.Provider key={appModel.project?._id} value={appModel}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppModel {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
