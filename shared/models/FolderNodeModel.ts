import { makeAutoObservable } from "mobx";
import { ProjectModel } from "./ProjectModel";
import { NodeDocOfKind } from "../../convex/schema";
import { exposeDocFields } from "./modelUtils";

export interface FolderNodeModel extends Readonly<NodeDocOfKind<"folder">> {}

export class FolderNodeModel {
  constructor(
    public doc: NodeDocOfKind<"folder">,
    public readonly project?: ProjectModel,
  ) {
    makeAutoObservable(this);
    exposeDocFields(this);
  }

  setLabel(label: string) {
    this.doc.label = label;
  }

  update({ label }: { label?: string }) {
    if (label !== undefined) this.doc.label = label;
  }

  remove() {
    if (!this.project) return;
    this.project.removeNode(this);
  }
}
