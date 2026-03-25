(function initSnakeLogic(globalObj) {
  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  const OPPOSITE_DIRECTION = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };

  function createInitialState(config = {}, rng = Math.random) {
    const width = config.width ?? 20;
    const height = config.height ?? 20;
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const fallbackSnake = [
      { x: centerX, y: centerY },
      { x: Math.max(0, centerX - 1), y: centerY },
      { x: Math.max(0, centerX - 2), y: centerY },
    ];
    const initialSnake = config.initialSnake ?? fallbackSnake;
    const direction = config.initialDirection ?? "right";
    const snake = copySnake(initialSnake);
    const food = spawnFood(width, height, snake, rng);

    return {
      width,
      height,
      snake,
      direction,
      pendingDirection: direction,
      food,
      score: 0,
      gameOver: false,
      paused: false,
    };
  }

  function setDirection(state, nextDirection) {
    if (!DIRECTIONS[nextDirection]) {
      return state;
    }
    if (
      state.snake.length > 1 &&
      OPPOSITE_DIRECTION[state.direction] === nextDirection
    ) {
      return state;
    }

    return {
      ...state,
      pendingDirection: nextDirection,
    };
  }

  function togglePause(state) {
    if (state.gameOver) {
      return state;
    }
    return {
      ...state,
      paused: !state.paused,
    };
  }

  function step(state, rng = Math.random) {
    if (state.gameOver || state.paused) {
      return state;
    }

    const direction = state.pendingDirection;
    const delta = DIRECTIONS[direction];
    const head = state.snake[0];
    const nextHead = {
      x: head.x + delta.x,
      y: head.y + delta.y,
    };

    if (!isInBounds(nextHead, state.width, state.height)) {
      return {
        ...state,
        direction,
        gameOver: true,
      };
    }

    const willEat =
      state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
    const candidateSnake = [nextHead, ...state.snake];

    if (!willEat) {
      candidateSnake.pop();
    }

    if (hasSelfCollision(candidateSnake)) {
      return {
        ...state,
        direction,
        gameOver: true,
      };
    }

    if (willEat) {
      const food = spawnFood(state.width, state.height, candidateSnake, rng);
      return {
        ...state,
        snake: candidateSnake,
        direction,
        food,
        score: state.score + 1,
        gameOver: !food,
      };
    }

    return {
      ...state,
      snake: candidateSnake,
      direction,
    };
  }

  function spawnFood(width, height, snake, rng = Math.random) {
    const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
    const emptyCells = [];

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key = `${x},${y}`;
        if (!occupied.has(key)) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    const index = Math.floor(rng() * emptyCells.length);
    return emptyCells[index];
  }

  function isInBounds(position, width, height) {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < width &&
      position.y < height
    );
  }

  function hasSelfCollision(snake) {
    const seen = new Set();
    for (const segment of snake) {
      const key = `${segment.x},${segment.y}`;
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
    }
    return false;
  }

  function copySnake(snake) {
    return snake.map((segment) => ({ x: segment.x, y: segment.y }));
  }

  globalObj.SnakeLogic = {
    DIRECTIONS,
    createInitialState,
    setDirection,
    togglePause,
    step,
    spawnFood,
  };
})(window);
