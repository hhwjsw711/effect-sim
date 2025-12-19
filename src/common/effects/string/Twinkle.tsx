import type { StringLedDataApi } from "../../../data/StringLedDataModel";
import { stringEffectDefinitions } from "../stringEffectDefinitions";
import type { z } from "zod";
import { useMemo } from "react";
import { useEffectContext, useEffectFrame } from "../EffectProvider";

interface TwinkleLedData {
  shouldApply: boolean;
  offset: number;
}

export function Twinkle({
  string,
  props = stringEffectDefinitions.twinkle.defaultProps,
}: {
  string: StringLedDataApi;
  props?: z.infer<typeof stringEffectDefinitions.twinkle.props>;
}) {
  const model = useEffectContext();

  // Pre-compute which LEDs twinkle and their offsets
  const ledData = useMemo(() => {
    const data: TwinkleLedData[] = [];
    for (let i = 0; i < string.ledCount; i++) {
      data.push({
        shouldApply: Math.random() < props.ratioOfLedsToApplyTo,
        offset: Math.random(),
      });
    }
    return data;
  }, [string.ledCount, props.ratioOfLedsToApplyTo, model.loopCount]);

  useEffectFrame(() => {
    const adjustedRatio = (model.effectPlaybackRatio * props.speed) % 1;

    for (let i = 0; i < string.ledCount; i++) {
      const led = ledData[i];
      if (!led.shouldApply) continue;

      const ledRatio = (adjustedRatio + led.offset) % 1;
      const twinkleRatio = Math.sin(ledRatio * Math.PI * 2) * 0.5 + 0.5;

      const r = Math.round(
        props.fromColor[0] +
          (props.toColor[0] - props.fromColor[0]) * twinkleRatio,
      );
      const g = Math.round(
        props.fromColor[1] +
          (props.toColor[1] - props.fromColor[1]) * twinkleRatio,
      );
      const b = Math.round(
        props.fromColor[2] +
          (props.toColor[2] - props.fromColor[2]) * twinkleRatio,
      );

      string.setPixel(i, r, g, b);
    }
  });

  return null;
}
