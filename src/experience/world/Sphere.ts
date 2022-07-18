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

export class Sphere {
  eventEmitter: EventEmitter;
  experience: Experience;
  environmentMap: Record<string, any>;
  mesh?: THREE.Mesh;
  physics?: CANNON.Body;

  constructor(radius: number, position: Position, mass: number) {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.environmentMap = {};
    this.setMesh(radius, position);
    this.setPhysics(radius, position, mass);
  }

  setEnvironmentMap() {
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture =
      this.experience.resources?.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
  }

  setMesh(radius: number, position: Position) {
    const sphereGeometry = new THREE.SphereGeometry(radius);

    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.5,
      envMap: this.environmentMap.texture,
      envMapIntensity: 0.5,
    });
    this.mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.mesh.castShadow = true;
    this.mesh.position.copy(
      new THREE.Vector3(position.x, position.y, position.z)
    );
    this.experience.scene?.add(this.mesh);
  }

  setPhysics(radius: number, position: Position, mass: number) {
    const sphereShape = new CANNON.Sphere(radius);
    this.physics = new CANNON.Body({ mass, shape: sphereShape });
    this.physics.position.set(position.x, position.y, position.z);
    this.experience.physicsWorld?.addBody(this.physics);
    this.eventEmitter.on("tick", () => {
      if (!this.mesh || !this.physics) return;
      updateMeshWithPhysics(this.mesh, this.physics);
    });
  }
}
