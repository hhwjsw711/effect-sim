import { useEffect } from "react";
import type { SwitchNodeModel } from "../../../../shared/models/SwitchNodeModel";

export function TurnOffThenOn({
  switch: switchNode,
  props,
}: {
  switch: SwitchNodeModel;
  props?: Record<string, unknown>;
}) {
  useEffect(() => {
    switchNode.turnOff().catch(console.error);

    return () => {
      switchNode.turnOn().catch(console.error);
    };
  }, [switchNode]);

  return null;
}
