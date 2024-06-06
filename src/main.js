import { initScene, animate } from './scripts/scene-setup.js';
import { loadModel } from './scripts/model-loader.js';
import { toggleStateAnimation, restartAnimation } from './scripts/animation-controls.js';
import { toggleMenu, changeTheme, bodyCloseMenu, openModal, closeModal } from './scripts/menu-controls.js';

initScene();
animate();
loadModel();

document.getElementById('menuButton').addEventListener('click', toggleMenu);
document.getElementById('changeThemeButton').addEventListener('click', changeTheme);
document.getElementById('stateButton').addEventListener('click', toggleStateAnimation);
document.getElementById('restartButton').addEventListener('click', restartAnimation);
document.getElementById('customButton').addEventListener('click', openModal);

document.addEventListener('click', bodyCloseMenu);
document.getElementById('closeModal').addEventListener('click', closeModal);

document.getElementById('saveOrder').addEventListener('click', () => {
  // const order = document.getElementById('orderInput').value;
  // localStorage.setItem('GloboSorteioOrdem', order);
  document.getElementById('modal').classList.remove('active');
});

// main.js
const predefinedOrder = Array.from({ length: 10 }, () => [null, null, null, null]);

function createNumberButtons(globoId) {
  const container = document.getElementById(globoId);
  for (let i = 0; i <= 9; i++) {
    const button = document.createElement('button');
    button.classList.add('btn-number');
    button.textContent = i;
    button.addEventListener('click', () => selectNumber(globoId, i));
    container.appendChild(button);
  }
}

function selectNumber(globoId, number) {
  // Deselect previous selection for this globo
  document.querySelectorAll(`#${globoId} .btn-number`).forEach(btn => btn.classList.remove('selected'));

  // Select the clicked button
  const button = document.querySelector(`#${globoId} .btn-number:nth-child(${number + 1})`);
  button.classList.add('selected');

  // Update predefinedOrder
  const globoIndex = parseInt(globoId.replace('globo', '')) - 1;
  predefinedOrder.forEach(order => order[globoIndex] = null);
  predefinedOrder[number][globoIndex] = number;
  console.log('Predefined Order:', predefinedOrder);
}

createNumberButtons('globo1');
createNumberButtons('globo2');
createNumberButtons('globo3');
createNumberButtons('globo4');
