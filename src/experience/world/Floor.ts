import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Experience } from "../Experience";

export class Floor {
  experience: Experience;
  textures?: Record<string, any>;
  mesh?: THREE.Mesh;
  physicsFloor?: CANNON.Plane;

  constructor() {
    this.experience = Experience.getInstance();
    this.setTextures();
    this.setMesh();
    this.setPhysicsFloor();
    if (this.mesh) this.experience.scene?.add(this.mesh);
  }

  setTextures() {
    this.textures = {};
    this.textures.color = this.experience.resources?.items.tilesBaseColor;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(2, 2);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;
    this.textures.normal = this.experience.resources?.items.tilesNormal;
    this.textures.normal.repeat.set(2, 2);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
    this.textures.ambientOcclusion =
      this.experience.resources?.items.tilesAmbientOcclusion;
    this.textures.height = this.experience.resources?.items.tilesHeight;
    this.textures.roughness = this.experience.resources?.items.tilesRoughness;
  }

  setMesh() {
    if (!this.textures) return null;
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({
        map: this.textures.color,
        normalMap: this.textures.normal,
        aoMap: this.textures.ambientOcclusion,
        // displacementMap: this.textures.height,
        roughnessMap: this.textures.roughness,
      })
    );
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
  }

  setPhysicsFloor() {
    const planeShape = new CANNON.Plane();
    const planeBody = new CANNON.Body({ mass: 0, shape: planeShape });
    planeBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0);
    this.experience.physicsWorld?.addBody(planeBody);
  }
}
