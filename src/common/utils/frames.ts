import { useEffect } from "react";
import { useFrameContext } from "../FixedFrameProvider";

export type FrameCallback = () => void;

export function useFrame(callback: FrameCallback, deps?: unknown[]) {
  const { signal } = useFrameContext();
  useEffect(() => signal.add(callback), [signal, callback, ...(deps ?? [])]);
}
