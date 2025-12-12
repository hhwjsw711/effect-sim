import { Stack } from "@mantine/core";
import NoSequenceSelectedContent from "./layout/NoSequenceSelectedContent.tsx";
import SequencerToolbar from "./toolbar/SequencerToolbar";
import { SequencerContext, useSequencerPanel } from "./SequencerContext";
import SequencerView from "./layout/SequencerView.tsx";
import { SequenceRuntime } from "./runtime/SequenceRuntime";
import { SequencerPanelUIModel } from "./models/SequencerPanelUIModel.ts";
import { useEffect, useMemo } from "react";
import { useApp } from "../common/AppContext.tsx";
import { isTempId } from "../../shared/models/types.ts";
import { autorun } from "mobx";

export default function SequencerPanel({ id }: { id: string }) {
  const app = useApp();
  const sequencer = useMemo(
    () => new SequencerPanelUIModel(app, id),
    [app, id],
  );

  // This is a bit of a hack until we get true client-side document ids
  // tracking working
  // useEffect(() => {
  //   return autorun(() => {});
  // }, [sequencer.sequence?.sequence]);

  return (
    <SequencerContext value={sequencer}>
      <Stack
        // must keep the key here as there seems to be a bug in mobx where the sequence runtime is not updated when the playhead doesnt play when the sequence changes
        key={sequencer.sequence?.sequence._id ?? "no-sequence"}
        gap="xs"
        style={{ height: "100%" }}
      >
        {sequencer.sequence ? (
          <>
            {sequencer.sequence.isPlaying && (
              <SequenceRuntime model={sequencer.sequence.runtime} />
            )}
            <Stack gap="0" style={{ flex: 1, minWidth: 0 }}>
              <SequencerToolbar />
              <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <SequencerView />
              </div>
            </Stack>
          </>
        ) : (
          <NoSequenceSelectedContent />
        )}
      </Stack>
    </SequencerContext>
  );
}
