function checkCollision(head, body) {
    for (let segment of body) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    return false;
}
function checkWallCollision(head, boardWidth, boardHeight) {
    return (head.x < 0 || head.x >= boardWidth || head.y < 0 || head.y >= boardHeight);
}
function checkFoodCollision(head, food) {
    return head.x === food.x && head.y === food.y;
}
function checkFoodCollisionRecursive(head, food) {
    if (head.x === food.x && head.y === food.y) {
        return true;
    }
    return false;
}
function checkYCoordinateRecursive(y1, y2) {
    if (y1 === y2)
        return true;
    return false;
}
export { checkCollision, checkWallCollision, checkFoodCollision, checkFoodCollisionRecursive, checkYCoordinateRecursive, };
