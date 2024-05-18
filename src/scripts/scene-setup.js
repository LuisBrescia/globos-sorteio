import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

export let scene, camera, renderer, controls;
export const mixers = [];

const MACRO_CONTROLS = false; // Ativar controles de órbita

export function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 600;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true; // Habilitar sombras
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  controls = MACRO_CONTROLS ? new OrbitControls(camera, renderer.domElement) : null;
  if (MACRO_CONTROLS) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
  }

  // Carregar o ambiente EXR
  const exrLoader = new EXRLoader();
  exrLoader.load('sunset.exr', function (texture) {
    console.log(texture);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  });

  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const direcionaLight = new THREE.DirectionalLight(0xffffff, 2);
  direcionaLight.position.set(0, 0, 100);
  direcionaLight.castShadow = true; // Habilitar sombras
}

const clock = new THREE.Clock();

export function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  mixers.forEach((mixer) => {
    mixer.update(delta);
  });

  if (MACRO_CONTROLS) {
    controls.update();
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
