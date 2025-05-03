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

  startButton.addEventListener("click", () => {
    console.log("Botão JOGAR clicado!");

    game.start();
  });

  console.log("Jogo da cobrinha pronto para iniciar!");
});
