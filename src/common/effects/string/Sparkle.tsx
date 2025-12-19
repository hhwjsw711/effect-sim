import type { StringLedDataApi } from "../../../data/StringLedDataModel";
import { stringEffectDefinitions } from "../stringEffectDefinitions";
import type { z } from "zod";
import { useEffectFrame } from "../EffectProvider";

export function Sparkle({
  string,
  props = stringEffectDefinitions.sparkle.defaultProps,
}: {
  string: StringLedDataApi;
  props?: z.infer<typeof stringEffectDefinitions.sparkle.props>;
}) {
  useEffectFrame(() => {
    for (let i = 0; i < props.sparklesPerFrame; i++) {
      const pixelIndex = Math.floor(Math.random() * string.ledCount);
      string.setPixel(
        pixelIndex,
        props.color[0],
        props.color[1],
        props.color[2],
      );
    }
  });

  return null;
}
