import * as THREE from "three";
import { PlayerInfo } from "./types";

export class OtherPlayers {
  scene: THREE.Scene;
  otherPlayersObjs: Record<string, THREE.Mesh>;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.otherPlayersObjs = {};
  }

  update(otherPlayersInfo: Record<string, PlayerInfo>) {
    Object.entries(otherPlayersInfo).forEach(([key, value]) => {
      if (!this.otherPlayersObjs[key]) {
        const player = new THREE.Mesh(
          new THREE.BoxGeometry(1, 2, 1),
          new THREE.MeshBasicMaterial({ color: "#ff0000" })
        );
        this.otherPlayersObjs[key] = player;
        this.scene.add(this.otherPlayersObjs[key]);
      }
      this.otherPlayersObjs[key].position.set(
        value.coordinates.x,
        value.coordinates.y,
        value.coordinates.z
      );
      this.otherPlayersObjs[key].quaternion.setFromEuler(
        new THREE.Euler(value.euler[0], value.euler[1], value.euler[2], "YXZ")
      );
    });
    const updateKeys = Object.keys(otherPlayersInfo);
    Object.entries(this.otherPlayersObjs).forEach(([key, value]) => {
      if (!updateKeys.includes(key)) {
        this.scene.remove(value);
        delete this.otherPlayersObjs[key];
      }
    });
  }
}
