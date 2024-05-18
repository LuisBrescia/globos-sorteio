import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mixers, scene, renderer, camera } from './scene-setup.js';
import { audioLoader, listener } from './audio-loader.js';

const textureLoader = new THREE.TextureLoader();
export let actions = [];

export function loadModel() {
  const loader = new GLTFLoader();
  loader.load('4Globe.glb', (gltf) => {
    const model = gltf.scene;
    model.position.set(0, -2, 0);

    model.traverse((node) => {
      if (node.isMesh && node.name.match(/^Ball\d+$/)) {
        node.castShadow = true;
        node.receiveShadow = true;
        const ballNumber = parseInt(node.name.replace('Ball', ''), 10);
        const textureNumber = ballNumber % 10;

        const texture = textureLoader.load(`textures/Ball_${textureNumber}.png`);
        texture.flipY = false;

        node.material = new THREE.MeshStandardMaterial({ map: texture });
      }
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
