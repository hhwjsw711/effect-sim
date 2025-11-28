import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { PlaylistPlayerModel } from "../src/inspector/playlist/PlaylistPlayerModel";
import { PlaylistModel } from "../shared/models/PlaylistModel";
import { SequenceRuntime } from "../src/sequencer/runtime/SequenceRuntime";
import { useFrame } from "../src/common/utils/frames";

export const HeadlessPlaylistPlayer = observer(({
  playlist
}: {
  playlist: PlaylistModel
}) => {
  const [player] = useState(() => new PlaylistPlayerModel(playlist));

  useEffect(() => {
    player.play();
    return () => player.pause();
  }, [player]);

  useFrame(() => {
    player.advanceFrame();
  });

  if (!player.isPlaying || !player.currentSequence) return null;

  return <SequenceRuntime model={player.runtime} />;
});

