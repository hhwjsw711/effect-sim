import { useFrame } from "../../common/utils/frames";
import { useSequence } from "../SequencerContext";
import { useCallback } from "react";

export function SequencerPlayer() {
  const sequence = useSequence();

  const onFrame = useCallback(() => {
    if (!sequence.isPlaying) return;
    sequence.runtime.playhead.stepForwards();

    if (sequence.runtime.playhead.frame >= sequence.sequence.numFrames) {
      sequence.runtime.playhead.setFrame(0);
      sequence.runtime.incrementLoopCount();
    }
  }, [sequence, sequence.sequence.numFrames]);

  useFrame(onFrame, [sequence, sequence.sequence.numFrames]);

  return null;
}
