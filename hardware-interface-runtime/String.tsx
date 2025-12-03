import { useEffect, useState, startTransition } from "react";
import { WLEDDDPConnectionModel } from "./models/WLED_DDPModel";
import { HWStringModel } from "./models/HWStringModel";
import { autorun, reaction } from "mobx";

export const String = ({ model }: { model: HWStringModel }) => {
  useEffect(() => {
    if (!model.client) return;

    const unlistenToData = model.onData.add((rgb) => {
      if (model.client?.status != "connected") return;
      console.log(
        `Sending '${rgb.length}' bytes data to '${model.string.name}'`,
      );
      model.client.send(rgb).catch(() => {
        console.error(
          `Error sending packet of ${rgb.length} bytes to '${model.string.name}'`,
        );
      });
    });

    const unlistenToBrightness = reaction(
      () => model.string.brightness,
      (brightness) => {
        if (model.client?.status != "connected") return;
        model.client.setBrightness(brightness).catch(() => {
          console.error(
            `Error setting brightness to ${brightness} for '${model.string.name}'`,
          );
        });
      },
    );

    return () => {
      unlistenToData();
      unlistenToBrightness();
      model.client?.close().catch(() => {
        console.error(`Error closing connection to '${model.string.name}'`);
      });
    };
  }, [model.client]);

  return null;
};
