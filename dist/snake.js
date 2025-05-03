class Snake {
  constructor() {
    this.body = [];
    this.direction = { x: 1, y: 0 };
    this.grow = false;
    this.lastDirectionChange = 0;
    this.resetToCenter();
  }

  resetToCenter() {
    const centerX = 10;
    const centerY = 10;
    this.body = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ];

    this.direction = { x: 1, y: 0 };

    this.grow = false;
  }

  chooseRandomDirection() {
    const random = Math.floor(Math.random() * 4);
    switch (random) {
      case 0:
        this.direction = { x: 0, y: -1 };
        break; // cima
      case 1:
        this.direction = { x: 1, y: 0 };
        break; // direita
      case 2:
        this.direction = { x: 0, y: 1 };
        break; // baixo
      case 3:
        this.direction = { x: -1, y: 0 };
        break; // esquerda
    }
  }

  setRandomDirection() {
    this.chooseRandomDirection();
  }
  move() {
    const head = {
      x: this.body[0].x + this.direction.x,
      y: this.body[0].y + this.direction.y,
    };

    this.body.unshift(head);

    if (this.grow) {
      this.grow = false;
    } else {
      this.body.pop();
    }
  }
  changeDirection(newDirection) {
    const now = Date.now();
    if (now - this.lastDirectionChange < 80) {
      return;
    }

    const currentDirection = { x: this.direction.x, y: this.direction.y };

    const isOppositeDirection =
      newDirection.x + currentDirection.x === 0 &&
      newDirection.y + currentDirection.y === 0;

    if (isOppositeDirection) {
      return;
    }

    const head = this.getHead();
    const nextPosition = {
      x: head.x + newDirection.x,
      y: head.y + newDirection.y,
    };

    const bodyExceptTail = this.body.slice(0, -1);
    for (let segment of bodyExceptTail) {
      if (nextPosition.x === segment.x && nextPosition.y === segment.y) {
        console.log(
          "Movimento bloqueado: colisão com o corpo seria inevitável"
        );
        return;
      }
    }

    this.direction = newDirection;
    this.lastDirectionChange = now;
  }
  eat() {
    this.grow = true;
  }
  getHead() {
    return this.body[0];
  }
  getBody() {
    return this.body;
  }
}
export default Snake;
