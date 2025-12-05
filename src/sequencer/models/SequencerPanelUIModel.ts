import { makeAutoObservable, runInAction } from "mobx";
import type { AppModel } from "../../common/models/AppModel";
import { SequenceUIModel } from "./SequenceUIModel";
import { SequenceModel } from "../../../shared/models/sequencer/SequenceModel";
import { Id } from "../../../convex/_generated/dataModel";

export class SequencerPanelUIModel {
  selectedSequence: SequenceModel | null = null;

  constructor(
    public readonly app: AppModel,
    public readonly id: string,
  ) {
    makeAutoObservable(this);

    const persistedData = app.persistedData.sequencers?.[id];
    if (persistedData?.selectedSequenceId)
      this.selectedSequence =
        app.project?.findSequenceById(persistedData.selectedSequenceId) ?? null;
  }

  get sequence() {
    if (!this.selectedSequence) return null;
    return new SequenceUIModel(this, this.selectedSequence);
  }

  setSelectedSequence(sequence: SequenceModel | Id<"sequences"> | null) {
    runInAction(() => {
      if (typeof sequence === "string")
        this.selectedSequence =
          this.app.project?.findSequenceById(sequence) ?? null;
      else this.selectedSequence = sequence;
    });
  }

  selectFirstSequence() {
    if (!this.app.project) return;
    if (this.app.project.sequences.length === 0) return;
    this.setSelectedSequence(this.app.project.sequences[0] ?? null);
  }
}
