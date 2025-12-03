import type { ReactNode } from "react";
import { FixedFrameProvider } from "./FixedFrameProvider";
import { useApp } from "./AppContext";
import { DEFAULT_FRAMERATE } from "./projects/projectConstants";

export function ProjectFixedFrameProvider({
  children,
}: {
  children: ReactNode;
}) {
  const app = useApp();
  const project = app.project;

  const framerate = project?.settings.defaultFramerate ?? DEFAULT_FRAMERATE;
  const frameMs = 1000 / framerate;

  return <FixedFrameProvider frameMs={frameMs}>{children}</FixedFrameProvider>;
}
