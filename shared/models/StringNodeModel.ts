import { makeAutoObservable } from "mobx";
import type { PathPoint } from "./types";
import type { Icon } from "./types";
import { ProjectModel } from "./ProjectModel";
import { NodeDocOfKind } from "../../convex/schema";
import { exposeDocFields } from "./modelUtils";

export interface StringNodeModel extends NodeDocOfKind<"string"> {}

export class StringNodeModel {
  constructor(
    public doc: NodeDocOfKind<"string">,
    public readonly project: ProjectModel,
  ) {
    makeAutoObservable(this);
    exposeDocFields(this);
  }

  setName(name: string) {
    this.name = name;
  }

  setIcon(icon: Icon) {
    this.icon = icon;
  }

  setSpacingMeters(spacingMeters: number) {
    this.spacingMeters = spacingMeters;
  }

  setLedCount(ledCount: number) {
    this.ledCount = ledCount;
  }

  setIpAddress(ipAddress: string) {
    this.ipAddress = ipAddress;
  }

  setPort(port: number) {
    this.port = port;
  }

  setBrightness(brightness: number) {
    this.brightness = brightness;
  }

  setPathPoints(pathPoints: PathPoint[]) {
    this.pathPoints = pathPoints;
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
    if (name !== undefined) this.name = name;
    if (icon !== undefined) this.icon = icon;
    if (spacingMeters !== undefined) this.spacingMeters = spacingMeters;
    if (ledCount !== undefined) this.ledCount = ledCount;
    if (ipAddress !== undefined) this.ipAddress = ipAddress;
    if (port !== undefined) this.port = port;
    if (brightness !== undefined) this.brightness = brightness;
    if (pathPoints !== undefined) this.pathPoints = pathPoints;
  }

  remove() {
    if (!this.project) return;
    this.project.removeNode(this);
  }
}
