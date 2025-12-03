/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Model } from "flexlayout-react";
import { useApp } from "./AppContext";
import {
  INSPECTOR_TAB_ID,
  STRINGS_TAB_ID,
  SEQUENCER_TAB_ID,
  PLAYLISTS_TAB_ID,
} from "./models/FlexLayoutModel";

type FlexLayoutContextType = {
  model: Model;
  onModelChange: (model: Model) => void;
  resetLayout: () => void;
  showInspector: () => void;
  showSequencer: () => void;
  showPlaylists: () => void;
};

const FlexLayoutContext = createContext<FlexLayoutContextType | null>(null);

export function FlexLayoutProvider({ children }: { children: ReactNode }) {
  const app = useApp();
  const flexLayout = app.flexLayout;

  return (
    <FlexLayoutContext.Provider
      value={{
        model: flexLayout.model,
        onModelChange: (nextModel) => flexLayout.setModel(nextModel),
        resetLayout: () => flexLayout.resetLayout(),
        showInspector: () => flexLayout.showInspector(),
        showSequencer: () => flexLayout.showSequencer(),
        showPlaylists: () => flexLayout.showPlaylists(),
      }}
    >
      {children}
    </FlexLayoutContext.Provider>
  );
}

export function useFlexLayout(): FlexLayoutContextType {
  const context = useContext(FlexLayoutContext);
  if (!context)
    throw new Error("useFlexLayout must be used within a FlexLayoutProvider");

  return context;
}
