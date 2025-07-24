const Gameboard = (function () {
      const board = ["", "", "", "", "", "", "", "", ""];
      const getBoard = () => board;
      const reset = () => board.fill("");
      const setCell = (index, mark) => {
        if (!board[index]) {
          board[index] = mark;
          return true;
        }
        return false;
      };
      return { getBoard, setCell, reset };
    })();

    const Player = (name, mark) => ({ name, mark });

    const GameController = (function () {
      let players = [];
      let currentPlayerIndex = 0;
      let isGameOver = false;

      const start = (name1, name2) => {
        players = [Player(name1 || "Player 1", "X"), Player(name2 || "Player 2", "O")];
        currentPlayerIndex = 0;
        isGameOver = false;
        Gameboard.reset();
        DisplayController.render();
        DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
      };

      const playRound = (index) => {
        if (isGameOver || !Gameboard.setCell(index, players[currentPlayerIndex].mark)) return;
        DisplayController.render();
        if (checkWin(Gameboard.getBoard(), players[currentPlayerIndex].mark)) {
          isGameOver = true;
          DisplayController.setMessage(`${players[currentPlayerIndex].name} wins!`);
          return;
        }
        if (!Gameboard.getBoard().includes("")) {
          isGameOver = true;
          DisplayController.setMessage("It's a tie!");
          return;
        }
        currentPlayerIndex = 1 - currentPlayerIndex;
        DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
      };

      const checkWin = (board, mark) => {
        const winCombos = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        return winCombos.some(combo => combo.every(i => board[i] === mark));
      };

      return { start, playRound };
    })();

    const DisplayController = (function () {
      const boardEl = document.getElementById("board");
      const messageEl = document.getElementById("message");

      const render = () => {
        boardEl.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.textContent = mark;
          cell.addEventListener("click", () => GameController.playRound(index));
          boardEl.appendChild(cell);
        });
      };

      const setMessage = (msg) => {
        messageEl.textContent = msg;
      };

      return { render, setMessage };
    })();

    document.getElementById("start-button").addEventListener("click", () => {
      const name1 = document.getElementById("player1").value;
      const name2 = document.getElementById("player2").value;
      GameController.start(name1, name2);
    });