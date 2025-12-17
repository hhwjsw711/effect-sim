import { useMemo, useState } from "react";
import { Button, Modal, Stack, TextInput } from "@mantine/core";
import type { Id } from "../../../convex/_generated/dataModel";
import { ProjectModel } from "../../../shared/models/ProjectModel";
import { createTempId, isTempId } from "../../../shared/models/types";
import { useApp } from "../AppContext";
import { when } from "mobx";
import { useApiErrorHandler } from "../errors";

export default function NewProjectModal({
  opened,
  onClose,
  onCreated,
}: {
  opened: boolean;
  onClose: () => void;
  onCreated: (id: Id<"projects">) => void;
}) {
  const app = useApp();

  const [isSaving, setIsSaving] = useState(false);
  const onApiError = useApiErrorHandler();

  const project = useMemo(
    () =>
      new ProjectModel({
        name: "My Project",
        _id: createTempId("projects"),
        _creationTime: 0,
        settings: {
          nightMode: false,
          lightsOnTop: false,
          stringLedSize: 0.1,
        },
      }),
    [],
  );

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);
    app.addProject(project);
    try {
      // Have to do this kind of shennanings because lack of client-side id in Convex
      await when(() => !isTempId(project._id));
      onCreated(project._id);
      onClose();
    } catch (error) {
      onApiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create New Project"
      size="sm"
    >
      <Stack gap="sm">
        <TextInput
          label="Project Name"
          value={project.name}
          autoFocus
          disabled={isSaving}
          onChange={(e) => project.setName(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && project.name.trim()) {
              e.preventDefault();
              save();
            }
          }}
        />
        <Button disabled={!project.name.trim() || isSaving} onClick={save}>
          Create Project
        </Button>
      </Stack>
    </Modal>
  );
}
