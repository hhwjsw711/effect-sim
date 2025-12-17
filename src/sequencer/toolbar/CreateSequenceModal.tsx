import { useMemo, useState } from "react";
import { Button, Modal, Stack, TextInput, NumberInput } from "@mantine/core";
import { useApp } from "../../common/AppContext";
import { useAdaptiveStep } from "../../common/hooks/useAdaptiveStep";
import { SequenceModel } from "../../../shared/models/sequencer/SequenceModel";
import { createTempId, isTempId } from "../../../shared/models/types";
import { when } from "mobx";
import { useApiErrorHandler } from "../../common/errors";

export default function CreateSequenceModal({
  opened,
  onClose,
  onCreated,
}: {
  opened: boolean;
  onClose: () => void;
  onCreated: (sequence: SequenceModel) => void;
}) {
  const project = useApp().getProject();

  const [isSaving, setIsSaving] = useState(false);
  const onApiError = useApiErrorHandler();

  const newSequence = useMemo(
    () =>
      new SequenceModel(
        {
          name: "New Sequence",
          numFrames: 500,
          tracks: [],
          projectId: project._id,
          _creationTime: 0,
          _id: createTempId("sequences"),
        },
        project,
      ),
    [project],
  );

  const step = useAdaptiveStep(newSequence.numFrames);

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);
    project.addSequence(newSequence);
    try {
      // Have to do this kind of shennanings because lack of client-side id in Convex
      await when(() => !isTempId(newSequence._id));
      onCreated(newSequence);
      onClose();
    } catch (error) {
      onApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Create Sequence" size="sm">
      <Stack gap="sm">
        <TextInput
          label="Name"
          value={newSequence.name}
          autoFocus
          disabled={isSaving}
          onChange={(e) => newSequence.setName(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newSequence.name.trim()) {
              e.preventDefault();
              save();
            }
          }}
        />
        <NumberInput
          label="Number of Frames"
          value={newSequence.numFrames}
          step={step}
          onChange={(value) => newSequence.setNumFrames(value as number)}
          disabled={isSaving}
          min={1}
          max={10000}
        />
        <Button
          disabled={!newSequence.name.trim() || isSaving}
          onClick={() => {
            if (!newSequence.name.trim()) return;
            save();
          }}
        >
          Create
        </Button>
      </Stack>
    </Modal>
  );
}
