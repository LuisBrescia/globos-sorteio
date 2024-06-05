import { actions } from './model-loader.js';

let isPaused = false;

export function startAnimation() {
  actions.forEach((action) => {
    action.reset().play();
  });
}

export function togglePauseAnimation() {
  isPaused = !isPaused;
  actions.forEach((action) => {
    action.paused = isPaused;
  });

  document.getElementById('pauseButton').innerText = isPaused ? 'Resumir' : 'Pausar';
}

export function restartAnimation() {
  actions.forEach((action) => {
    action.stop();
  });
  startAnimation();
}
