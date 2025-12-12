import { makeAutoObservable } from "mobx";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { SequenceModel } from "./sequencer/SequenceModel";
import { ensure } from "../ensure";
import { ProjectModel } from "./ProjectModel";
import { exposeDocFields } from "./modelUtils";

export interface PlaylistModel extends Readonly<Doc<"playlists">> {}

export class PlaylistModel {
  constructor(
    public doc: Doc<"playlists">,
    public readonly project?: ProjectModel,
  ) {
    exposeDocFields(this);
    makeAutoObservable(this);
  }

  get sequences(): SequenceModel[] {
    return this.doc.sequenceIds
      .map((id) => this.project?.sequences?.find((seq) => seq._id === id))
      .filter((seq): seq is SequenceModel => Boolean(seq));
  }

  get availableSequences(): SequenceModel[] {
    if (!this.project?.sequences) return [];
    return this.project.sequences.filter(
      (seq) => seq.projectId === this.projectId,
    );
  }

  get sequencesNotOnPlaylist(): SequenceModel[] {
    if (!this.project?.sequences) return [];
    return this.project.sequences.filter(
      (seq) =>
        seq.projectId === this.projectId &&
        !this.doc.sequenceIds.includes(seq._id),
    );
  }

  setName(name: string) {
    this.doc.name = name;
  }

  remove() {
    this.project?.removePlaylist(this);
  }

  addSequence(sequenceOrId: SequenceModel | Id<"sequences">) {
    const sequenceId =
      typeof sequenceOrId === "string" ? sequenceOrId : sequenceOrId._id;
    this.doc.sequenceIds.push(sequenceId);
  }

  removeSequence(sequenceId: Id<"sequences">) {
    const index = this.doc.sequenceIds.indexOf(sequenceId);
    if (index >= 0) this.doc.sequenceIds.splice(index, 1);
  }

  removeSequenceByIndex(index: number) {
    if (index >= 0 && index < this.doc.sequenceIds.length) {
      this.doc.sequenceIds.splice(index, 1);
    }
  }

  reorderSequences(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return;
    if (oldIndex < 0 || oldIndex >= this.doc.sequenceIds.length) return;
    if (newIndex < 0 || newIndex >= this.doc.sequenceIds.length) return;

    const [movedItem] = this.doc.sequenceIds.splice(oldIndex, 1);
    this.doc.sequenceIds.splice(newIndex, 0, movedItem);
  }
}
