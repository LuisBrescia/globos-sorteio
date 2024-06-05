import { initScene, animate } from './scripts/scene-setup.js';
import { loadModel } from './scripts/model-loader.js';
import { startAnimation, togglePauseAnimation, restartAnimation } from './scripts/animation-controls.js';

initScene();
animate();
loadModel();

document.getElementById('startButton').addEventListener('click', startAnimation);
document.getElementById('pauseButton').addEventListener('click', togglePauseAnimation);
document.getElementById('restartButton').addEventListener('click', restartAnimation);

document.getElementById('menuButton').addEventListener('click', () => {
  document.getElementById('menuContent').classList.toggle('active');
  document.getElementById('menuButton').classList.toggle('active');
});
