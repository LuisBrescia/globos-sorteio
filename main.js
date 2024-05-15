import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Configurar a cena, câmera e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4a0e28); // Definir a cor de fundo

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adicionar luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

let mixers = []; // Declarar os mixers de animação
let actions = []; // Armazenar as ações de animação

// Função para carregar o modelo e adicionar animação
function loadModel(positionX, delay) {
  const loader = new GLTFLoader();
  loader.load('Globo.glb', function (gltf) {
    const model = gltf.scene;
    model.position.set(positionX, -2, 0); // Posicionar o modelo
    scene.add(model);

    // Configurar o mixer de animação
    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);
    const clips = gltf.animations;

    if (clips.length > 0) {
      // Preparar as ações de animação do modelo
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        actions.push({ action, delay });
      });
    }

    renderer.render(scene, camera);
  }, undefined, function (error) {
    console.error(error);
  });
}

// Carregar os 4 modelos alinhados com um delay de 3 segundos
loadModel(-6, 0);
loadModel(-2, 3000);
loadModel(2, 6000);
loadModel(6, 9000);

camera.position.z = 10;

// Função de animação
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); // Tempo passado desde o último frame

  // Atualizar os mixers de animação
  mixers.forEach((mixer) => {
    mixer.update(delta);
  });

  renderer.render(scene, camera);
}
animate();

// Função para iniciar as animações com delay
function startAnimation() {
  actions.forEach(({ action, delay }) => {
    setTimeout(() => {
      action.play();
    }, delay);
  });
}

// Função para pausar/retomar animações
let isPaused = false;
function togglePauseAnimation() {
  isPaused = !isPaused;
  actions.forEach(({ action }) => {
    action.paused = isPaused;
  });

  document.getElementById('pauseButton').innerText = isPaused ? 'Resume Animation' : 'Pause Animation';
}

// Adicionar eventos de clique aos botões
document.getElementById('startButton').addEventListener('click', startAnimation);
document.getElementById('pauseButton').addEventListener('click', togglePauseAnimation);
