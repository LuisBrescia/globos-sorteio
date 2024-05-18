import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mixers, scene, renderer, camera } from './scene-setup.js';
import { audioLoader, listener } from './audio-loader.js';

const textureLoader = new THREE.TextureLoader();
export let actions = [];

// Numeros de 0 a 9
// const order = [
//   [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
//   [1, 0, 2, 3, 4, 5, 6, 7, 8, 9],
// ];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const order = [];

for (let i = 0; i < 4; i++) { // assumindo que você quer 4 vetores
  const array = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  order.push(array);
}

export function loadModel() {
  const loader = new GLTFLoader();
  loader.load('4Globe.glb', (gltf) => {
    const model = gltf.scene;
    model.position.set(0, -2, 0);

    model.traverse((node) => {

      if (node.isMesh && node.name.match(/^Ball\d+$/)) {
        node.castShadow = true;
        node.receiveShadow = true;
        const ballNumber = node.name.replace('Ball', '');
        const textureNumber = order[parseInt(ballNumber[0], 10) - 1][parseInt(ballNumber[1], 10)];
        const texture = textureLoader.load(`Textures/Ball_${textureNumber}.png`);
        texture.flipY = false;
        node.material = new THREE.MeshStandardMaterial({ map: texture });
      } else if (node.isMesh && node.name.startsWith('Base')) {
        console.log(node.name);
        const texture = textureLoader.load(`Textures/Wood.jpg`);
        node.material = new THREE.MeshStandardMaterial({ map: texture, roughness: 1, metalness: 0.5 });
      } else if (node.isMesh && node.name.startsWith('Sphere')) {
        const texture = textureLoader.load(`Textures/Globe.jpg`);
        node.material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3, metalness: 1 });
      } else if (!node.isMesh) {
        console.log("NOT MESH");
      }

      // Globe tube parte de baixo // preto
    });

    scene.add(model);
    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);
    const clips = gltf.animations;
    const animationNames = [];
    console.log(clips);

    // for (let i = 0; i <= 9; i++) {
    //   for (let j = 1; j <= 4; j++) {
    //     animationNames.push(`Globe${j}`, `Ball${j}${i}`, `Sphere.00${j}`);
    //   }
    // }

    // let selecionados = [];

    // animationNames.forEach((name) => {
    //   const clipSelecionado = clips.find((clip) => clip.name === name);
    //   if (clipSelecionado) {
    //     selecionados.push(clipSelecionado);
    //     const actionSelecionado = mixer.clipAction(clipSelecionado);
    //     actionSelecionado.setLoop(THREE.LoopOnce);
    //     actionSelecionado.clampWhenFinished = true;
    //     actions.push(actionSelecionado);
    //   }
    // });

    clips.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      actions.push(action);
    });

    renderer.render(scene, camera);
  }, undefined, function (error) {
    console.error(error);
  });
}
