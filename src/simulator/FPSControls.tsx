import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Vector3 } from "three";

export function FPSControls() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.current = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft.current = true;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward.current = true;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight.current = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.current = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft.current = false;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward.current = false;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight.current = false;
          break;
      }
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
