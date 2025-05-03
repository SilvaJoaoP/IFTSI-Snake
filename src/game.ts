import Snake from "./snake";
import Food from "./food";
import {
  checkCollision,
  checkWallCollision,
  checkFoodCollisionRecursive,
} from "./utils/collision";

export class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private snake: Snake;
  private food: Food;
  private gameLoop: number | null = null;
  private score: number = 0;
  private gridSize: number = 20;
  private cellSize: number = 20;
  private gameStarted: boolean = false;
  private countdownValue: number = 5;
  private countdownInterval: number | null = null;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;

    // Configura o tamanho do canvas
    this.canvas.width = this.gridSize * this.cellSize;
    this.canvas.height = this.gridSize * this.cellSize;

    this.snake = new Snake();
    this.food = new Food(this.gridSize);

    document.addEventListener("keydown", this.handleKeyPress.bind(this));

    this.clearCanvas();
  }

  public start(): void {
    this.startCountdown();
  }

  private startCountdown(): void {
    this.countdownValue = 5;
    this.showCountdown();

    this.countdownInterval = window.setInterval(() => {
      this.countdownValue--;

      if (this.countdownValue <= 0) {
        clearInterval(this.countdownInterval as number);
        this.countdownInterval = null;
        this.startGame();
      } else {
        this.showCountdown();
      }
    }, 1000);
  }

  private showCountdown(): void {
    this.clearCanvas();

    this.context.fillStyle = "white";
    this.context.font = "80px Arial";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      this.countdownValue.toString(),
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  startGame() {
    console.log("Iniciando jogo depois da contagem...");

    this.snake.resetToCenter();
    this.snake.setRandomDirection();

    this.gameStarted = true;

    this.generateSafeFood();

    this.update();
  }

  private update(): void {
    if (!this.gameStarted) return;

    this.clearCanvas();

    this.snake.move();

    this.checkCollisions();

    this.draw();

    if (this.gameStarted) {
      if (this.gameLoop !== null) {
        clearTimeout(this.gameLoop as unknown as number);
        this.gameLoop = null;
      }

      // Agendar a próxima atualização
      this.gameLoop = setTimeout(() => {
        this.update();
      }, 150) as unknown as number;
    }
  }

  private clearCanvas(): void {
    this.context.fillStyle = "#222";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.strokeStyle = "#4CAF50";
    this.context.lineWidth = 2;
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private checkCollisions(): void {
    const head = this.snake.getHead();
    const body = this.snake.getBody();

    if (checkFoodCollisionRecursive(head, this.food.position)) {
      console.log("Comida coletada!");
      this.snake.eat();
      this.score += 10;

      this.generateSafeFood();
    }

    if (checkWallCollision(head, this.gridSize, this.gridSize)) {
      console.log("Colisão com parede detectada!");
      this.endGame();
    }

    if (
      body.length > 4 &&
      checkCollision(head, this.snake.getBody().slice(3))
    ) {
      console.log("Colisão com o próprio corpo detectada!");
      this.endGame();
    }
  }

  private generateSafeFood(): void {
    let attempts = 0;
    let validPosition = false;

    while (!validPosition && attempts < 10) {
      this.food.respawn();
      validPosition = !this.isFoodOnSnake();
      attempts++;
    }
  }

  private isFoodOnSnake(): boolean {
    const body = this.snake.getBody();

    for (const segment of body) {
      if (
        segment.x === this.food.position.x &&
        segment.y === this.food.position.y
      ) {
        return true;
      }
    }

    return false;
  }

  private isFoodOnSnakeBody(index: number): boolean {
    const body = this.snake.getBody();

    if (index >= body.length) return false;

    if (
      body[index].x === this.food.position.x &&
      body[index].y === this.food.position.y
    ) {
      return true;
    }

    return this.isFoodOnSnakeBody(index + 1);
  }

  private draw(): void {
    this.drawSnake();

    this.drawFood();

    this.drawScore();
  }

  private drawSnake(): void {
    const body = this.snake.getBody();

    body.forEach((segment, index) => {
      if (index === 0) {
        this.context.fillStyle = "#4CAF50";
      } else {
        this.context.fillStyle = "#388E3C";
      }

      this.context.fillRect(
        segment.x * this.cellSize,
        segment.y * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      );
    });
  }

  private drawFood(): void {
    if (this.food.position.x >= 0 && this.food.position.y >= 0) {
      this.context.fillStyle = "#FF5722";
      this.context.beginPath();
      this.context.arc(
        this.food.position.x * this.cellSize + this.cellSize / 2,
        this.food.position.y * this.cellSize + this.cellSize / 2,
        this.cellSize / 2 - 2,
        0,
        Math.PI * 2
      );
      this.context.fill();
    }
  }

  private drawScore(): void {
    this.context.fillStyle = "#FFFFFF";
    this.context.font = "20px Arial";
    this.context.textAlign = "left";
    this.context.fillText(`Pontuação: ${this.score}`, 10, 25);
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (!this.gameStarted) return;

    switch (event.key) {
      case "w":
        this.snake.changeDirection({ x: 0, y: -1 });
        break;
      case "s":
        this.snake.changeDirection({ x: 0, y: 1 });
        break;
      case "a":
        this.snake.changeDirection({ x: -1, y: 0 });
        break;
      case "d":
        this.snake.changeDirection({ x: 1, y: 0 });
        break;
    }
  }

  private endGame(): void {
    console.log("Fim de jogo!");

    this.gameStarted = false;
    if (this.gameLoop !== null) {
      clearTimeout(this.gameLoop as unknown as number);
      this.gameLoop = null;
    }

    const finalScore = this.score;

    this.score = 0;

    this.context.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#FFFFFF";
    this.context.font = "30px Arial";
    this.context.textAlign = "center";
    this.context.fillText(
      "Game Over!",
      this.canvas.width / 2,
      this.canvas.height / 2 - 20
    );
    this.context.fillText(
      `Pontuação: ${finalScore}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 20
    );

    this.context.font = "20px Arial";
    this.context.fillText(
      "Pressione o botão JOGAR para reiniciar",
      this.canvas.width / 2,
      this.canvas.height / 2 + 60
    );
  }
}
