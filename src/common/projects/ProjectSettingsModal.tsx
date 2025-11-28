import { Modal, Stack, NumberInput, TextInput } from "@mantine/core";
import { useApp } from "../AppContext";

export default function ProjectSettingsModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const project = useApp().getProject();

  const currentStringLedSize = project.settings.stringLedSize ?? 0.1;

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
          step={0.1}
          decimalScale={2}
        />
      </Stack>
    </Modal>
  );
}
