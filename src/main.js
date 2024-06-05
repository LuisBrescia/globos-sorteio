import { initScene, animate } from './scripts/scene-setup.js';
import { loadModel } from './scripts/model-loader.js';
import { startAnimation, togglePauseAnimation, restartAnimation } from './scripts/animation-controls.js';

initScene();
animate();
loadModel();

document.getElementById('startButton').addEventListener('click', startAnimation);
document.getElementById('pauseButton').addEventListener('click', togglePauseAnimation);
document.getElementById('restartButton').addEventListener('click', restartAnimation);

// Da para so colocar no body ou componente pai tambem
document.getElementById('menuButton').addEventListener('click', () => {
  document.getElementById('menuWrapper').classList.toggle('active');
});

// ao clicar fora da tela fora do menuwrapper ele fecha
document.addEventListener('click', (event) => {
  if (!event.target.closest('#menuWrapper') && !event.target.closest('#menuButton')) {
    document.getElementById('menuWrapper').classList.remove('active');
  }
});

document.getElementById('chooseOrder').addEventListener('click', () => {
  document.getElementById('modal').classList.add('active');
  document.getElementById('menuWrapper').classList.remove('active');
});

document.getElementById('closeDialog').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('active');
});

document.getElementById('saveOrder').addEventListener('click', () => {
  const order = document.getElementById('orderInput').value;
  localStorage.setItem('GloboSorteioOrdem', order);
  document.getElementById('modal').classList.remove('active');
});
