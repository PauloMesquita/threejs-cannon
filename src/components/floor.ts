import * as THREE from "three";

export class Floor {
  constructor(scene: THREE.Scene) {
    const colorTexture = new THREE.TextureLoader().load(
      "./concrete/Concrete_Blocks_012_basecolor.jpg"
    );
    const ocTexture = new THREE.TextureLoader().load(
      "./concrete/Concrete_Blocks_012_ambientOcclusion.jpg"
    );
    const heightTexture = new THREE.TextureLoader().load(
      "./concrete/Concrete_Blocks_012_height.png"
    );
    const normalTexture = new THREE.TextureLoader().load(
      "./concrete/Concrete_Blocks_012_normal.jpg"
    );
    const roughnessTexture = new THREE.TextureLoader().load(
      "./concrete/Concrete_Blocks_012_roughness.jpg"
    );
    colorTexture.wrapS = THREE.RepeatWrapping;
    colorTexture.wrapT = THREE.RepeatWrapping;
    colorTexture.repeat.set(64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: colorTexture,
      aoMap: ocTexture,
      displacementMap: heightTexture,
      roughnessMap: roughnessTexture,
      normalMap: normalTexture,
    });
    material.metalness = 0;
    material.roughness = 1;
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(300, 300, 8, 8),
      material
    );
    planeMesh.material.side = THREE.DoubleSide;
    planeMesh.rotation.x = -Math.PI / 2;
    planeMesh.position.y = -0.5;
    scene.add(planeMesh);
  }
}
