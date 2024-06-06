import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mixers, scene, renderer, camera } from './scene-setup.js';
import { predefinedOrder } from '@/config/predefinedOrder.js';

const textureLoader = new THREE.TextureLoader();
export let actions = [];

// Constantes para a quantidade de números e globos
const QUANTIDADE_NUMEROS = predefinedOrder.length;
const QUANTIDADE_GLOBOS = predefinedOrder[0].length;

// Salva a ordem dos números em localStorage
const orderLocalStorage = Array.from({ length: QUANTIDADE_NUMEROS }, () => []);
for (let i = 0; i < QUANTIDADE_NUMEROS; i++) {
  for (let j = 0; j < QUANTIDADE_GLOBOS; j++) {
    orderLocalStorage[i].push(predefinedOrder[i][j]);
  }
}
console.log(orderLocalStorage);
localStorage.setItem('GloboSorteioOrdem', JSON.stringify(orderLocalStorage));

// Função para carregar o modelo
export function loadModel() {
  const loader = new GLTFLoader();
  loader.load('4Globe.glb', (gltf) => {
    const model = gltf.scene;
    model.position.set(0, -2, 0);

    model.traverse((node) => {
      if (node.name.match(/^Ball\d+$/)) {
        const ballNumber = node.name.replace('Ball', '');
        const globoIndex = parseInt(ballNumber[0], 10) - 1;
        const ballIndex = parseInt(ballNumber[1], 10);

        // Verifica se o número da bola é maior que a quantidade de bolas
        if (ballIndex >= QUANTIDADE_NUMEROS) {
          node.visible = false;
        } else {
          const textureNumber = predefinedOrder[ballIndex][globoIndex];
          const texture = textureLoader.load(`Textures/Ball_${textureNumber}.png`);
          texture.flipY = false;
          node.material = new THREE.MeshStandardMaterial({ map: texture });
          node.material.metalness = 0;
          node.material.roughness = 1;
          // tirar sombras que batem nela
          node.castShadow = false;
          node.receiveShadow = false;
          // bola tem que ser branca
          node.material.color = new THREE.Color(0xffffff);
          node.material.transparent = true;
        }
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
