import { makeAutoObservable } from "mobx";
import type { PathPoint } from "./types";
import type { Icon } from "./types";
import { ProjectModel } from "./ProjectModel";
import { NodeDocOfKind } from "../../convex/schema";
import { exposeDocFields } from "./modelUtils";

export interface StringNodeModel extends Readonly<NodeDocOfKind<"string">> {}

export class StringNodeModel {
  constructor(
    public doc: NodeDocOfKind<"string">,
    public readonly project: ProjectModel,
  ) {
    exposeDocFields(this);
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.doc.name = name;
  }

  setIcon(icon: Icon) {
    this.doc.icon = icon;
  }

  setSpacingMeters(spacingMeters: number) {
    this.doc.spacingMeters = spacingMeters;
  }

  setLedCount(ledCount: number) {
    this.doc.ledCount = ledCount;
  }

  setIpAddress(ipAddress: string) {
    this.doc.ipAddress = ipAddress;
  }

  setPort(port: number) {
    this.doc.port = port;
  }

  setBrightness(brightness: number) {
    this.doc.brightness = brightness;
  }

  setPathPoints(pathPoints: PathPoint[]) {
    this.doc.pathPoints = pathPoints;
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
    const doc = this.doc;
    if (name !== undefined) doc.name = name;
    if (icon !== undefined) doc.icon = icon;
    if (spacingMeters !== undefined) doc.spacingMeters = spacingMeters;
    if (ledCount !== undefined) doc.ledCount = ledCount;
    if (ipAddress !== undefined) doc.ipAddress = ipAddress;
    if (port !== undefined) doc.port = port;
    if (brightness !== undefined) doc.brightness = brightness;
    if (pathPoints !== undefined) doc.pathPoints = pathPoints;
  }

  remove() {
    if (!this.project) return;
    this.project.removeNode(this);
  }
}
