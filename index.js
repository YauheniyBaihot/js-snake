(function () {
    class Direction {
        constructor(xAxisOffset, yAxisOffset) {
            this.xAxisOffset = xAxisOffset;
            this.yAxisOffset = yAxisOffset;
        }
    }
    Direction.Top = new Direction(0, -1);
    Direction.Bottom = new Direction(0, 1);
    Direction.Left = new Direction(-1, 0);
    Direction.Right = new Direction(1, 0);
    class Point {
        constructor(x, y, element) {
            this.x = x;
            this.y = y;
            this.element = element;
        }
        get X() {
            return this.x;
        }
        get Y() {
            return this.y;
        }
        setEmpty() {
            this.element.className = "grid-item";
        }
        setSnakePart() {
            this.element.className = "grid-item snake-part";
        }
        setSnakeHead() {
            this.element.className = "grid-item snake-head";
        }
        setApple() {
            this.element.className = "grid-item apple";
        }
        get isApple() {
            return this.element.className.includes('apple');
        }
    }
    class Field {
        constructor(size, boardElement) {
            this.size = size;
            this.boardElement = boardElement;
            this.field = [];
            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    const div = document.createElement('div');
                    div.className = 'grid-item';
                    const point = new Point(j, i, div);
                    this.field.push(point);
                    boardElement.appendChild(div);
                }
            }
        }
        getPoint(x, y) {
            if (x > -1 && x < size && y > -1 && y < size) {
                return this.field[y * size + x];
            }
            return null;
        }
        spawnApple(takenPoint) {
            const emptyFields = this.field.filter((element) => {
                return !takenPoint.includes(element);
            });
            const appleIndex = Math.floor(Math.random() * emptyFields.length);
            emptyFields[appleIndex].setApple();
        }
    }
    class Snake {
        constructor(startPoint, direction, field) {
            this.startPoint = startPoint;
            this.direction = direction;
            this.field = field;
            this.snake = [];
            startPoint.setSnakeHead();
            this.snake.push(startPoint);
            this.field.spawnApple(this.snake);
        }
        move() {
            const currentHead = this.snake[this.snake.length - 1];
            const newHead = this.field.getPoint(currentHead.X + this.direction.xAxisOffset, currentHead.Y + this.direction.yAxisOffset);
            if (newHead === null || this.snake.indexOf(newHead) > -1) {
                throw 'Game Over';
            }
            const grow = newHead.isApple;
            currentHead.setSnakePart();
            newHead.setSnakeHead();
            this.snake.push(newHead);
            if (grow === true) {
                this.field.spawnApple(this.snake);
                return;
            }
            const emptyPoint = this.snake.shift();
            emptyPoint.setEmpty();
        }
    }
    const size = 20;
    const elementSize = 100 / size;
    document.styleSheets[0].insertRule(`.grid-item { width: ${elementSize}%; }`);
    const gameElement = document.getElementsByClassName('game')[0];
    var game = new Field(size, gameElement);
    var snake = new Snake(game.getPoint(size / 2, size / 2), Direction.Left, game);
    var k = 1;
    document.addEventListener('keypress', (e) => {
        if (e.code === 'KeyW') {
            if (snake.direction != Direction.Bottom) {
                snake.direction = Direction.Top;
            }
        }
        if (e.code === 'KeyD') {
            if (snake.direction != Direction.Left) {
                snake.direction = Direction.Right;
            }
        }
        if (e.code === 'KeyS') {
            if (snake.direction != Direction.Top) {
                snake.direction = Direction.Bottom;
            }
        }
        if (e.code === 'KeyA') {
            if (snake.direction != Direction.Right) {
                snake.direction = Direction.Left;
            }
        }
    });
    var interval = setInterval(() => {
        try {
            snake.move();
        }
        catch (e) {
            clearInterval(interval);
            throw e;
        }
    }, 100);
})();
//# sourceMappingURL=index.js.map