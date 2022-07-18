import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Experience } from "../Experience";
import { EventEmitter } from "../utils/EventEmitter";

export class Player {
  eventEmitter: EventEmitter;
  experience: Experience;
  mesh?: THREE.Mesh;
  physics?: CANNON.Body;

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.setMesh();
    this.setPhysics();
  }

  setMesh() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    // this.mesh.castShadow = true;
    this.mesh.position.set(0, 3, 3);
    this.experience.scene?.add(this.mesh);

    this.eventEmitter.on("loaded", () => {
      this.eventEmitter.on("tick", () => {
        if (this.physics) {
          this.mesh?.position.set(
            this.physics.position.x,
            this.physics.position.y,
            this.physics.position.z
          );
        }
      });
    });
  }

  setPhysics() {
    const boxShape = new CANNON.Sphere(0.5);
    this.physics = new CANNON.Body({
      mass: 985 * boxShape.volume(), // Avg density of human body * volume
      shape: boxShape,
    });
    this.physics.position.set(0, 3, 3);
    this.physics.allowSleep = false;
    this.experience.physicsWorld?.addBody(this.physics);
  }
}
