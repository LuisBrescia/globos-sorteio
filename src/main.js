import { toggleStateAnimation, restartAnimation } from './scripts/animation-controls.js';
import { toggleMenu, changeTheme, bodyCloseMenu, openModal, closeModal } from './scripts/menu-controls.js';

document.addEventListener('DOMContentLoaded', async () => {
  const { initScene, animate } = await import('./scripts/scene-setup.js');
  const { loadModel } = await import('./scripts/model-loader.js');
  initScene();
  animate();
  loadModel();
});

const predefinedOrder = JSON.parse(localStorage.getItem('GloboSorteioOrdem')) || Array.from({ length: 10 }, () => []);
let currentRound = 0;

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
  const globoIndex = parseInt(globoId.replace('globo', '')) - 1;
  const currentSelection = predefinedOrder[currentRound][globoIndex];

  if (currentSelection === number) {
    predefinedOrder[currentRound][globoIndex] = null;
  } else {
    // ? Para não ter números repetidos no mesmo round
    // if (predefinedOrder[currentRound].includes(number)) {
    //   alert(`Number ${number} is already selected for this round!`);
    //   return;
    // }
    predefinedOrder[currentRound][globoIndex] = number;
  }

  updateButtons();
  console.log('Predefined Order:', predefinedOrder);
}
function updateButtons() {
  document.querySelectorAll('.button-section').forEach((container, globoIndex) => {
    const buttons = container.querySelectorAll('.btn-number');
    buttons.forEach(button => {
      const number = parseInt(button.textContent);
      if (predefinedOrder[currentRound][globoIndex] === number) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }

      if (isNumberUsedInGlobo(globoIndex, number)) {
        button.classList.add('disabled');
      } else {
        button.classList.remove('disabled');
      }
    });
  });
}

function isNumberUsedInGlobo(globoIndex, number) {
  return predefinedOrder.some((round, roundIndex) => roundIndex !== currentRound && round[globoIndex] === number);
}

document.getElementById('prevRound').addEventListener('click', () => {
  if (currentRound > 0) {
    currentRound--;
    document.getElementById('roundDisplay').textContent = `Rodada ${currentRound + 1}`;
    updateButtons();
  }
});

document.getElementById('nextRound').addEventListener('click', () => {
  if (currentRound < 9) {
    currentRound++;
    document.getElementById('roundDisplay').textContent = `Rodada ${currentRound + 1}`;
    updateButtons();
  }
});

createNumberButtons('globo1');
createNumberButtons('globo2');
createNumberButtons('globo3');
createNumberButtons('globo4');

document.getElementById('menuButton').addEventListener('click', toggleMenu);
document.getElementById('changeThemeButton').addEventListener('click', changeTheme);
document.getElementById('stateButton').addEventListener('click', toggleStateAnimation);
document.getElementById('restartButton').addEventListener('click', restartAnimation);
document.getElementById('customButton').addEventListener('click', openModal);

document.addEventListener('click', bodyCloseMenu);
document.getElementById('closeModal').addEventListener('click', closeModal);

document.getElementById('saveOrder').addEventListener('click', () => {
  localStorage.setItem('GloboSorteioOrdem', JSON.stringify(predefinedOrder));
  window.location.reload();
  document.getElementById('modal').classList.remove('active');
});

updateButtons();
