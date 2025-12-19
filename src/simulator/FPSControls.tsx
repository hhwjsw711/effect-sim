import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { PointerLockControls } from "@react-three/drei";
import { Vector3 } from "three";

export function FPSControls() {
  const { camera } = useThree();
  const controlsRef = useRef<PointerLockControlsImpl | null>(null);
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp" || event.code === "KeyW") {
        moveForward.current = true;
        return;
      }
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        moveLeft.current = true;
        return;
      }
      if (event.code === "ArrowDown" || event.code === "KeyS") {
        moveBackward.current = true;
        return;
      }
      if (event.code === "ArrowRight" || event.code === "KeyD")
        moveRight.current = true;
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp" || event.code === "KeyW") {
        moveForward.current = false;
        return;
      }
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        moveLeft.current = false;
        return;
      }
      if (event.code === "ArrowDown" || event.code === "KeyS") {
        moveBackward.current = false;
        return;
      }
      if (event.code === "ArrowRight" || event.code === "KeyD")
        moveRight.current = false;
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!controlsRef.current?.isLocked) return;

    const speed = 10 * delta;

    if (moveForward.current || moveBackward.current) {
      // Get the direction the camera is facing
      direction.current.set(0, 0, -1).applyQuaternion(camera.quaternion);
      // Normalize the direction
      direction.current.normalize();
      // Scale by speed
      direction.current.multiplyScalar(speed * (moveForward.current ? 1 : -1));
      // Add to camera position
      camera.position.add(direction.current);
    }

    if (moveLeft.current || moveRight.current) {
      // Get the right vector relative to the camera
      direction.current.set(1, 0, 0).applyQuaternion(camera.quaternion);
      direction.current.normalize();
      direction.current.multiplyScalar(speed * (moveRight.current ? 1 : -1));
      camera.position.add(direction.current);
    }
  });

  return <PointerLockControls ref={controlsRef} makeDefault />;
}
