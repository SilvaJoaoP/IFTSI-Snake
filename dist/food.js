class Food {
    constructor(gridSize = 20) {
        this.gridSize = gridSize;
        // Inicia com posição fora da tela
        this.position = { x: -1, y: -1 };
    }
    generateRandomPosition() {
        // Garante que a comida fique dentro dos limites do tabuleiro
        return {
            x: Math.max(0, Math.min(this.gridSize - 1, Math.floor(Math.random() * this.gridSize))),
            y: Math.max(0, Math.min(this.gridSize - 1, Math.floor(Math.random() * this.gridSize))),
        };
    }
    respawn() {
        this.position = this.generateRandomPosition();
    }
}
export default Food;
