import { Position } from "./types";

class Food {
  position: Position;
  gridSize: number;

  constructor(gridSize = 20) {
    this.gridSize = gridSize;
    // Inicia com posição fora da tela
    this.position = { x: -1, y: -1 };
  }

  generateRandomPosition(): Position {
    // Garante que a comida fique dentro dos limites do tabuleiro
    return {
      x: Math.max(
        0,
        Math.min(this.gridSize - 1, Math.floor(Math.random() * this.gridSize))
      ),
      y: Math.max(
        0,
        Math.min(this.gridSize - 1, Math.floor(Math.random() * this.gridSize))
      ),
    };
  }

  respawn(): void {
    this.position = this.generateRandomPosition();
  }
}

export default Food;
