import type { StringLedDataApi } from "../../../data/StringLedDataModel";
import { stringEffectDefinitions } from "../stringEffectDefinitions";
import type { z } from "zod";
import { useEffectFrame } from "../EffectProvider";

export function MultiplyAll({
  string,
  props = stringEffectDefinitions.multiplyAll.defaultProps,
}: {
  string: StringLedDataApi;
  props?: z.infer<typeof stringEffectDefinitions.multiplyAll.props>;
}) {
  useEffectFrame(() => {
    string.multiplyAll(props.multiplier);
  });

  return null; // This is a headless component that just runs the effect
}
