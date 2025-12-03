import { makeAutoObservable } from "mobx";
import type { IJsonModel } from "flexlayout-react";
import { Model, Actions, DockLocation } from "flexlayout-react";
import { defaultLayoutJson } from "../tabs";

export const INSPECTOR_TAB_ID = "tab-inspector";
export const STRINGS_TAB_ID = "tab-strings";
export const SEQUENCER_TAB_ID = "tab-sequencer";
export const PLAYLISTS_TAB_ID = "tab-playlists";

export class FlexLayoutModel {
  model: Model;
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.model = this.loadModel();
    makeAutoObservable(this, {
      model: false, // Model is not observable, we'll update it via setModel
    });
  }

  private loadModel(): Model {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as IJsonModel;
        return Model.fromJson(parsed);
      }
    } catch (err) {
      console.warn("Failed to load saved layout, using default", err);
    }
    return Model.fromJson(defaultLayoutJson);
  }

  setModel(nextModel: Model) {
    this.model = nextModel;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(nextModel.toJson()));
    } catch (err) {
      console.warn("Failed to persist layout", err);
    }
  }

  resetLayout() {
    const fresh = Model.fromJson(defaultLayoutJson);
    this.setModel(fresh);
  }

  showInspector() {
    const inspectorTab = this.model.getNodeById(INSPECTOR_TAB_ID);
    if (inspectorTab)
      return this.model.doAction(Actions.selectTab(INSPECTOR_TAB_ID));

    const editorTabset = this.model.getNodeById(STRINGS_TAB_ID)?.getParent();
    if (!editorTabset) return;

    this.model.doAction(
      Actions.addNode(
        {
          type: "tab",
          name: "Inspector",
          id: INSPECTOR_TAB_ID,
          component: "inspector",
          enableClose: true,
        },
        editorTabset.getId(),
        DockLocation.BOTTOM,
        1,
      ),
    );
  }

  showSequencer() {
    const existing = this.model.getNodeById(SEQUENCER_TAB_ID);
    if (existing)
      return this.model.doAction(Actions.selectTab(SEQUENCER_TAB_ID));

    this.model.doAction(
      Actions.addNode(
        {
          type: "tab",
          name: "Sequencer",
          id: SEQUENCER_TAB_ID,
          component: "sequencer",
          enableClose: true,
        },
        this.model.getRoot().getId(),
        DockLocation.BOTTOM,
        1,
      ),
    );
  }

  showPlaylists() {
    const existing = this.model.getNodeById(PLAYLISTS_TAB_ID);
    if (existing)
      return this.model.doAction(Actions.selectTab(PLAYLISTS_TAB_ID));

    const nodesTab = this.model.getNodeById("tab-nodes");
    const nodesTabset = nodesTab?.getParent();

    if (!nodesTabset) return;

    this.model.doAction(
      Actions.addNode(
        {
          type: "tab",
          name: "Playlists",
          id: PLAYLISTS_TAB_ID,
          component: "playlists",
          enableClose: true,
        },
        nodesTabset.getId(),
        DockLocation.CENTER,
        -1,
      ),
    );
  }
}
