import { makeAutoObservable } from "mobx";
import type { Icon } from "./types";
import { ProjectModel } from "./ProjectModel";
import { NodeDocOfKind } from "../../convex/schema";
import { exposeDocFields } from "./modelUtils";

export interface SwitchNodeModel extends Readonly<NodeDocOfKind<"switch">> {}

export class SwitchNodeModel {
  constructor(
    public doc: NodeDocOfKind<"switch">,
    public readonly project: ProjectModel,
  ) {
    makeAutoObservable(this);
    exposeDocFields(this);
  }

  setName(name: string) {
    this.doc.name = name;
  }

  setIcon(icon: Icon) {
    this.doc.icon = icon;
  }

  setIpAddress(ipAddress: string) {
    this.doc.ipAddress = ipAddress;
  }

  setApiType(apiType: "athom_type1" | "athom_type2") {
    this.doc.apiType = apiType;
  }

  setStatus(isOn: boolean | null) {
    this.doc.isOn = isOn;
  }

  update({
    name,
    icon,
    ipAddress,
    apiType,
  }: {
    name?: string;
    icon?: Icon;
    ipAddress?: string;
    apiType?: "athom_type1" | "athom_type2";
  }) {
    const doc = this.doc;
    if (name !== undefined) doc.name = name;
    if (icon !== undefined) doc.icon = icon;
    if (ipAddress !== undefined) doc.ipAddress = ipAddress;
    if (apiType !== undefined) doc.apiType = apiType;
  }

  remove() {
    if (!this.project) return;
    this.project.removeNode(this);
  }

  get baseUrl() {
    const ip = this.ipAddress;
    const type = this.apiType ?? "athom_type1";
    if (type === "athom_type2") return `http://${ip}/switch/switch`;
    return `http://${ip}/switch/smart_plug_v2`;
  }

  async turnOn() {
    if (import.meta.env.VITE_IS_DEV_MODE) {
      this.setStatus(true);
      return;
    }

    const url = `${this.baseUrl}/turn_on`;

    const response = await fetch(url, { method: "POST" });

    if (!response.ok)
      throw new Error(
        `Failed to turn on switch at ${this.doc.ipAddress}: ${response.statusText}`,
      );

    this.setStatus(true);
  }

  async turnOff() {
    if (import.meta.env.VITE_IS_DEV_MODE) {
      this.setStatus(false);
      return;
    }

    const url = `${this.baseUrl}/turn_off`;

    const response = await fetch(url, { method: "POST" });

    if (!response.ok)
      throw new Error(
        `Failed to turn off switch at ${this.doc.ipAddress}: ${response.statusText}`,
      );

    this.setStatus(false);
  }

  async toggle() {
    const newState = this.doc.isOn === null ? true : !this.doc.isOn;

    if (import.meta.env.VITE_IS_DEV_MODE) {
      this.setStatus(newState);
      return;
    }

    const url = `${this.baseUrl}/toggle`;

    const response = await fetch(url, { method: "POST" });

    if (!response.ok)
      throw new Error(
        `Failed to toggle switch at ${this.doc.ipAddress}: ${response.statusText}`,
      );

    this.setStatus(newState);
  }

  async refreshStatus() {
    if (import.meta.env.VITE_IS_DEV_MODE)
      // In dev mode, don't fetch - just keep current status
      return;

    // For type2, assuming /switch/switch/ or similar returns JSON with state
    // This might need adjustment if type2 has a different status endpoint
    const url = `${this.baseUrl}/`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok)
      throw new Error(
        `Failed to refresh switch status at ${this.doc.ipAddress}: ${response.statusText}`,
      );

    const data = await response.json();
    const isOn = data?.state === "on" || data?.on === true;

    this.setStatus(isOn);
  }
}
