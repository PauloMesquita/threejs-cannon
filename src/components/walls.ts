import * as THREE from "three";

export class Walls {
  constructor(scene: THREE.Scene) {
    const colorTexture = new THREE.TextureLoader().load(
      "./bricks/Bricks_Terracotta_003_basecolor.jpg"
    );
    const ocTexture = new THREE.TextureLoader().load(
      "./bricks/Bricks_Terracotta_003_ambientOcclusion.jpg"
    );
    const heightTexture = new THREE.TextureLoader().load(
      "./bricks/Bricks_Terracotta_003_height.png"
    );
    const normalTexture = new THREE.TextureLoader().load(
      "./bricks/Bricks_Terracotta_003_normal.jpg"
    );
    const roughnessTexture = new THREE.TextureLoader().load(
      "./bricks/Bricks_Terracotta_003_roughness.jpg"
    );
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.repeat.set(60, 2);

    const material = new THREE.MeshStandardMaterial({
      map: colorTexture,
      aoMap: ocTexture,
      displacementMap: heightTexture,
      roughnessMap: roughnessTexture,
      normalMap: normalTexture,
    });

    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(300, 1, 10), material);
    wall1.position.set(0, 4.5, 150);
    wall1.rotation.x = -Math.PI / 2;

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(300, 1, 10), material);
    wall2.position.set(0, 4.5, -150);
    wall2.rotation.x = -Math.PI / 2;

    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(300, 1, 10), material);
    wall3.position.set(-150, 4.5, 0);
    wall3.rotation.x = -Math.PI / 2;
    wall3.rotation.z = -Math.PI / 2;

    const wall4 = new THREE.Mesh(new THREE.BoxGeometry(300, 1, 10), material);
    wall4.position.set(150, 4.5, 0);
    wall4.rotation.x = -Math.PI / 2;
    wall4.rotation.z = -Math.PI / 2;

    scene.add(wall1);
    scene.add(wall2);
    scene.add(wall3);
    scene.add(wall4);
  }
}
