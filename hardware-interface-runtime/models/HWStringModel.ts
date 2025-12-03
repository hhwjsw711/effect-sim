import { makeAutoObservable } from "mobx";
import { StringNodeModel } from "../../shared/models/StringNodeModel";
import { HWIRAppModel } from "./HWIRAppModel";
import { Signal } from "../../shared/Signal";
import { WLEDDDPConnectionModel } from "./WLED_DDPModel";

export class HWStringModel {
  readonly onData = new Signal<Uint8Array>();
  _client: WLEDDDPConnectionModel | null = null;

  constructor(
    public readonly app: HWIRAppModel,
    public readonly string: StringNodeModel,
  ) {
    makeAutoObservable(this, {
      onData: false,
      _client: false,
    });
  }

  get client(): WLEDDDPConnectionModel | null {
    if (this._client) this._client.close();
    const host = this.string.ipAddress;
    const port = this.string.port;
    const name = this.string.name;
    this._client = new WLEDDDPConnectionModel(host, port);
    this._client
      .connect()
      .then(() => {
        console.log(`Connected to WLED at ${host}:${port} as '${name}'`);
      })
      .catch((e) => {
        console.error(
          `Error connecting to WLED '${name}' at ${host}:${port}`,
          e,
        );
      });
    return this._client;
  }
}
