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

let mixer; // Declarar o mixer de animação
let actions = []; // Armazenar as ações de animação

// Carregar o modelo 3D
const loader = new GLTFLoader();
loader.load('Globo.glb', function (gltf) {
  const model = gltf.scene;
  model.position.y -= 2; // Posicionar o modelo um pouco mais abaixo
  scene.add(model);

  // Configurar o mixer de animação
  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;

  if (clips.length > 0) {
    // Preparar as ações de animação do modelo
    clips.forEach((clip) => {
      const action = mixer.clipAction(clip);
      actions.push(action);
    });
  }

  renderer.render(scene, camera);
}, undefined, function (error) {
  console.error(error);
});

camera.position.z = 5;

// Função de animação
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); // Tempo passado desde o último frame

  // Atualizar o mixer de animação
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}
animate();

// Função para iniciar a animação
function startAnimation() {
  if (actions.length > 0) {
    actions.forEach((action) => {
      action.play();
    });
  }
}

// Adicionar evento de clique ao botão
document.getElementById('startButton').addEventListener('click', startAnimation);
