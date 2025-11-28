import { useProgress } from "@react-three/drei";
import { Center, Stack, Text, Progress } from "@mantine/core";

export function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <Center
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2000,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        pointerEvents: "all", // Block interaction
      }}
    >
      <Stack align="center" gap="xs">
        <Text c="white" fw={500}>
          Loading Garden Model...
        </Text>
        <Progress
          value={progress}
          w={200}
          color="blue"
          transitionDuration={200}
        />
        <Text c="dimmed" size="sm">
          {progress.toFixed(0)}%
        </Text>
      </Stack>
    </Center>
  );
}
