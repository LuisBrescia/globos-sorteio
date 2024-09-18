import { actions } from "./model-loader.js";

let isPaused = false;

export async function startAnimation() {
  const sorteioOrder =
    (await JSON.parse(localStorage.getItem("GloboSorteioOrdem"))) ||
    Array.from({ length: 10 }, () => []);

  let orderSize = 0;
  for (let i = 0; i <= sorteioOrder.length; i++) {
    if (sorteioOrder[i].length === 0 || sorteioOrder[i][0] == null) {
      orderSize = i;
      break;
    }
  }

  actions.forEach((action) => {
    if (action._clip.name.match(/^Globe\d+$/)) {
      console.log(action);
      action._clip.tracks = [action._clip.tracks[0]];
      action._clip.duration = 26 * orderSize;
    }
    action.reset().play();
  });

  document.getElementById("stateButton").innerText = "Pausar";
}

export function togglePauseAnimation() {
  isPaused = !isPaused;
  actions.forEach((action) => {
    action.paused = isPaused;
  });

  document.getElementById("stateButton").innerText = isPaused
    ? "Resumir"
    : "Pausar";
}

export function toggleStateAnimation() {
  if (document.getElementById("stateButton").innerText != "INICIAR") {
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
