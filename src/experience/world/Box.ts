import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Experience } from "../Experience";
import { EventEmitter } from "../utils/EventEmitter";
import { updateMeshWithPhysics } from "../utils/updateMeshWithPhysics";

type Position = {
  x: number;
  y: number;
  z: number;
};

export class Box {
  eventEmitter: EventEmitter;
  experience: Experience;
  environmentMap: Record<string, any>;
  mesh?: THREE.Mesh;
  physics?: CANNON.Body;

  constructor(sizes: [number, number, number], position: Position) {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.environmentMap = {};
    this.setMesh(sizes, position);
    this.setPhysics(sizes, position);
  }

  setEnvironmentMap() {
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture =
      this.experience.resources?.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
  }

  setMesh(sizes: [number, number, number], position: Position) {
    const boxGeometry = new THREE.BoxGeometry(sizes[0], sizes[1], sizes[2]);
    const boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.5,
      envMap: this.environmentMap.texture,
      envMapIntensity: 0.5,
    });
    this.mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    this.mesh.castShadow = true;
    this.mesh.position.copy(
      new THREE.Vector3(position.x, position.y, position.z)
    );
    this.experience.scene?.add(this.mesh);
  }

  setPhysics(sizes: [number, number, number], position: Position) {
    const boxShape = new CANNON.Box(
      new CANNON.Vec3(sizes[0] / 2, sizes[1] / 2, sizes[2] / 2)
    );
    this.physics = new CANNON.Body({
      shape: boxShape,
      type: CANNON.Body.STATIC,
    });
    this.physics.position.set(position.x, position.y, position.z);
    this.experience.physicsWorld?.addBody(this.physics);
    this.eventEmitter.on("tick", () => {
      if (!this.mesh || !this.physics) return;
      updateMeshWithPhysics(this.mesh, this.physics);
    });
  }
}
