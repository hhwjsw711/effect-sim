import type { StringLedDataApi } from "../../../data/StringLedDataModel";
import { stringEffectDefinitions } from "../stringEffectDefinitions";
import type { z } from "zod";
import { useEffectFrame } from "../EffectProvider";

export function RainbowRandom({
  string,
  props = stringEffectDefinitions.rainbowRandom.defaultProps,
}: {
  string: StringLedDataApi;
  props?: z.infer<typeof stringEffectDefinitions.rainbowRandom.props>;
}) {
  useEffectFrame((frame) => {
    const framesPerUpdate = Math.max(1, Math.floor(props.delayMs / 16));
    if (frame % framesPerUpdate !== 0) return;
    for (let i = 0; i < string.ledCount; i++) {
      string.setPixel(
        i,
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      );
    }
  });

  return null;
}
