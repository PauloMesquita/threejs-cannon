import * as THREE from "three";
import { Experience } from "../Experience";

export class Environment {
  experience: Experience;
  sunLight?: THREE.DirectionalLight;

  constructor() {
    this.experience = Experience.getInstance();
    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.position.set(3, 3, -2.25);
    this.experience.scene?.add(this.sunLight);
  }

  setEnvironmentMap() {
    if (!this.experience.scene) return;
    const environmentMap: Record<string, any> = {};
    environmentMap.intensity = 0.6;
    environmentMap.texture =
      this.experience.resources?.items.environmentMapTexture;
    environmentMap.texture.encoding = THREE.sRGBEncoding;
    this.experience.scene.environment =
      this.experience.resources?.items.environmentMapTexture;
    this.experience.scene.background =
      this.experience.resources?.items.environmentMapTexture;
    environmentMap.updateMaterials = () => {
      this.experience.scene?.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = environmentMap.texture;
          child.material.envMapIntensity = environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    environmentMap.updateMaterials();
  }
}
