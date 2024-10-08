import * as THREE from "three";
import { mixers, scene, renderer, camera } from "./scene-setup.js";

const textureLoader = new THREE.TextureLoader();
export let actions = [];

export async function loadModel(sorteioOrder) {
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader");
  const { DRACOLoader } = await import(
    "three/examples/jsm/loaders/DRACOLoader"
  );
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);

  // Promises para carregar o modelo GLB
  const modelPromise = new Promise((resolve, reject) => {
    loader.load("4Globe-draco.glb", resolve, undefined, reject);
  });

  // Promises para carregar texturas
  const texturePromises = [];
  sorteioOrder.forEach((order) => {
    order.forEach((textureNumber) => {
      texturePromises.push(
        new Promise((resolve, reject) => {
          textureLoader.load(
            `Textures/Ball_${textureNumber}.png`,
            resolve,
            undefined,
            reject
          );
        })
      );
    });
  });

  // Carregar modelo e texturas em paralelo
  Promise.all([modelPromise, ...texturePromises])
    .then(([gltf, ...textures]) => {
      const model = gltf.scene;
      model.position.set(0, -2, 0);

      model.traverse((node) => {
        if (node.name.match(/^Ball\d+$/)) {
          const ballNumber = node.name.replace("Ball", "");
          const globoIndex = parseInt(ballNumber[0], 10) - 1;
          const ballIndex = parseInt(ballNumber[1], 10);

          let orderSize = 0;
          for (let i = 0; i < sorteioOrder.length; i++) {
            if (sorteioOrder[i].length === 0) {
              orderSize = i;
              break;
            }
          }

          if (ballIndex >= orderSize) {
            node.visible = false;
          } else {
            const textureNumber = sorteioOrder[ballIndex][globoIndex];
            const texture = textures.find((tex) =>
              tex.image.src.includes(`Ball_${textureNumber}.png`)
            );
            texture.flipY = false;
            node.material = new THREE.MeshStandardMaterial({ map: texture });
            node.material.metalness = 0;
            node.material.roughness = 1;
            node.castShadow = false;
            node.receiveShadow = false;
            node.material.color = new THREE.Color(0xffffff);
            node.material.transparent = true;
          }
        } else if (node.isMesh) {
          node.material.metalness = 1;
          node.material.roughness = 0.25;
        }
      });

      scene.add(model);
      const mixer = new THREE.AnimationMixer(model);
      mixers.push(mixer);
      const clips = gltf.animations;

      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        actions.push(action);
      });

      renderer.render(scene, camera);
    })
    .catch((error) => {
      console.error("Erro ao carregar modelo ou texturas:", error);
    });
}
