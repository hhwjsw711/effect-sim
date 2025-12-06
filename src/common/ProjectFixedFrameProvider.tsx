import type { ReactNode } from "react";
import { FrameProvider } from "./FixedFrameProvider";
import { useApp } from "./AppContext";
import { DEFAULT_FRAMERATE } from "./projects/projectConstants";

export function ProjectFrameProvider({ children }: { children: ReactNode }) {
  const app = useApp();
  const project = app.project;

  const fps = project?.settings.defaultFramerate ?? DEFAULT_FRAMERATE;

  return <FrameProvider fps={fps}>{children}</FrameProvider>;
}
