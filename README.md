# Snake Game

Este é um projeto simples do jogo da cobrinha (Snake) desenvolvido em TypeScript. O jogo é inspirado nos clássicos jogos de celular e foi projetado para ser jogado em um navegador.

## Estrutura do Projeto

O projeto é organizado da seguinte forma:

```
snake-game
├── src
│   ├── index.ts        # Ponto de entrada do jogo
│   ├── game.ts         # Classe que gerencia o estado do jogo
│   ├── snake.ts        # Classe que representa a cobra
│   ├── food.ts         # Classe que representa a comida
│   ├── utils
│   │   └── collision.ts # Funções utilitárias para verificar colisões
│   └── types
│       └── index.ts    # Tipos e interfaces utilizados no projeto
├── public
│   ├── index.html      # Página HTML que carrega o jogo
│   └── styles.css      # Estilos para a página HTML e o canvas
├── package.json         # Configuração do npm
├── tsconfig.json        # Configuração do TypeScript
└── README.md            # Documentação do projeto
```

## Instalação

Para instalar e executar o projeto, siga os passos abaixo:

1. Clone o repositório:

   ```
   git clone <URL_DO_REPOSITORIO>
   cd snake-game
   ```

2. Instale as dependências:

   ```
   npm install
   ```

3. Compile o TypeScript:

   ```
   npm run build
   ```

4. Abra o arquivo `public/index.html` em um navegador para jogar.

## Como Jogar

- Use as teclas de seta do teclado para mover a cobra.
- O objetivo do jogo é comer a comida que aparece aleatoriamente no tabuleiro.
- Cada vez que a cobra come, ela cresce e o jogo se torna mais desafiador.
- O jogo termina se a cobra colidir com as bordas do tabuleiro ou com ela mesma.

## Recursividade

O jogo utiliza uma função recursiva para atualizar o estado do jogo em cada iteração do loop principal. Essa abordagem permite que o jogo continue rodando até que uma condição de término seja atingida.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorias e correções.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.
