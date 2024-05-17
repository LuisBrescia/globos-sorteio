import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mixers, scene, renderer, camera } from './scene-setup.js';
import { audioLoader, listener } from './audio-loader.js';

const textureLoader = new THREE.TextureLoader();
export let actions = [];

export function loadModel(positionX, positionY, delay) {
  const loader = new GLTFLoader();
  loader.load('4Globe.glb', function (gltf) {
    const model = gltf.scene;
    model.position.set(positionX, positionY, 0);

    model.traverse((node) => {
      console.log(node);
      if (node.isMesh && node.name.match(/^Ball\d+$/)) {
        node.castShadow = true;
        node.receiveShadow = true;
        const ballNumber = parseInt(node.name.replace('Ball', ''), 10);
        const textureNumber = ballNumber % 10;
        const texture = textureLoader.load(`textures/Ball_${textureNumber}.png`);
        node.material = new THREE.MeshStandardMaterial({ map: texture });
      }
    });

    scene.add(model);

    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);
    const clips = gltf.animations;

    if (clips.length > 0) {
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;

        const sound = new THREE.PositionalAudio(listener);
        audioLoader.load('audio/whooshMid.mp3', function (buffer) {
          sound.setBuffer(buffer);
          sound.setRefDistance(200);
          sound.setLoop(false);
          sound.setVolume(0.5);
          model.add(sound);

          action._play = action.play;
          action.play = function () {
            sound.play();
            action._play();
          };
        });

        actions.push({ action, delay });
      });
    }

    renderer.render(scene, camera);
  }, undefined, function (error) {
    console.error(error);
  });
}
