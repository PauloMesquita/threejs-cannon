import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { Camera } from "./Camera";
import { Renderer } from "./Renderer";
import { World } from "./world/World";
import { sources } from "./sources";
import { Sizes } from "./utils/Sizes";
import { Time } from "./utils/Time";
import { EventEmitter } from "./utils/EventEmitter";
import { Resources } from "./utils/Resources";
import { Player } from "./world/Player";

export class Experience {
  private static instance: Experience;

  eventEmitter?: EventEmitter;
  canvas: any;
  sizes?: Sizes;
  time?: Time;
  scene?: THREE.Scene;
  camera?: Camera;
  player?: Player;
  renderer?: Renderer;
  world?: World;
  physicsWorld?: CANNON.World;
  canonDebug?: any;
  resources?: Resources;

  // Singleton
  static getInstance(canvas?: Element): Experience {
    if (!this.instance && canvas) {
      this.instance = new this(canvas);
      // Call setUp here because functions from setUp getInstance of this class
      this.instance.setUp();
    }
    return this.instance;
  }

  private constructor(canvas: Element) {
    this.canvas = canvas;
  }

  setUp() {
    this.eventEmitter = EventEmitter.getInstance();
    this.sizes = new Sizes();
    this.time = new Time();
    this.resources = new Resources(sources);
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.physicsWorld = new CANNON.World();
    this.player = new Player();
    const cannonDebugger = CannonDebugger(this.scene, this.physicsWorld);
    this.eventEmitter.trigger("loaded");
    this.eventEmitter.on("tick", () => cannonDebugger.update());
  }
}
