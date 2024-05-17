import { initScene, animate } from './scripts/scene-setup.js';
import { loadModel } from './scripts/model-loader.js';
import { startAnimation, togglePauseAnimation, restartAnimation } from './scripts/animation-controls.js';

// Inicializar a cena e animação
initScene();
animate();

// Carregar os 4 modelos alinhados com um delay de 3 segundos
loadModel(0, -2, 0);

// Adicionar eventos de clique aos botões
document.getElementById('startButton').addEventListener('click', startAnimation);
document.getElementById('pauseButton').addEventListener('click', togglePauseAnimation);
document.getElementById('restartButton').addEventListener('click', restartAnimation);
