import * as THREE from "three";
import { Camera } from "./camera";
import { Floor } from "./floor";
import { PlayerInfo, WindowSizes } from "./types";
import SockJS from "sockjs-client";
import { OtherPlayers } from "./otherPlayers";
import { Walls } from "./walls";
import { Lights } from "./lights";

export class ViewGL {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  sizes: WindowSizes;
  camera: Camera;
  player: PlayerInfo;
  otherPlayersInfo: Record<string, PlayerInfo>;
  otherPlayers: OtherPlayers;
  keysPressed: Record<string, boolean>;
  sock: WebSocket;
  sockId: string;
  locked: boolean;

  constructor(canvas: any) {
    this.locked = false;
    this.player = {
      name: "current",
      coordinates: {
        x: Math.round(Math.random() * 300) - 150,
        y: 1,
        z: Math.round(Math.random() * 300) - 150,
      },
      euler: [0, 0, 0],
    };
    this.keysPressed = {
      w: false,
      a: false,
      s: false,
      d: false,
    };
    this.otherPlayersInfo = {};
    this.scene = new THREE.Scene();
    this.otherPlayers = new OtherPlayers(this.scene);
    this.sizes = { width: window.innerWidth, height: window.innerHeight };
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.camera = new Camera(this.scene, this.sizes);
    canvas.onclick = () => {
      canvas.requestPointerLock();
      document.addEventListener(
        "pointerlockchange",
        () => {
          const locked = document.pointerLockElement === canvas;
          this.locked = locked;
          // Keyup all keys if unlock the screen
          if (!locked) {
            Object.entries(this.keysPressed).forEach(([key, value]) => {
              if (value) this.keysPressed[key] = false;
            });
          }
          console.log("locked", this.locked);
        },
        false
      );
    };
    new Floor(this.scene);
    new Walls(this.scene);
    new Lights(this.scene);
    this.events("resize", this.sizes);
    this.update();
    // Network
    this.sock = new SockJS("http://localhost:7000", null, {
      transports: ["websocket"],
    });
    this.sockId = "";
    this.sock.onopen = () => {
      console.log("open ws connection");
      setInterval(() => {
        this.sock.send(
          JSON.stringify({ ...this.player, euler: this.player.euler })
        );
      }, 32);
    };

    this.sock.onmessage = (e: any) => {
      const obj = JSON.parse(e.data);
      if (obj.type === "id") {
        console.log("setting sock id", obj.value);
        this.sockId = obj.value;
      }
      if (obj.type === "players") {
        const otherPlayersNewInfo = {} as Record<string, PlayerInfo>;
        Object.entries(obj.value).forEach(([key, value]) => {
          if (key !== this.sockId) {
            otherPlayersNewInfo[key] = JSON.parse(
              value as string
            ) as PlayerInfo;
          }
        });
        this.otherPlayersInfo = otherPlayersNewInfo;
        this.otherPlayers.update(this.otherPlayersInfo);
      }
    };

    this.sock.onclose = () => {
      console.log("close");
    };
  }

  events(type: string, value: any) {
    if (type === "resize") {
      this.sizes = value;
      this.camera.changeSize(this.sizes);
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      return;
    }
    if (type === "mousemove") {
      if (this.locked) this.player.euler = this.camera.onMouseMove(value);
    }
    if (type === "keydown") {
      if (this.locked)
        if (Object.keys(this.keysPressed).includes(value.key))
          this.keysPressed[value.key] = true;
    }
    if (type === "keyup") {
      if (this.locked)
        if (Object.keys(this.keysPressed).includes(value.key))
          this.keysPressed[value.key] = false;
    }
  }

  move(key: string) {
    const direction = new THREE.Vector3();
    this.camera.perspectiveCamera.getWorldDirection(direction);
    if (["a", "d"].includes(key))
      direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    let speed = 0.3;
    // const currentPosition = this.camera.perspectiveCamera.position.clone();
    const currentPosition = new THREE.Vector3(
      this.player.coordinates.x,
      this.player.coordinates.y,
      this.player.coordinates.z
    );
    currentPosition.add(
      direction.multiplyScalar(["w", "a"].includes(key) ? speed : -speed)
    );
    this.player.coordinates = {
      x: Math.max(Math.min(currentPosition.x, 149), -149),
      y: 1,
      z: Math.max(Math.min(currentPosition.z, 149), -149),
    };
  }

  updateCurrentPlayerPosition() {
    Object.entries(this.keysPressed).forEach(([key, value]) => {
      if (key.length === 1 && value) {
        this.move(key);
      }
    });
  }

  update() {
    this.updateCurrentPlayerPosition();
    this.camera.perspectiveCamera.position.set(
      this.player.coordinates.x,
      this.player.coordinates.y,
      this.player.coordinates.z
    );
    this.camera.player.position.set(
      this.player.coordinates.x,
      this.player.coordinates.y,
      this.player.coordinates.z
    );
    this.camera.perspectiveCamera.quaternion.setFromEuler(
      new THREE.Euler(
        this.player.euler[0],
        this.player.euler[1],
        this.player.euler[2],
        "YXZ"
      )
    );
    this.renderer.render(this.scene, this.camera.perspectiveCamera);
    requestAnimationFrame(this.update.bind(this));
  }
}
