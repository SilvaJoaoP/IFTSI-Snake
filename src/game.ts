import Snake from "./snake.js";
import Food from "./food.js";
import {
  checkCollision,
  checkWallCollision,
  checkFoodCollisionRecursive,
} from "./utils/collision.js";

export class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private snake: Snake;
  private food: Food;
  private score: number = 0;
  private gridSize: number = 30;
  private cellSize: number = 25;
  private gameStarted: boolean = false;
  private gamePaused: boolean = false;
  private countdownValue: number = 5;
  private initialCountdownValue: number = 5;
  private countdownInterval: number | null = null;
  private animationFrame: number | null = null;
  private countdownActive: boolean = false;
  private eatSound: HTMLAudioElement;
  private collisionSound: HTMLAudioElement;
  private lastUpdate: number = 0;
  private updateInterval: number = 150;
  private readonly initialUpdateInterval: number = 150;
  private scoreElement: HTMLElement | null = null;
  private lastMilestone: number = 0;
  private gameMode: string = "easy";
  private onGameOverCallback: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;

    this.canvas.width = this.gridSize * this.cellSize;
    this.canvas.height = this.gridSize * this.cellSize;

    this.snake = new Snake();
    this.food = new Food(this.gridSize);

    this.eatSound = new Audio('https://www.soundjay.com/buttons/beep-07a.mp3');
    this.collisionSound = new Audio('https://www.soundjay.com/buttons/beep-02.mp3');
    this.eatSound.volume = 0.3;
    this.collisionSound.volume = 0.1;

    this.scoreElement = document.createElement('div');
    this.scoreElement.id = 'score-display';
    this.scoreElement.style.color = '#FFFFFF';
    this.scoreElement.style.fontFamily = "'Press Start 2P', cursive";
    this.scoreElement.style.fontSize = '18px';
    this.scoreElement.style.textShadow = '1px 1px 3px rgba(0, 0, 0, 0.5)';
    this.scoreElement.style.marginBottom = '10px';
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.insertBefore(this.scoreElement, this.canvas);
    }

    document.addEventListener("keydown", this.handleKeyPress.bind(this));

    this.clearCanvas();
    this.updateScoreDisplay();
  }

  public start(mode: string): void {
    this.gameMode = mode;
    this.initialCountdownValue = 5;
    this.countdownValue = this.initialCountdownValue;
    this.countdownActive = true;
    this.gameStarted = false;
    this.gamePaused = false;
    this.startCountdown();
  }

  private startCountdown(): void {
    this.showCountdown();

    this.countdownInterval = window.setInterval(() => {
      if (!this.gamePaused && this.countdownActive) {
        this.countdownValue--;

        if (this.countdownValue <= 0) {
          clearInterval(this.countdownInterval as number);
          this.countdownInterval = null;
          this.countdownActive = false;
          this.startGame();
        } else {
          this.showCountdown();
        }
      }
    }, 1000);
  }

  private showCountdown(): void {
    this.clearCanvas();

    this.context.fillStyle = "#4CAF50";
    this.context.font = "80px 'Press Start 2P', cursive";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.shadowColor = "rgba(76, 175, 80, 0.5)";
    this.context.shadowBlur = 10;
    this.context.fillText(
      this.countdownValue.toString(),
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.context.shadowBlur = 0;
  }

  private startGame(): void {
    console.log(`Iniciando jogo no modo ${this.gameMode}...`);

    this.snake.resetToCenter();
    this.snake.setRandomDirection();
    this.gameStarted = true;
    this.gamePaused = false;
    this.countdownActive = false;

    this.generateSafeFood();

    this.lastUpdate = performance.now();
    this.update();
  }

  private update(timestamp: number = 0): void {
    if (!this.gameStarted || this.gamePaused) return;

    const deltaTime = timestamp - this.lastUpdate;
    if (deltaTime >= this.updateInterval) {
      this.clearCanvas();
      this.snake.move();
      this.checkCollisions();
      this.draw();
      this.updateScoreDisplay();
      this.checkScoreMilestone(this.score, this.lastMilestone);
      this.lastUpdate = timestamp;
    }

    this.animationFrame = requestAnimationFrame((time) => this.update(time));
  }

  private clearCanvas(): void {
    this.context.fillStyle = "#1a1a1a";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.strokeStyle = "rgba(76, 175, 80, 0.1)";
    this.context.lineWidth = 1;
    for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvas.height);
      this.context.stroke();
    }
    for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvas.width, y);
      this.context.stroke();
    }

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
      this.eatSound.currentTime = 0;
      this.eatSound.play().catch(error => console.error("Erro ao tocar som:", error));

      this.generateSafeFood();
    }

    if (checkWallCollision(head, this.gridSize, this.gridSize)) {
      console.log("Colisão com parede detectada!");
      this.collisionSound.currentTime = 0;
      this.collisionSound.play().catch(error => console.error("Erro ao tocar som:", error));
      this.endGame();
    }

    if (
      body.length > 4 &&
      checkCollision(head, this.snake.getBody().slice(3))
    ) {
      console.log("Colisão com o próprio corpo detectada!");
      this.collisionSound.currentTime = 0;
      this.collisionSound.play().catch(error => console.error("Erro ao tocar som:", error));
      this.endGame();
    }
  }

  private generateSafeFood(): void {
    let attempts = 0;
    let validPosition = false;

    while (!validPosition && attempts < 10) {
      this.food.respawn();
      validPosition = !this.isFoodOnSnakeBody(0);
      attempts++;
    }
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

  private checkScoreMilestone(currentScore: number, milestone: number): void {
    const nextMilestone = milestone + 15;

    if (this.gameMode === "hard" && currentScore >= nextMilestone && milestone === this.lastMilestone) {
      this.increaseSpeed();
      console.log(`Velocidade aumentada! Novo milestone: ${nextMilestone}`);
      this.lastMilestone = nextMilestone;
      this.checkScoreMilestone(currentScore, nextMilestone);
    }
  }

  private increaseSpeed(): void {
    this.updateInterval = this.updateInterval * 0.95;
    console.log(`Nova velocidade: ${this.updateInterval}ms`);
  }

  private draw(): void {
    this.drawSnake();
    this.drawFood();
  }

  private drawSnake(): void {
    const body = this.snake.getBody();

    body.forEach((segment, index) => {
      const x = segment.x * this.cellSize + this.cellSize / 2;
      const y = segment.y * this.cellSize + this.cellSize / 2;
      const radius = this.cellSize / 2 - 2;

      const gradient = this.context.createRadialGradient(
        x, y, 0,
        x, y, radius
      );
      if (index === 0) {
        gradient.addColorStop(0, "#4CAF50");
        gradient.addColorStop(1, "#2E7D32");
      } else {
        gradient.addColorStop(0, "#388E3C");
        gradient.addColorStop(1, "#1B5E20");
      }
      this.context.fillStyle = gradient;

      this.context.beginPath();
      this.context.arc(x, y, radius, 0, Math.PI * 2);
      this.context.fill();

      this.context.strokeStyle = "rgba(255, 255, 255, 0.3)";
      this.context.lineWidth = 1;
      this.context.beginPath();
      this.context.arc(x, y, radius - 2, Math.PI / 4, 3 * Math.PI / 4);
      this.context.stroke();

      if (index === 0) {
        const eyeRadius = 2;
        const eyeOffsetX = 3;
        const eyeOffsetY = -3;

        this.context.fillStyle = "#FFFFFF";
        this.context.beginPath();
        this.context.arc(
          x + eyeOffsetX,
          y + eyeOffsetY,
          eyeRadius,
          0,
          Math.PI * 2
        );
        this.context.arc(
          x - eyeOffsetX,
          y + eyeOffsetY,
          eyeRadius,
          0,
          Math.PI * 2
        );
        this.context.fill();

        this.context.fillStyle = "#000000";
        this.context.beginPath();
        this.context.arc(
          x + eyeOffsetX,
          y + eyeOffsetY,
          eyeRadius / 2,
          0,
          Math.PI * 2
        );
        this.context.arc(
          x - eyeOffsetX,
          y + eyeOffsetY,
          eyeRadius / 2,
          0,
          Math.PI * 2
        );
        this.context.fill();
      }

      this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
      this.context.shadowBlur = 5;
      this.context.fill();
      this.context.shadowBlur = 0;
    });
  }

  private drawFood(): void {
    if (this.food.position.x >= 0 && this.food.position.y >= 0) {
      const x = this.food.position.x * this.cellSize + this.cellSize / 2;
      const y = this.food.position.y * this.cellSize + this.cellSize / 2;

      const gradient = this.context.createRadialGradient(
        x - 3,
        y - 3,
        0,
        x,
        y,
        this.cellSize / 2
      );
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(0.5, "#FFD700");
      gradient.addColorStop(1, "#DAA520");
      this.context.fillStyle = gradient;

      this.context.beginPath();
      this.context.ellipse(
        x,
        y,
        this.cellSize / 2 - 4,
        this.cellSize / 3 - 2,
        0,
        0,
        Math.PI * 2
      );
      this.context.fill();

      this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
      this.context.shadowBlur = 5;
      this.context.fill();
      this.context.shadowBlur = 0;

      this.context.fillStyle = "rgba(139, 69, 19, 0.5)";
      this.context.beginPath();
      this.context.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
      this.context.arc(x + 2, y + 1, 1.5, 0, Math.PI * 2);
      this.context.fill();

      this.context.fillStyle = "rgba(255, 255, 255, 0.7)";
      this.context.beginPath();
      this.context.ellipse(
        x - 5,
        y - 5,
        3,
        2,
        Math.PI / 4,
        0,
        Math.PI * 2
      );
      this.context.fill();
    }
  }

  private updateScoreDisplay(): void {
    if (this.scoreElement) {
      this.scoreElement.textContent = `Pontuação: ${this.score} (Modo: ${this.gameMode})`;
    }
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (!this.gameStarted || this.gamePaused) return;

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
    this.gamePaused = false;
    this.countdownActive = false;
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    const finalScore = this.score;
    this.score = 0;
    this.lastMilestone = 0;
    this.updateInterval = this.initialUpdateInterval;
    console.log(`Velocidade restaurada para: ${this.updateInterval}ms`);
    this.updateScoreDisplay();

    this.context.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#FFFFFF";
    this.context.font = "30px 'Press Start 2P', cursive";
    this.context.textAlign = "center";
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";
    this.context.shadowBlur = 5;
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

    this.context.font = "18px 'Press Start 2P', cursive";
    this.context.fillText(
      "Escolha o modo para reiniciar",
      this.canvas.width / 2,
      this.canvas.height / 2 + 60
    );
    this.context.shadowBlur = 0;

    if (this.onGameOverCallback) {
      this.onGameOverCallback();
    }
  }

  public pause(): void {
    if (!this.gameStarted && this.countdownActive || (this.gameStarted && !this.gamePaused)) {
      this.gamePaused = true;
      if (this.animationFrame !== null) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      if (this.countdownInterval !== null) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      console.log("Jogo pausado durante a contagem ou jogo!");
    }
  }

  public resume(): void {
    if (this.gamePaused) {
      this.gamePaused = false;
      if (this.countdownActive && this.countdownValue > 0 && this.countdownInterval === null) {
        this.startCountdown();
      } else if (this.gameStarted) {
        this.lastUpdate = performance.now();
        this.update();
      }
      console.log("Jogo retomado!");
    }
  }

  public reset(): void {
    this.gameStarted = false;
    this.gamePaused = false;
    this.countdownActive = false;
    this.countdownValue = this.initialCountdownValue;
    this.score = 0;
    this.lastMilestone = 0;
    this.updateInterval = this.initialUpdateInterval;
    this.snake = new Snake();
    this.food = new Food(this.gridSize);
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.clearCanvas();
    this.updateScoreDisplay();
  }

  public getGameMode(): string {
    return this.gameMode;
  }

  public setOnGameOver(callback: () => void): void {
    this.onGameOverCallback = callback;
  }
}