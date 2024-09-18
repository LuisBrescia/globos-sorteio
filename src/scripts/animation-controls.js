import { actions } from "./model-loader.js";

let isPaused = false;
let timerHandle = null;
let remainingTime = 0;
let startTime = 0;
let sorteioOrder = [];

function generateResult() {
  const orderSize = sorteioOrder.findIndex((array) => array.length === 0);
  return sorteioOrder
    .slice(0, orderSize)
    .map((sub) => sub.join(""))
    .join(", ");
}

export async function startAnimation() {
  sorteioOrder =
    (await JSON.parse(localStorage.getItem("GloboSorteioOrdem"))) ||
    Array.from({ length: 10 }, () => []);

  const result = generateResult();
  const tempoAnimacao = 27 * (result.split(", ").length || 0); // Calculate based on non-empty entries only

  startTime = Date.now();
  remainingTime = tempoAnimacao * 1000;
  timerHandle = setTimeout(() => {
    togglePauseAnimation();
    window.alert(`Fim da animação, números sorteados:\n ${result}`);
  }, remainingTime);

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

  if (isPaused) {
    clearTimeout(timerHandle);
    remainingTime -= Date.now() - startTime;
  } else {
    startTime = Date.now();
    timerHandle = setTimeout(() => {
      const result = generateResult(); // Reuse the same function to generate result
      togglePauseAnimation(true);
      window.alert(`Fim da animação, números sorteados:\n${result}`);
    }, remainingTime);
  }

  document.getElementById("stateButton").innerText = isPaused
    ? "Resumir"
    : "Pausar";
}

export function toggleStateAnimation() {
  if (document.getElementById("stateButton").innerText !== "INICIAR") {
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
