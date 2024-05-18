import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export let scene, camera, renderer, controls;
export const mixers = [];

const MACRO_CONTROLS = false; // Ativar controles de órbita

export function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(1, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 600;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use sombras suaves
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  controls = MACRO_CONTROLS ? new OrbitControls(camera, renderer.domElement) : null;
  if (MACRO_CONTROLS) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
  }

  // Adicionar luzes
  // Luz ambiente para iluminação geral suave
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.position.set(0, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.bias = -0.0001;
  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0xFFFFFF, 2);
  spotLight.position.set(5, 20, 5);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.5;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.near = 0.1;
  spotLight.shadow.camera.far = 50;
  spotLight.shadow.bias = -0.0001;
  scene.add(spotLight);
  // const hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, .5);
  // hemisphereLight.position.set(0, 200, 0);
  // scene.add(hemisphereLight);

  // const directionalLightFrente = new THREE.DirectionalLight(0xFFFFFF, .5);
  // directionalLightFrente.position.set(10, 0, 10).normalize();
  // scene.add(directionalLightFrente);

  // const directionalLightCima = new THREE.DirectionalLight(0xFFFFFF, .5);
  // directionalLightCima.position.set(-10, 10, 0).normalize();
  // scene.add(directionalLightCima);
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
