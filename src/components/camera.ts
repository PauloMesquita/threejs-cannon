import * as THREE from "three";
import { WindowSizes } from "./types";

export class Camera {
  perspectiveCamera: THREE.PerspectiveCamera;
  player: THREE.Mesh;

  constructor(scene: THREE.Scene, sizes: WindowSizes) {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    this.player = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    scene.add(this.player);
  }

  changeSize(sizes: WindowSizes) {
    this.perspectiveCamera.aspect = sizes.width / sizes.height;
    this.perspectiveCamera.updateProjectionMatrix();
  }

  onMouseMove(evt: any) {
    // Set camera rotation using euler angles
    const euler = new THREE.Euler(0, 0, 0, "YXZ");
    const deltaX = evt.movementX / 500;
    const deltaY = evt.movementY / 500;
    euler.setFromQuaternion(this.perspectiveCamera.quaternion);
    euler.y -= deltaX;
    euler.x -= deltaY;
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
    return euler.toArray();
  }
}
