import { EventEmitter } from "./utils/EventEmitter";
import { Experience } from "./Experience";
import * as THREE from "three";

export class Controls {
  eventEmitter: EventEmitter;
  experience: Experience;
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  run: boolean;
  jump: boolean;
  velocity: { x: number; y: number; z: number };
  velocityFactor: number;
  jumpVelocity: number;
  canJump: boolean;
  lock: boolean;

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.lock = false;
    this.setUpListeners();
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.run = false;
    this.jump = false;
    this.canJump = false;
    this.velocity = {
      x: 0,
      y: 0,
      z: 0,
    };
    this.velocityFactor = 0.1;
    this.jumpVelocity = 6;

    this.eventEmitter.on("loaded", () => {
      this.experience.player?.physics?.addEventListener(
        "collide",
        (evt: any) => {
          console.log("collide", evt);
          if (!this.experience.player?.physics) return;
          const velocity = evt.contact.getImpactVelocityAlongNormal();
          // Ignore light touchs and inverse collision
          if (velocity < 0.3) return;
          this.canJump = true;
        }
      );
    });
  }

  setUpListeners() {
    window.addEventListener("mousemove", this.mouseMove.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("dblclick", this.doubleClick.bind(this));
    this.eventEmitter.on("tick", this.move.bind(this));

    // Pointer lock
    this.experience.canvas.onclick = () => {
      this.experience.canvas.requestPointerLock();
      document.addEventListener(
        "pointerlockchange",
        this.pointerLockChange.bind(this)
      );
    };
  }

  mouseMove(evt: any) {
    if (!this.experience.camera?.instance || !this.lock) return;
    const euler = new THREE.Euler(0, 0, 0, "YXZ");
    const deltaX = evt.movementX / 500;
    const deltaY = evt.movementY / 500;
    euler.setFromQuaternion(
      new THREE.Quaternion(
        this.experience.camera.instance.quaternion.x,
        this.experience.camera.instance.quaternion.y,
        this.experience.camera.instance.quaternion.z,
        this.experience.camera.instance.quaternion.w
      )
    );
    euler.y -= deltaX;
    euler.x -= deltaY;
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
    this.experience.camera.instance.quaternion.setFromEuler(euler);
  }

  keyUp(evt: any) {
    if (!this.lock) return;
    const code: string = evt.code;
    const actions: Record<string, Function> = {
      KeyW: () => (this.moveForward = false),
      KeyA: () => (this.moveLeft = false),
      KeyS: () => (this.moveBackward = false),
      KeyD: () => (this.moveRight = false),
      ShiftLeft: () => (this.run = false),
      Space: () => (this.jump = false),
    };
    if (actions[code]) actions[code]();
  }

  keyDown(evt: any) {
    if (!this.lock) return;
    const code: string = evt.code;
    const actions: Record<string, Function> = {
      KeyW: () => (this.moveForward = true),
      KeyA: () => (this.moveLeft = true),
      KeyS: () => (this.moveBackward = true),
      KeyD: () => (this.moveRight = true),
      ShiftLeft: () => (this.run = true),
      Space: () => (this.jump = true),
    };
    if (actions[code]) actions[code]();
  }

  doubleClick() {
    !document.fullscreenElement
      ? this.experience.canvas.requestFullscreen()
      : document.exitFullscreen();
  }

  pointerLockChange() {
    const locked = document.pointerLockElement === this.experience.canvas;
    this.lock = locked;
    // Keyup all keys if unlock the screen
  }

  move() {
    if (
      !this.lock ||
      !this.experience.player?.physics ||
      !this.experience.camera?.instance ||
      !this.experience.time
    )
      return;
    const delta = this.experience.time.delta;

    this.velocity = { x: 0, y: 0, z: 0 };
    const speed = this.run ? this.velocityFactor * 2 : this.velocityFactor;

    if (this.moveForward) {
      this.velocity.z = -speed * delta;
    }
    if (this.moveBackward) {
      this.velocity.z = speed * delta;
    }

    if (this.moveLeft) {
      this.velocity.x = -speed * delta;
    }
    if (this.moveRight) {
      this.velocity.x = speed * delta;
    }

    const quaternion = this.experience.camera?.instance.quaternion;
    const force = new THREE.Vector3(
      this.velocity.x,
      this.velocity.y,
      this.velocity.z
    ).applyQuaternion(quaternion);

    if (this.jump && this.canJump) {
      force.y = this.jumpVelocity;
      this.canJump = false;
    } else {
      force.y = this.experience.player.physics.velocity.y;
    }
    if (Math.abs(force.x) < 0.1 && Math.abs(force.z) < 0.1 && this.canJump) {
      this.experience.player.physics.sleep();
    } else {
      this.experience.player.physics.wakeUp();
      this.experience.player.physics.velocity.x = force.x;
      this.experience.player.physics.velocity.y = force.y;
      this.experience.player.physics.velocity.z = force.z;
    }
  }
}
