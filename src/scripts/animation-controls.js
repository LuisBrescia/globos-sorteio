import { actions } from './model-loader.js';

let isPaused = false;

export function startAnimation() {
  actions.forEach(({ action, delay }) => {
    setTimeout(() => {
      action.reset().play();
    }, delay);
  });
}

export function togglePauseAnimation() {
  isPaused = !isPaused;
  actions.forEach(({ action }) => {
    action.paused = isPaused;
  });

  document.getElementById('pauseButton').innerText = isPaused ? 'Resumir animação' : 'Pausar animação';
}

export function restartAnimation() {
  actions.forEach(({ action }) => {
    action.stop();
  });
  startAnimation();
}
