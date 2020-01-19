const maxSpeedFactor = 10;

const up = 'up';
const down = 'down';
const left = 'left';
const right = 'right';

const directions = [
  { name: up, xChange: 0, yChange: -1 },
  { name: down, xChange: 0, yChange: 1 },
  { name: left, xChange: -1, yChange: 0 },
  { name: right, xChange: 1, yChange: 0 },
]


class Point {
  #x;
  #y;

  constructor(x, y) {
    if (!Number.isInteger(x)) {
      throw ('x is not valid coordinate')
    }

    if (!Number.isInteger(y)) {
      throw ('y is not valid coordinate')
    }

    this.#x = x;
    this.#y = y;
  }

  equals(point) {
    return this.#x === point.#x && this.#y === point.#y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
}

class Game {
  static get maxSpeedFactor() {
    return maxSpeedFactor;
  }

  #food;

  get food() {
    return this.#food;
  }

  #previousDirection;

  #snake = [];

  get snake() {
    return this.#snake;
  }

  #score = 0;

  get score() {
    return this.#score;
  }

  #speedFactor = 1;

  get speedFactor() {
    return this.#speedFactor;
  }

  #width;

  get width() {
    return this.#width;
  };

  #height;

  get height() {
    return this.#height;
  };

  #boundaries;

  constructor(width, height, boundaries) {
    if (!Number.isInteger(width) || width < 10) {
      throw 'Incorrect width';
    }

    if (!Number.isInteger(height) || height < 10) {
      throw 'Incorrect height';
    }

    this.#boundaries = !!boundaries;
    this.#width = width;
    this.#height = height
    this.#previousDirection = directions.find(x => x.name === right);

    const halfWidth = Math.round(this.width / 2);
    const halfHeight = Math.round(this.height / 2);

    this.snake.push(new Point(halfWidth, halfHeight));
    this.snake.push(new Point(halfWidth + 1, halfHeight));
    this.snake.push(new Point(halfWidth + 2, halfHeight));

    this.createFood();
  }

  move(directionName) {
    let direction = directions.find(x => x.name === directionName) || this.#previousDirection;

    // Check for imposable move (turn over)
    if (direction.xChange * this.#previousDirection.xChange === -1 ||
      direction.yChange * this.#previousDirection.yChange === -1) {
      direction = this.#previousDirection;
    }

    this.#previousDirection = direction;

    const newPosition = new Point(
      (this.width + this.head.x + direction.xChange) % this.width,
      (this.height + this.head.y + direction.yChange) % this.height);

    // hit snake or wall (for boundaries mode) 
    if (this.snake.some((x, index) => newPosition.equals(x) && index !== 0)
      || (this.#boundaries
        && (this.head.x + direction.xChange < 0
          || this.head.x + direction.xChange >= this.width
          || this.head.y + direction.yChange < 0
          || this.head.y + direction.yChange >= this.height))) {
      return false;
    } else if (newPosition.equals(this.food)) {
      this.snake.push(newPosition);
      this.#score++;

      if (this.score % 5 === 0 && this.speedFactor < Game.maxSpeedFactor) {
        this.#speedFactor++;
      }

      this.createFood();
    } else {
      this.snake.shift();
      this.snake.push(newPosition);
    }

    return true;
  }

  get head() {
    return this.snake[this.snake.length - 1];
  }

  createFood() {
    const emptyFields = [];
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const point = new Point(i, j);
        if (!this.snake.some((x) => x.equals(point))) {
          emptyFields.push(point);
        }
      }
    }

    const randomPointIndex = Math.floor(Math.random() * Math.floor(emptyFields.length - 1));

    this.#food = emptyFields[randomPointIndex];
  }
}

export {
  Game,
  up as UpDirection,
  down as DownDirection,
  left as LeftDirection,
  right as RightDirection
}
