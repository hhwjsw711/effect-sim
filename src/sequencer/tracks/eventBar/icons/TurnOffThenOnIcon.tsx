import { IconPower } from "@tabler/icons-react";

interface TurnOffThenOnIconProps {
  color?: string;
  size?: number;
}

export function TurnOffThenOnIcon({
  color,
  size = 14,
}: TurnOffThenOnIconProps) {
  const iconColor = color ?? "white";
  const circleSize = size;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        flexShrink: 0,
      }}
    >
      {/* Off icon - outlined circle */}
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          border: `2px solid ${iconColor}`,
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconPower
          size={circleSize * 0.6}
          style={{
            color: iconColor,
            strokeWidth: 2.5,
          }}
        />
      </div>

      {/* On icon - filled circle */}
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          backgroundColor: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconPower
          size={circleSize}
          style={{
            color: iconColor === "white" ? "black" : "white",
            strokeWidth: 2.5,
          }}
        />
      </div>
    </div>
  );
}
