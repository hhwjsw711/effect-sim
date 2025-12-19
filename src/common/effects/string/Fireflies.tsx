import type { StringLedDataApi } from "../../../data/StringLedDataModel";
import { stringEffectDefinitions } from "../stringEffectDefinitions";
import type { z } from "zod";
import { useMemo } from "react";
import { useEffectContext, useEffectFrame } from "../EffectProvider";

interface FireflyData {
  travelDistance: number;
  spawnPosition: number;
  phase1: number;
  phase2: number;
  phase3: number;
  freq1: number;
  freq2: number;
  freq3: number;
}

export function Fireflies({
  string,
  props = stringEffectDefinitions.fireflies.defaultProps,
}: {
  string: StringLedDataApi;
  props?: z.infer<typeof stringEffectDefinitions.fireflies.props>;
}) {
  const model = useEffectContext();

  const firefliesData = useMemo(() => {
    const data: FireflyData[] = [];

    for (let f = 0; f < props.numFireflies; f++) {
      data.push({
        travelDistance:
          props.minTravelDistance +
          Math.random() * (props.maxTravelDistance - props.minTravelDistance),
        spawnPosition: Math.random(),
        phase1: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        phase3: Math.random() * Math.PI * 2,
        freq1: Math.floor(Math.random() * 2) + 1,
        freq2: Math.floor(Math.random() * 2) + 2,
        freq3: Math.floor(Math.random() * 3) + 3,
      });
    }

    return data;
  }, [
    props.numFireflies,
    props.minTravelDistance,
    props.maxTravelDistance,
    model.loopCount,
  ]);

  useEffectFrame(() => {
    if (props.fadeRatio !== 1) string.multiplyAll(props.fadeRatio);

    const adjustedRatio = (model.effectPlaybackRatio * props.speed) % 1;
    const time = adjustedRatio * Math.PI * 2;

    for (let f = 0; f < firefliesData.length; f++) {
      const firefly = firefliesData[f];

      // Create multiple overlapping sine waves with different frequencies
      const wave1 = Math.sin(time * firefly.freq1 + firefly.phase1) * 0.5;
      const wave2 = Math.sin(time * firefly.freq2 + firefly.phase2) * 0.3;
      const wave3 = Math.sin(time * firefly.freq3 + firefly.phase3) * 0.2;

      // Combine all waves (weighted average)
      const combinedOffset = wave1 + wave2 + wave3;

      // Apply the wiggle offset to the spawn position, scaled by travel distance
      const normalizedPos =
        firefly.spawnPosition +
        combinedOffset * (firefly.travelDistance * 0.5);

      // Clamp to valid range and map to LED position
      const clampedPos = Math.max(0, Math.min(1, normalizedPos));
      const ledPosition = clampedPos * (string.ledCount - 1);
      const centerIndex = Math.floor(ledPosition);

      // Add brightness falloff for smooth particle appearance
      const falloffRadius = 2;
      for (let i = -falloffRadius; i <= falloffRadius; i++) {
        const ledIndex = centerIndex + i;
        if (ledIndex < 0 || ledIndex >= string.ledCount) continue;

        const distance = Math.abs(ledPosition - ledIndex);
        const brightness = Math.max(0, 1 - distance / (falloffRadius + 1));

        if (brightness > 0) {
          const [currentR, currentG, currentB] = string.getPixel(ledIndex);
          const r = Math.min(
            255,
            currentR + Math.round(props.color[0] * brightness),
          );
          const g = Math.min(
            255,
            currentG + Math.round(props.color[1] * brightness),
          );
          const b = Math.min(
            255,
            currentB + Math.round(props.color[2] * brightness),
          );

          string.setPixel(ledIndex, r, g, b);
        }
      }
    }
  });

  return null;
}
