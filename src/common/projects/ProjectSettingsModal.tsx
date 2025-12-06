import { Modal, Stack, NumberInput, TextInput } from "@mantine/core";
import { useApp } from "../AppContext";
import { DEFAULT_FRAMERATE } from "./projectConstants";
import { useAdaptiveStep } from "../hooks/useAdaptiveStep";

export default function ProjectSettingsModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const project = useApp().getProject();

  const currentStringLedSize = project.settings.stringLedSize ?? 0.1;
  const currentFramerate =
    project.settings.defaultFramerate ?? DEFAULT_FRAMERATE;
  const stringLedSizeStep = useAdaptiveStep(currentStringLedSize);
  const framerateStep = useAdaptiveStep(currentFramerate);

  return (
    <Modal opened={opened} onClose={onClose} title="Project Settings" size="sm">
      <Stack gap="sm">
        <TextInput
          label="Project Name"
          value={project.name}
          autoFocus
          onChange={(e) => project.setName(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onClose();
            }
          }}
        />
        <NumberInput
          label="String LED Size"
          description="Size of LED squares in the simulator (in meters)"
          value={currentStringLedSize}
          onChange={(value) => {
            if (value !== null && value !== undefined) {
              const numValue =
                typeof value === "number" ? value : Number(value);
              if (!isNaN(numValue))
                project.updateSettings({ stringLedSize: numValue });
            }
          }}
          min={0.01}
          max={1.0}
          step={stringLedSizeStep}
          decimalScale={2}
        />
        <NumberInput
          label="Default Framerate"
          description="Frames per second for effects playback"
          value={currentFramerate}
          onChange={(value) => {
            if (value !== null && value !== undefined) {
              const numValue =
                typeof value === "number" ? value : Number(value);
              if (!isNaN(numValue) && numValue > 0)
                project.updateSettings({ defaultFramerate: numValue });
            }
          }}
          min={1}
          max={120}
          step={framerateStep}
          suffix=" FPS"
        />
      </Stack>
    </Modal>
  );
}
