import { useState } from "react";
import { useWindowEvent } from "../utils/useWindowEvent";
import { getAdaptiveStep } from "../utils/numberUtils";

export function useAdaptiveStep(value: number | undefined) {
  const [isShiftHeld, setIsShiftHeld] = useState(false);

  useWindowEvent("keydown", (e) => {
    if (e.key === "Shift") setIsShiftHeld(true);
  });

  useWindowEvent("keyup", (e) => {
    if (e.key === "Shift") setIsShiftHeld(false);
  });

  // Reset on blur to avoid stuck shift state
  useWindowEvent("blur", () => {
    setIsShiftHeld(false);
  });

  const baseStep = getAdaptiveStep(value);
  return isShiftHeld ? baseStep * 5 : baseStep;
}



