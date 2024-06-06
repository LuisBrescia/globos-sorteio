import { actions } from './model-loader.js';

let isPaused = false;

export function startAnimation() {
  actions.forEach((action) => {
    action.reset().play();
  });

  document.getElementById('stateButton').innerText = 'Pausar';
}

export function togglePauseAnimation() {
  isPaused = !isPaused;
  actions.forEach((action) => {
    action.paused = isPaused;
  });

  document.getElementById('stateButton').innerText = isPaused ? 'Resumir' : 'Pausar';
}

export function toggleStateAnimation() {
  console.log("State", document.getElementById('stateButton').innerText);
  if (document.getElementById('stateButton').innerText != 'INICIAR') {
    togglePauseAnimation();
  } else {
    startAnimation();
  }
}

export function restartAnimation() {
  actions.forEach((action) => {
    action.stop();
  });
  startAnimation();
}
