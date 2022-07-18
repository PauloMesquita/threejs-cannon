import { EventEmitter } from "./utils/EventEmitter";
import * as THREE from "three";
import { Experience } from "./Experience";

export class Renderer {
  eventEmitter: EventEmitter;
  experience: Experience;
  instance: THREE.WebGLRenderer;

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.instance = new THREE.WebGLRenderer({
      canvas: this.experience.canvas,
      antialias: true,
    });
    this.setUp();

    this.eventEmitter.on("resize", this.resize.bind(this));
    this.eventEmitter.on("tick", this.update.bind(this));
  }

  setUp() {
    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor("#211d20");
    this.resize();
  }

  resize() {
    if (!this.experience.sizes) return;
    this.instance.setSize(
      this.experience.sizes.width,
      this.experience.sizes.height
    );
    this.instance.setPixelRatio(this.experience.sizes.pixelRatio);
  }

  update() {
    if (!this.experience.scene || !this.experience.camera) return;
    this.instance.render(
      this.experience.scene,
      this.experience.camera.instance
    );
  }
}
