import { makeAutoObservable } from "mobx";
import type { PathPoint, Icon } from "./types";
import { ProjectModel } from "./ProjectModel";
import { NodeDocOfKind } from "../../convex/schema";
import { exposeDocFields, WithAutoSetters } from "./modelUtils";

export interface StringNodeModel
  extends WithAutoSetters<NodeDocOfKind<"string">> {}

export class StringNodeModel {
  constructor(
    public doc: NodeDocOfKind<"string">,
    public readonly project: ProjectModel,
  ) {
    makeAutoObservable(this);
    exposeDocFields(this);
  }

  update({
    name,
    icon,
    spacingMeters,
    ledCount,
    ipAddress,
    port,
    brightness,
    pathPoints,
  }: {
    name?: string;
    icon?: Icon;
    spacingMeters?: number;
    ledCount?: number;
    ipAddress?: string;
    port?: number;
    brightness?: number;
    pathPoints?: PathPoint[];
  }) {
    if (name !== undefined) this.setName(name);
    if (icon !== undefined) this.setIcon(icon);
    if (spacingMeters !== undefined) this.setSpacingMeters(spacingMeters);
    if (ledCount !== undefined) this.setLedCount(ledCount);
    if (ipAddress !== undefined) this.setIpAddress(ipAddress);
    if (port !== undefined) this.setPort(port);
    if (brightness !== undefined) this.setBrightness(brightness);
    if (pathPoints !== undefined) this.setPathPoints(pathPoints);
  }

  remove() {
    if (!this.project) return;
    this.project.removeNode(this);
  }
}
