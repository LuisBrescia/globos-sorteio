import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const MACRO_CONTROLS = true; // Ativar controles de órbita

// Configurar a cena, câmera e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4a0e28); // Definir a cor de fundo

const camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Ativar antialiasing
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Aumentar a resolução
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
if (MACRO_CONTROLS) {
  controls.enableDamping = true; // Ativar amortecimento (inércia)
  controls.dampingFactor = 0.25; // Fator de amortecimento
  controls.screenSpacePanning = false; // Habilitar ou desabilitar o panning na tela
}

// Adicionar luz hemisférica
const hemisphereLight = new THREE.HemisphereLight(0xFFFFCC, 0x444444, 1); // Luz hemisférica para iluminação uniforme
hemisphereLight.position.set(0, 200, 0);
scene.add(hemisphereLight);

// Adicionar luzes direcionais
const directionalLightFrente = new THREE.DirectionalLight(0xFFFFFF, 2);
directionalLightFrente.position.set(0, 0, 10).normalize();
scene.add(directionalLightFrente);

const directionalLightCima = new THREE.DirectionalLight(0xFFFFFF, 2);
directionalLightCima.position.set(0, 10, 0).normalize();
scene.add(directionalLightCima);

let mixers = []; // Declarar os mixers de animação
let actions = []; // Armazenar as ações de animação

// Carregar o som
const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader();

const textureLoader = new THREE.TextureLoader();

// Função para carregar o modelo e adicionar animação e som
function loadModel(positionX, positionY, delay) {
  const loader = new GLTFLoader();
  loader.load('Globo.glb', function (gltf) {
    const model = gltf.scene;
    model.position.set(positionX, positionY, 0); // Posicionar o modelo

    model.traverse((node) => {
      if (node.name.match(/^Ball\d+$/)) {
        const ballNumber = parseInt(node.name.replace('Ball', ''), 10);
        console.log(`Ball number: ${ballNumber}`);
        const textureNumber = ballNumber % 10;
        console.log(`Texture number: ${textureNumber}`);
        const texture = textureLoader.load(`Textures/Ball_${textureNumber}.png`);
        console.log(`Textures/Ball_${textureNumber}.png`);
        node.material = new THREE.MeshStandardMaterial({ map: texture });
      }
    });

    scene.add(model);

    // Configurar o mixer de animação
    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);
    const clips = gltf.animations;

    if (clips.length > 0) {
      // Preparar as ações de animação do modelo
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce); // Definir para rodar apenas uma vez
        action.clampWhenFinished = true; // Manter a última pose quando terminar

        // Adicionar som ao modelo
        const sound = new THREE.PositionalAudio(listener);
        audioLoader.load('whooshMid.mp3', function (buffer) {
          sound.setBuffer(buffer);
          sound.setRefDistance(20);
          sound.setLoop(false); // Não repetir o som
          model.add(sound);

          // Tocar o som quando a animação começar
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

// Carregar os 4 modelos alinhados com um delay de 3 segundos
loadModel(0, -2, 0);

camera.position.z = 600;

// Função de animação
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); // Tempo passado desde o último frame

  // Atualizar os mixers de animação
  mixers.forEach((mixer) => {
    mixer.update(delta);
  });

  if (MACRO_CONTROLS) {
    controls.update();
  }

  renderer.render(scene, camera);
}

animate();

// Função para iniciar as animações com delay
function startAnimation() {
  actions.forEach(({ action, delay }) => {
    setTimeout(() => {
      action.reset().play();
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

  document.getElementById('pauseButton').innerText = isPaused ? 'Resumir animação' : 'Pausar animação';
}

// Função para reiniciar as animações
function restartAnimation() {
  actions.forEach(({ action }) => {
    action.stop();
  });
  startAnimation();
}

// Adicionar eventos de clique aos botões
document.getElementById('startButton').addEventListener('click', startAnimation);
document.getElementById('pauseButton').addEventListener('click', togglePauseAnimation);
document.getElementById('restartButton').addEventListener('click', restartAnimation);
