import { Stack } from "@mantine/core";
import NoSequenceSelectedContent from "./layout/NoSequenceSelectedContent.tsx";
import SequencerToolbar from "./toolbar/SequencerToolbar";
import { SequencerContext, useSequencerPanel } from "./SequencerContext";
import SequencerView from "./layout/SequencerView.tsx";
import { SequenceRuntime } from "./runtime/SequenceRuntime";
import { SequencerPanelUIModel } from "./models/SequencerPanelUIModel.ts";
import { useMemo } from "react";
import { useApp } from "../common/AppContext.tsx";

export default function SequencerPanel({ id }: { id: string }) {
  const app = useApp();

  const sequencer = useMemo(
    () => new SequencerPanelUIModel(app, id),
    [app, id],
  );

  return (
    <SequencerContext value={sequencer}>
      <Stack
        // There is a bug in mobx where the sequence runtime is not updated when the playhead doesnt play when the sequence changes, so doing this for now
        key={sequencer.selectedSequenceId ?? "no-sequence"}
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
