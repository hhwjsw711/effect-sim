import type { StringLedDataApi } from "../../../data/StringLedDataModel";
import { stringEffectDefinitions } from "../stringEffectDefinitions";
import type { z } from "zod";
import { useEffectFrame } from "../EffectProvider";

export function SetColor({
  string,
  props = stringEffectDefinitions.setColor.defaultProps,
}: {
  string: StringLedDataApi;
  props?: z.infer<typeof stringEffectDefinitions.setColor.props>;
}) {
  useEffectFrame(() => {
    string.setAllPixels(props.color[0], props.color[1], props.color[2]);
  });

  return null;
}
