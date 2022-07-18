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

export class Plane {
  eventEmitter: EventEmitter;
  experience: Experience;
  environmentMap: Record<string, any>;
  mesh?: THREE.Mesh;
  physics?: CANNON.Body;

  constructor(sizes: [number, number], position: Position, rotation: Position) {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.environmentMap = {};
    this.setMesh(sizes, position, rotation);
    this.setPhysics(position, rotation);
  }

  setEnvironmentMap() {
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture =
      this.experience.resources?.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
  }

  setMesh(sizes: [number, number], position: Position, rotation: Position) {
    const boxGeometry = new THREE.PlaneGeometry(sizes[0], sizes[1]);
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
    this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    this.experience.scene?.add(this.mesh);
  }

  setPhysics(position: Position, rotation: Position) {
    const boxShape = new CANNON.Plane();
    this.physics = new CANNON.Body({
      shape: boxShape,
      type: CANNON.Body.STATIC,
    });
    this.physics.position.set(position.x, position.y, position.z);
    this.physics.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);
    this.experience.physicsWorld?.addBody(this.physics);
    this.eventEmitter.on("tick", () => {
      if (!this.mesh || !this.physics) return;
      updateMeshWithPhysics(this.mesh, this.physics);
    });
  }
}
