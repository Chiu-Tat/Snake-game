import {
  createInitialState,
  setDirection,
  spawnFood,
  step,
} from "../gameLogic.js";

const resultsEl = document.querySelector("#results");
let passed = 0;
let failed = 0;

runTest("moves snake one cell per tick", () => {
  const state = createInitialState({
    width: 8,
    height: 8,
    initialSnake: [{ x: 3, y: 3 }],
    initialDirection: "right",
  });
  const next = step(state, () => 0);
  assert(next.snake[0].x === 4 && next.snake[0].y === 3);
});

runTest("prevents direct reverse when length > 1", () => {
  const state = createInitialState({
    width: 8,
    height: 8,
    initialSnake: [
      { x: 4, y: 4 },
      { x: 3, y: 4 },
    ],
    initialDirection: "right",
  });
  const reversed = setDirection(state, "left");
  const next = step(reversed, () => 0);
  assert(next.snake[0].x === 5 && next.snake[0].y === 4);
});

runTest("grows and increases score after eating food", () => {
  const state = {
    ...createInitialState({
      width: 6,
      height: 6,
      initialSnake: [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
      ],
      initialDirection: "right",
    }),
    food: { x: 3, y: 2 },
  };
  const next = step(state, () => 0);
  assert(next.snake.length === 3);
  assert(next.score === 1);
});

runTest("ends game on wall collision", () => {
  const state = createInitialState({
    width: 4,
    height: 4,
    initialSnake: [{ x: 3, y: 1 }],
    initialDirection: "right",
  });
  const next = step(state, () => 0);
  assert(next.gameOver === true);
});

runTest("ends game on self collision", () => {
  const state = createInitialState({
    width: 7,
    height: 7,
    initialSnake: [
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
    ],
    initialDirection: "up",
  });
  const towardBody = setDirection(state, "left");
  const next = step(towardBody, () => 0);
  assert(next.gameOver === true);
});

runTest("spawns food only in empty cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const food = spawnFood(3, 2, snake, () => 0);
  assert(food.x === 0 && food.y === 1);
});

appendSummary();

function runTest(name, fn) {
  try {
    fn();
    passed += 1;
    appendLine(`PASS: ${name}`, true);
  } catch (error) {
    failed += 1;
    appendLine(`FAIL: ${name} - ${error.message}`, false);
  }
}

function assert(condition, message = "Assertion failed") {
  if (!condition) {
    throw new Error(message);
  }
}

function appendLine(text, ok) {
  const li = document.createElement("li");
  li.className = ok ? "pass" : "fail";
  li.textContent = text;
  resultsEl.appendChild(li);
}

function appendSummary() {
  const li = document.createElement("li");
  li.textContent = `Summary: ${passed} passed, ${failed} failed`;
  li.className = failed === 0 ? "pass" : "fail";
  resultsEl.appendChild(li);
}
