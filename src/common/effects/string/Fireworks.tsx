import type { StringLedDataApi } from "../../../data/StringLedDataModel";
import { stringEffectDefinitions } from "../stringEffectDefinitions";
import type { z } from "zod";
import { useMemo } from "react";
import { useEffectContext, useEffectFrame } from "../EffectProvider";

// Vibrant firework colors
const fireworkColors = [
  [255, 50, 50], // Red
  [50, 255, 50], // Green
  [50, 100, 255], // Blue
  [255, 255, 50], // Yellow
  [255, 50, 255], // Magenta
  [50, 255, 255], // Cyan
  [255, 150, 50], // Orange
  [255, 255, 255], // White
] as const;

interface Particle {
  velocity: number; // Speed and direction (-1 to 1)
  decay: number; // How fast it fades
}

interface FireworkData {
  id: number;
  startTime: number;
  centerPos: number; // 0 to 1
  color: readonly [number, number, number];
  particles: Particle[];
  duration: number;
}

export function Fireworks({
  string,
  props = stringEffectDefinitions.fireworks.defaultProps,
}: {
  string: StringLedDataApi;
  props?: z.infer<typeof stringEffectDefinitions.fireworks.props>;
}) {
  const model = useEffectContext();

  // Pre-calculate fireworks for this loop
  const fireworks = useMemo(() => {
    const data: FireworkData[] = [];

    // Determine number of fireworks based on frequency (arbitrary scale)
    const count = Math.max(1, Math.round(props.frequency * 10));

    for (let i = 0; i < count; i++) {
      // Random properties
      const startTime = Math.random() * 0.9; // Don't start too late
      const centerPos = 0.1 + Math.random() * 0.8; // Keep away from edges
      const colorIdx = Math.floor(Math.random() * fireworkColors.length);
      const color = fireworkColors[colorIdx];
      const duration = 0.5 + Math.random() * 0.5; // 0.5s to 1.0s equivalent scale

      // Generate particles
      const numParticles = Math.floor(5 + Math.random() * 10);
      const particles: Particle[] = [];

      for (let p = 0; p < numParticles; p++) {
        // Particles burst outward with varying speeds
        const speed = (0.2 + Math.random() * 0.8) * props.size;
        // Direction is either left (-1) or right (1)
        const direction = Math.random() > 0.5 ? 1 : -1;

        particles.push({
          velocity: speed * direction,
          decay: 0.5 + Math.random() * 1.5,
        });
      }

      data.push({
        id: i,
        startTime,
        centerPos,
        color,
        particles,
        duration,
      });
    }

    return data.sort((a, b) => a.startTime - b.startTime);
  }, [props.frequency, props.size, model.loopCount]);

  useEffectFrame(() => {
    const currentTime = model.effectPlaybackRatio * props.speed;

    for (const fw of fireworks) {
      // Check if firework is active
      if (currentTime < fw.startTime) continue;

      const timeSinceStart =
        (currentTime - fw.startTime) * (1 / props.speed); // Normalize to roughly seconds-ish relative to speed
      if (timeSinceStart > fw.duration) continue;

      const progress = timeSinceStart / fw.duration; // 0 to 1

      // Helper to add color to pixel
      const addColor = (
        index: number,
        r: number,
        g: number,
        b: number,
        a: number,
      ) => {
        if (index < 0 || index >= string.ledCount) return;
        const [cr, cg, cb] = string.getPixel(index);
        string.setPixel(
          index,
          Math.min(255, cr + r * a),
          Math.min(255, cg + g * a),
          Math.min(255, cb + b * a),
        );
      };

      // Flash at the center at the start (explosion)
      if (progress < 0.1) {
        const flashIndex = Math.floor(fw.centerPos * string.ledCount);
        const flashBright = 1 - progress / 0.1;
        addColor(flashIndex, 255, 255, 255, flashBright * props.intensity);
      }

      // Calculate particles
      for (const p of fw.particles) {
        // Physics: dist = velocity * time * (friction^time)
        // Simple easeOut: velocity * time * (1 - progress)
        const expansion = p.velocity * progress * (1 - progress * 0.5);

        const pos01 = fw.centerPos + expansion;
        if (pos01 < 0 || pos01 >= 1) continue;

        const ledIndex = Math.floor(pos01 * string.ledCount);

        // Brightness fades over time
        // Also flickers slightly for sparkle effect
        const flicker = 0.8 + Math.random() * 0.2;
        const brightness =
          (1 - Math.pow(progress, p.decay)) * props.intensity * flicker;

        if (brightness > 0.01) {
          addColor(
            ledIndex,
            fw.color[0],
            fw.color[1],
            fw.color[2],
            brightness,
          );
        }
      }
    }
  });

  return null;
}



