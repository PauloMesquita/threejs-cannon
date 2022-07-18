import * as THREE from "three";
import * as CANNON from "cannon-es";

export const updateMeshWithPhysics = (
  mesh: THREE.Mesh | THREE.PerspectiveCamera,
  physics: CANNON.Body
) => {
  if (!mesh || !physics) return;
  mesh.position.set(physics.position.x, physics.position.y, physics.position.z);
  if (!physics) return;
  mesh.quaternion.copy(
    new THREE.Quaternion(
      physics.quaternion.x,
      physics.quaternion.y,
      physics.quaternion.z,
      physics.quaternion.w
    )
  );
};
