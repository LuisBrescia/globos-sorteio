import { actions } from "./model-loader.js";

let isPaused = false;

export async function startAnimation() {
  const sorteioOrder =
    (await JSON.parse(localStorage.getItem("GloboSorteioOrdem"))) ||
    Array.from({ length: 10 }, () => []);

  let orderSize = 0;
  for (let i = 0; i <= sorteioOrder.length; i++) {
    if (sorteioOrder[i].length === 0) {
      orderSize = i;
      break;
    }
  }

  let result = "";
  for (let i = 0; i < orderSize; i++) {
    result += sorteioOrder[i].join("");
    result += i < orderSize - 1 ? ", " : "";
  }

  const tempoAnimacao = 27 * orderSize;
  setTimeout(() => {
    togglePauseAnimation();
    window.alert(`Fim da animação, números sorteados:\n ${result}`);
  }, tempoAnimacao * 1000);

  actions.forEach((action) => {
    if (action._clip.name.match(/^Globe\d+$/)) {
      action._clip.tracks = [action._clip.tracks[0]];
      action._clip.duration = tempoAnimacao;
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
