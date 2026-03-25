# Snake (Classic)

Minimal, dependency-free Snake implementation with:
- Grid movement
- Food spawning
- Growth and score
- Game-over on wall/self collision
- Restart and pause/resume

## Run

1. Open `index.html` in your browser.
2. Play on the main board.

No build step or dependency install is required.

## Controls

- Keyboard: Arrow keys or `W/A/S/D`
- Pause/Resume: `P` or `Space` (or the Pause button)
- Restart: Restart button
- On-screen controls: Up/Left/Down/Right buttons

## Tests

1. Open `tests/run-tests.html` in your browser.
2. Confirm all tests pass in the rendered summary.

## Manual Verification Checklist

- Controls:
  - Arrow keys and `W/A/S/D` change direction.
  - Reverse direction is blocked while snake length > 1.
- Pause/Restart:
  - Pause stops movement and Resume continues.
  - Restart resets snake, score, and game-over state.
- Boundaries and collisions:
  - Hitting a wall ends the game.
  - Hitting the snake body ends the game.
- Food and score:
  - Eating food increases score by 1.
  - Snake length increases after eating.
  - New food does not appear on snake cells.
