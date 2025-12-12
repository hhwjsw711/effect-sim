import { makeAutoObservable } from "mobx";
import type { Segment } from "./types";
import type { Icon } from "./types";
import { ProjectModel } from "./ProjectModel";
import { NodeDocOfKind } from "../../convex/schema";
import { VirtualStringNodeSegmentModel } from "./VirtualStringNodeSegmentModel";
import { exposeDocFields } from "./modelUtils";

export interface VirtualStringNodeModel
  extends Readonly<NodeDocOfKind<"virtual_string">> {}

export class VirtualStringNodeModel {
  constructor(
    public doc: NodeDocOfKind<"virtual_string">,
    public readonly project?: ProjectModel,
  ) {
    exposeDocFields(this);
    makeAutoObservable(this, {
      project: false,
    });
  }

  get segments(): VirtualStringNodeSegmentModel[] {
    return this.doc.segments.map(
      (segment, index) =>
        new VirtualStringNodeSegmentModel(segment, this, index),
    );
  }

  get ledCount() {
    return this.doc.segments.reduce(
      (total, segment) => total + (segment.toIndex - segment.fromIndex + 1),
      0,
    );
  }

  setName(name: string) {
    this.doc.name = name;
  }

  setIcon(icon: Icon) {
    this.doc.icon = icon;
  }

  setSegments(segments: Segment[]) {
    this.doc.segments = segments;
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
    const doc = this.doc;
    if (name !== undefined) doc.name = name;
    if (icon !== undefined) doc.icon = icon;
    if (segments !== undefined) doc.segments = segments;
  }

  remove() {
    if (!this.project) return;
    this.project.removeNode(this);
  }
}
