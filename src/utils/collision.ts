import { Position } from "../types";

function checkCollision(head: Position, body: Position[]): boolean {
  for (let segment of body) {
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }
  return false;
}

function checkWallCollision(
  head: Position,
  boardWidth: number,
  boardHeight: number
): boolean {
  return (
    head.x < 0 || head.x >= boardWidth || head.y < 0 || head.y >= boardHeight
  );
}

function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}

function checkFoodCollisionRecursive(head: Position, food: Position): boolean {
  if (head.x === food.x && head.y === food.y) {
    return true;
  }

  return false;
}

function checkYCoordinateRecursive(y1: number, y2: number): boolean {
  if (y1 === y2) return true;

  return false;
}

export {
  checkCollision,
  checkWallCollision,
  checkFoodCollision,
  checkFoodCollisionRecursive,
  checkYCoordinateRecursive,
};
