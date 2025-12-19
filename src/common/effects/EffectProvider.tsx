import { createContext, useContext, useEffect } from "react";
import { autorun } from "mobx";
import { SequenceRuntimeEffectModel } from "../../sequencer/runtime/SequenceRuntimeEffectModel";

export const EffectContext = createContext<SequenceRuntimeEffectModel | null>(
  null,
);

export function useEffectContext(): SequenceRuntimeEffectModel {
  const ctx = useContext(EffectContext);
  if (!ctx)
    throw new Error("useEffectContext must be used within EffectProvider");
  return ctx;
}

export function useEffectFrame(handler: (frame: number) => void): void {
  const model = useEffectContext();

  useEffect(
    () =>
      autorun(() => {
        handler(model.effectFrame);
      }),
    [model, handler],
  );
}
