(function () {
    class Direction {
        public static Top = new Direction(0, -1);
        public static Bottom = new Direction(0, 1);
        public static Left = new Direction(-1, 0);
        public static Right = new Direction(1, 0);

        constructor(public xAxisOffset: number, public yAxisOffset) {
        }
    }

    class Point {
        constructor(
            private x: number,
            private y: number,
            private element: HTMLDivElement) {
        }

        public get X(): number {
            return this.x;
        }

        public get Y(): number {
            return this.y;
        }

        public setEmpty() {
            this.element.className = "grid-item";
        }

        public setSnakePart() {
            this.element.className = "grid-item snake-part";
        }

        public setSnakeHead() {
            this.element.className = "grid-item snake-head";
        }

        public setApple() {
            this.element.className = "grid-item apple";
        }

        public get isApple(): boolean {
            return this.element.className.includes('apple');
        }
    }

    class Field {
        private field: Array<Point> = [];

        constructor(private size, private boardElement: Element) {
            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    const div = document.createElement('div') as HTMLDivElement;
                    div.className = 'grid-item';
                    const point = new Point(j, i, div);
                    this.field.push(point);
                    boardElement.appendChild(div);
                }
            }
        }

        public getPoint(x: number, y: number): Point | null {
            if (x > -1 && x < size && y > -1 && y < size) {
                return this.field[y * size + x];
            }

            return null;
        }

        public spawnApple(takenPoint: Array<Point>): void {
            const emptyFields = this.field.filter((element) => {
                return !takenPoint.includes(element);
            });

            const appleIndex = Math.floor(Math.random() * emptyFields.length);

            emptyFields[appleIndex].setApple();
        }
    }

    class Snake {
        private snake: Array<Point> = [];

        constructor(private startPoint: Point, public direction: Direction, private field: Field) {
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


    document.addEventListener('keypress', (e: KeyboardEvent) => {
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