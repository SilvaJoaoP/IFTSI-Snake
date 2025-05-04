import { Game } from "./game.js";
window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const startButton = document.getElementById("startButton");
    if (!canvas || !startButton) {
        console.error("Canvas ou botão não encontrados!");
        return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
        console.error("Não foi possível obter o contexto 2D do canvas.");
        return;
    }
    const game = new Game(canvas, context);
    startButton.style.display = "none";
    const modeSelectionMessage = document.createElement("div");
    modeSelectionMessage.id = "mode-selection-message";
    modeSelectionMessage.textContent = "Selecione o modo de jogo:";
    modeSelectionMessage.style.color = "#FFFFFF";
    modeSelectionMessage.style.fontFamily = "'Press Start 2P', cursive";
    modeSelectionMessage.style.fontSize = "16px";
    modeSelectionMessage.style.marginBottom = "10px";
    const easyButton = document.createElement("button");
    easyButton.textContent = "Fácil";
    easyButton.className = "mode-button easy-button";
    easyButton.addEventListener("click", () => {
        console.log("Modo Fácil selecionado!");
        game.start("easy");
        hideModeSelection();
        updateStartButton("PAUSE");
        startButton.style.display = "block";
    });
    const hardButton = document.createElement("button");
    hardButton.textContent = "Difícil";
    hardButton.className = "mode-button hard-button";
    hardButton.addEventListener("click", () => {
        console.log("Modo Difícil selecionado!");
        game.start("hard");
        hideModeSelection();
        updateStartButton("PAUSE");
        startButton.style.display = "block";
    });
    const resumeButton = document.createElement("button");
    resumeButton.textContent = "Retornar";
    resumeButton.className = "pause-button resume-button";
    resumeButton.style.display = "none";
    resumeButton.addEventListener("click", () => {
        game.resume();
        hidePauseOptions();
        updateStartButton("PAUSE");
        startButton.style.display = "block";
    });
    const changeModeButton = document.createElement("button");
    changeModeButton.textContent = "Mudar Dificuldade";
    changeModeButton.className = "pause-button change-mode-button";
    changeModeButton.style.display = "none";
    changeModeButton.addEventListener("click", () => {
        game.reset();
        showModeSelection();
        hidePauseOptions();
        startButton.style.display = "none";
    });
    const hideModeSelection = () => {
        modeSelectionMessage.style.display = "none";
        easyButton.style.display = "none";
        hardButton.style.display = "none";
    };
    const updateStartButton = (text) => {
        startButton.textContent = text;
        startButton.style.position = "relative";
        startButton.style.left = "50%";
        startButton.style.transform = "translateX(-50%)";
    };
    const showPauseOptions = () => {
        resumeButton.style.display = "inline-block";
        changeModeButton.style.display = "inline-block";
        startButton.style.display = "none";
    };
    const hidePauseOptions = () => {
        resumeButton.style.display = "none";
        changeModeButton.style.display = "none";
    };
    const gameContainer = document.querySelector(".game-container");
    if (gameContainer) {
        gameContainer.insertBefore(modeSelectionMessage, canvas);
        gameContainer.insertBefore(easyButton, canvas);
        gameContainer.insertBefore(hardButton, canvas);
        gameContainer.insertBefore(resumeButton, canvas);
        gameContainer.insertBefore(changeModeButton, canvas);
    }
    startButton.addEventListener("click", () => {
        console.log("Botão clicado!");
        if (startButton.textContent === "PAUSE") {
            game.pause();
            showPauseOptions();
        }
        else {
            game.start(game.getGameMode());
        }
    });
    game.setOnGameOver(() => {
        showModeSelection();
        updateStartButton("JOGAR");
        startButton.style.display = "none";
        hidePauseOptions();
    });
    const showModeSelection = () => {
        modeSelectionMessage.style.display = "block";
        easyButton.style.display = "inline-block";
        hardButton.style.display = "inline-block";
    };
    updateStartButton("JOGAR");
    console.log("Jogo da cobrinha pronto para iniciar!");
});
