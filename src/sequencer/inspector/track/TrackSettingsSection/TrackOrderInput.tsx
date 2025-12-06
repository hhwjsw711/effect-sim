import { Group, NumberInput, Text } from "@mantine/core";
import { useState } from "react";
import { useAdaptiveStep } from "../../../../common/hooks/useAdaptiveStep";

type TrackOrderInputProps = {
  trackIndex: number;
  tracksCount: number;
  onOrderChange: (newIndex: number) => void;
};

export function TrackOrderInput({
  trackIndex,
  tracksCount,
  onOrderChange,
}: TrackOrderInputProps) {
  const [order, setOrder] = useState<number>(trackIndex + 1);
  const step = useAdaptiveStep(order);

  const handleOrderChange = (newOrder: number | string) => {
    if (typeof newOrder !== "number") return;

    const newIndex = newOrder - 1;
    if (newIndex < 0 || newIndex >= tracksCount) return;
    if (newIndex === trackIndex) return;

    onOrderChange(newIndex);
  };

  return (
    <Group justify="space-between" align="center">
      <Text size="sm" fw={500} style={{ minWidth: "80px" }}>
        Order
      </Text>
      <NumberInput
        value={order}
        step={step}
        onChange={(value) => {
          setOrder(value as number);
          handleOrderChange(value);
        }}
        min={1}
        max={tracksCount}
        style={{ flex: 1, maxWidth: "200px" }}
      />
    </Group>
  );
}
