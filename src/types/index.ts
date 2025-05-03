export interface Position {
    x: number;
    y: number;
}

export interface Snake {
    body: Position[];
    direction: { x: number, y: number };
    grow: boolean;
}

export interface Food {
    position: Position;
}

export interface GameState {
    snake: Snake;
    food: Food;
    score: number;
    isGameOver: boolean;
}