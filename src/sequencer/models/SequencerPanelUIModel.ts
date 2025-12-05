import { makeAutoObservable, runInAction } from "mobx";
import type { AppModel } from "../../common/models/AppModel";
import { Id } from "../../../convex/_generated/dataModel";
import { SequenceUIModel } from "./SequenceUIModel";

export class SequencerPanelUIModel {
  selectedSequenceId: Id<"sequences"> | null = null;

  constructor(
    public readonly app: AppModel,
    public readonly id: string,
  ) {
    makeAutoObservable(this);

    const persistedData = app.persistedData.sequencers?.[id];
    if (persistedData?.selectedSequenceId)
      this.selectedSequenceId = persistedData.selectedSequenceId;
  }

  get sequence() {
    const model =
      this.app.project?.sequences.find(
        (s) => s._id === this.selectedSequenceId,
      ) ?? null;
    if (!model) return null;
    return new SequenceUIModel(this, model);
  }

  setSelectedSequenceId(sequenceId: Id<"sequences"> | null) {
    this.selectedSequenceId = sequenceId;
  }

  selectFirstSequence() {
    if (!this.app.project) return;
    if (this.app.project.sequences.length === 0) return;
    this.setSelectedSequenceId(this.app.project.sequences[0]._id ?? null);
  }
}
