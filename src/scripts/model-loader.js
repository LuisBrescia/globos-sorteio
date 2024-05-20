import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mixers, scene, renderer, camera } from './scene-setup.js';

const textureLoader = new THREE.TextureLoader();
export let actions = [];

const orderChoose = [
  [5, 0, 7, 8, 1, 2, 9, 4, 3, 6],
  [7, 5, 6, 2, 3, 0, 1, 8, 9, 4],
  [2, 9, 6, 0, 4, 5, 3, 7, 1, 8],
  [3, 9, 2, 4, 1, 5, 6, 7, 8, 0],
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const order = [];
for (let i = 0; i < 4; i++) {
  const array = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  order.push(array);
}

const orderLocalStorage = Array.from({ length: 10 }, () => []);
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 4; j++) {
    orderLocalStorage[i].push(order[j][i]);
  }
}
console.log(orderLocalStorage);
localStorage.setItem('GloboSorteioOrdem', JSON.stringify(orderLocalStorage));

export function loadModel() {
  const loader = new GLTFLoader();
  loader.load('4Globe.glb', (gltf) => {
    const model = gltf.scene;
    model.position.set(0, -2, 0);

    model.traverse((node) => {
      if (node.name.match(/^Ball\d+$/)) {
        const ballNumber = node.name.replace('Ball', '');
        const textureNumber = order[parseInt(ballNumber[0], 10) - 1][parseInt(ballNumber[1], 10)];
        const texture = textureLoader.load(`Textures/Ball_${textureNumber}.png`);
        texture.flipY = false;
        // inverter cores da textura
        node.material = new THREE.MeshStandardMaterial({ map: texture });
        node.material.metalness = 0;
        node.material.roughness = 1;
      } else if (node.isMesh) {
        node.material.metalness = 1;
        node.material.roughness = 0.25;
        console.log("MESH", node.name);
      } else {
        console.log("NOT MESH:", node.name);
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
  }, undefined, function (error) {
    console.error(error);
  });
}
