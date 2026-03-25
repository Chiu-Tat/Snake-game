const { createInitialState, setDirection, step, togglePause } = window.SnakeLogic;

const TICK_MS = 140;
const BOARD_SIZE = 20;

const boardEl = document.querySelector("#board");
const scoreEl = document.querySelector("#score");
const statusEl = document.querySelector("#status");
const pauseBtn = document.querySelector("#pause-btn");
const restartBtn = document.querySelector("#restart-btn");
const touchButtons = Array.from(document.querySelectorAll("[data-dir]"));

let state = createInitialState({ width: BOARD_SIZE, height: BOARD_SIZE });

render();

setInterval(() => {
  state = step(state);
  render();
}, TICK_MS);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === " " || key === "p") {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }

  const nextDirection = keyToDirection(key);
  if (!nextDirection) {
    return;
  }

  event.preventDefault();
  state = setDirection(state, nextDirection);
});

pauseBtn.addEventListener("click", () => {
  state = togglePause(state);
  render();
});

restartBtn.addEventListener("click", () => {
  state = createInitialState({ width: BOARD_SIZE, height: BOARD_SIZE });
  render();
});

touchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dir = button.getAttribute("data-dir");
    state = setDirection(state, dir);
  });
});

function keyToDirection(key) {
  if (key === "arrowup" || key === "w") {
    return "up";
  }
  if (key === "arrowdown" || key === "s") {
    return "down";
  }
  if (key === "arrowleft" || key === "a") {
    return "left";
  }
  if (key === "arrowright" || key === "d") {
    return "right";
  }
  return null;
}

function render() {
  const cells = new Array(BOARD_SIZE * BOARD_SIZE).fill("cell");
  for (const segment of state.snake) {
    const index = segment.y * BOARD_SIZE + segment.x;
    cells[index] += " snake";
  }
  if (state.food) {
    const index = state.food.y * BOARD_SIZE + state.food.x;
    cells[index] += " food";
  }

  boardEl.innerHTML = cells.map((className) => `<div class="${className}"></div>`).join("");
  scoreEl.textContent = String(state.score);

  if (state.gameOver) {
    statusEl.textContent = "Game Over";
  } else if (state.paused) {
    statusEl.textContent = "Paused";
  } else {
    statusEl.textContent = "Running";
  }
  pauseBtn.textContent = state.paused ? "Resume" : "Pause";
  pauseBtn.disabled = state.gameOver;
}
