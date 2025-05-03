import { Position } from "./types";

class Snake {
  private body: Position[];
  private direction: { x: number; y: number };
  private grow: boolean;
  private lastDirectionChange: number = 0;

  constructor() {
    this.body = [];
    this.direction = { x: 1, y: 0 };
    this.grow = false;
    this.lastDirectionChange = 0;
    this.resetToCenter();
  }

  resetToCenter(): void {
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

  private chooseRandomDirection(): void {
    const random = Math.floor(Math.random() * 4);
    switch (random) {
      case 0:
        this.direction = { x: 0, y: -1 };
        break;
      case 1:
        this.direction = { x: 1, y: 0 };
        break;
      case 2:
        this.direction = { x: 0, y: 1 };
        break;
      case 3:
        this.direction = { x: -1, y: 0 };
        break;
    }
  }

  setRandomDirection(): void {
    this.chooseRandomDirection();
  }

  move(): void {
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

  changeDirection(newDirection: Position) {
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

    this.direction = newDirection;
    this.lastDirectionChange = now;
  }

  eat(): void {
    this.grow = true;
  }

  getHead(): Position {
    return this.body[0];
  }

  getBody(): Position[] {
    return this.body;
  }
}

export default Snake;
