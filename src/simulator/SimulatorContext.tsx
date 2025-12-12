import { createContext, useContext } from "react";
import { SimulatorUIModel } from "./models/SimulatorUIModel";

export const SimulatorContext = createContext<SimulatorUIModel | null>(null);

export function useSimulator(): SimulatorUIModel {
  const ctx = useContext(SimulatorContext);
  if (!ctx)
    throw new Error("useSimulator must be used within SimulatorProvider");
  return ctx;
}
