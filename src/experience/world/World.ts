import * as CANNON from "cannon-es";
import { EventEmitter } from "../utils/EventEmitter";
import { Experience } from "../Experience";
import { Environment } from "./Environment";
import { Floor } from "./Floor";
import { Box } from "./Box";

export class World {
  eventEmitter: EventEmitter;
  experience: Experience;
  environment?: Environment;
  floor?: Floor;

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();

    this.eventEmitter.on("ready", () => {
      this.setUp();
      this.floor = new Floor();

      new Box([2, 8, 20], { x: 19, y: 4, z: 0 });
      new Box([2, 8, 20], { x: -19, y: 4, z: 0 });
      new Box([40, 8, 2], { x: 0, y: 4, z: 9 });
      new Box([40, 8, 2], { x: 0, y: 4, z: -9 });
      new Box([40, 2, 20], { x: 0, y: 9, z: 0 });

      new Box([1, 1, 1], { x: 0, y: 0.5, z: 0 });
      this.environment = new Environment();
    });

    this.eventEmitter.on("tick", () => {
      this.experience.physicsWorld?.step(
        1 / 60,
        this.experience.time?.delta,
        3
      );
    });
  }

  setUp() {
    if (this.experience.physicsWorld) {
      this.experience.physicsWorld?.gravity.set(0, -9.82, 0);
      this.experience.physicsWorld.broadphase = new CANNON.SAPBroadphase(
        this.experience.physicsWorld
      );
      this.experience.physicsWorld.allowSleep = true;
    }

    const defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 1,
        restitution: 0,
      }
    );
    if (this.experience.physicsWorld) {
      this.experience.physicsWorld.defaultContactMaterial =
        defaultContactMaterial;
      this.experience.physicsWorld.defaultContactMaterial.contactEquationStiffness = 1e9;

      // Stabilization time in number of timesteps
      this.experience.physicsWorld.defaultContactMaterial.contactEquationRelaxation = 4;

      const solver = new CANNON.GSSolver();
      solver.iterations = 7;
      solver.tolerance = 0.1;
      this.experience.physicsWorld.solver = new CANNON.SplitSolver(solver);
    }
  }
}
