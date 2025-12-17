import { makeAutoObservable } from "mobx";
import type { Segment } from "./types";
import type { Icon } from "./types";
import { ProjectModel } from "./ProjectModel";
import { NodeDocOfKind } from "../../convex/schema";
import { VirtualStringNodeSegmentModel } from "./VirtualStringNodeSegmentModel";
import { exposeDocFields } from "./modelUtils";

export interface VirtualStringNodeModel
  extends NodeDocOfKind<"virtual_string"> {}

export class VirtualStringNodeModel {
  constructor(
    public doc: NodeDocOfKind<"virtual_string">,
    public readonly project?: ProjectModel,
  ) {
    makeAutoObservable(this, {
      project: false,
    });
    exposeDocFields(this);
  }

  get segmentModels(): VirtualStringNodeSegmentModel[] {
    return this.segments.map(
      (segment, index) =>
        new VirtualStringNodeSegmentModel(segment, this, index),
    );
  }

  get ledCount() {
    return this.segments.reduce(
      (total, segment) => total + (segment.toIndex - segment.fromIndex + 1),
      0,
    );
  }

  setName(name: string) {
    this.name = name;
  }

  setIcon(icon: Icon) {
    this.icon = icon;
  }

  setSegments(segments: Segment[]) {
    this.segments = segments;
  }

  update({
    name,
    icon,
    segments,
  }: {
    name?: string;
    icon?: Icon;
    segments?: Segment[];
  }) {
    if (name !== undefined) this.name = name;
    if (icon !== undefined) this.icon = icon;
    if (segments !== undefined) this.segments = segments;
  }

  remove() {
    if (!this.project) return;
    this.project.removeNode(this);
  }
}
