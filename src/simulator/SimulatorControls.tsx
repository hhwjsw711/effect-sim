import { OrbitControls, FlyControls } from "@react-three/drei";
import { useSimulator } from "./SimulatorContext";
import { FPSControls } from "./FPSControls";
import { exhaustiveCheck } from "../../shared/misc";

export function SimulatorControls() {
  const simulator = useSimulator();
  const app = simulator.app;
  const project = app.getProject();
  const cameraControl = project.settings.cameraControl ?? "orbit";

  if (cameraControl === "orbit")
    return <OrbitControls enableDamping makeDefault />;

  if (cameraControl === "fly")
    return (
      <FlyControls makeDefault movementSpeed={10} rollSpeed={0.2} dragToLook />
    );

  if (cameraControl === "first_person") return <FPSControls />;

  exhaustiveCheck(cameraControl);
}
