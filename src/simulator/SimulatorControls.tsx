import { OrbitControls, FlyControls } from "@react-three/drei";
import { useSimulator } from "./SimulatorContext";
import { FPSControls } from "./FPSControls";

export function SimulatorControls() {
  const simulator = useSimulator();
  const app = simulator.app;
  const project = app.getProject();

  if (project.settings.cameraControl === "orbit")
    return <OrbitControls enableDamping makeDefault />;

  if (project.settings.cameraControl === "fly")
    return (
      <FlyControls makeDefault movementSpeed={10} rollSpeed={0.2} dragToLook />
    );

  if (project.settings.cameraControl === "first_person") return <FPSControls />;
}
