import * as THREE from "three";

export class Lights {
  scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.position.x = 2;
    pointLight.position.y = 10;
    pointLight.position.z = 4;
    scene.add(pointLight);
  }
}
