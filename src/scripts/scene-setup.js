import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export let scene, camera, renderer, controls;
export const mixers = [];

const MACRO_CONTROLS = true; // Ativar controles de órbita

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x4a0e28);

  camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 600;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  if (MACRO_CONTROLS) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
  }

  // Adicionar luzes
  const hemisphereLight = new THREE.HemisphereLight(0xFFFFCC, 0x444444, 1);
  hemisphereLight.position.set(0, 200, 0);
  scene.add(hemisphereLight);

  const directionalLightFrente = new THREE.DirectionalLight(0xFFFFFF, 2);
  directionalLightFrente.position.set(0, 0, 10).normalize();
  scene.add(directionalLightFrente);

  const directionalLightCima = new THREE.DirectionalLight(0xFFFFFF, 2);
  directionalLightCima.position.set(0, 10, 0).normalize();
  scene.add(directionalLightCima);
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
