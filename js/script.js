const cell = (row, col) => {
  let symbol = '';
  let value;

  const setValue = () => {
    if (symbol === 'X') value = 1;
    if (symbol === 'O') value = 2;
  };

  const changeSymbol = (value) => {
    symbol = value;
  };

  const getSymbol = () => symbol;
  const getValue = () => value;
  const getRow = () => row;
  const getCol = () => col;

  return { getSymbol, changeSymbol, getValue, setValue, getRow, getCol };
};

const gameBoard = (() => {
  let board = [];
  const rows = 3;
  const cols = 3;

  //drawing the board
  const populateBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(cell(i, j));
      }
    }
  };

  populateBoard();

  const restartBoard = () => {
    board = [];
    populateBoard();
    gameLogic.restartActivePlayer();
    renderBoard();
    playGame();
  };

  const getBoard = () => board;

  return { getBoard, restartBoard };
})();

const playerFactory = (name, playerSymbol) => {
  return { name, playerSymbol };
};

const gameLogic = (() => {
  const playerOne = playerFactory('Human', 'X');
  const playerTwo = playerFactory('C-3PO', 'O');
  let activePlayer = playerOne;
  let moves = 0;
  const message = document.querySelector('.display-message');

  const toggleTurn = () => {
    activePlayer === playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
  };

  const restartActivePlayer = () => (activePlayer = playerOne);

  const getActivePlayer = () => activePlayer;

  const validateMove = (board, row, col) => {
    if (board[row][col].getSymbol() !== '') {
      return false;
    } else return true;
  };

  const playTurn = (row, col) => {
    moves += 1;
    let player = activePlayer;
    let symbol = player.playerSymbol;
    const board = gameBoard.getBoard();
    const targetCell = board[row][col];

    if (!validateMove(board, row, col)) {
      return false;
    } else {
      targetCell.changeSymbol(symbol);
      targetCell.setValue();
      toggleTurn();
      renderBoard();
      playGame();
      if (checkWin(board)) {
        toggleTurn();
        renderBoard();
        message.textContent = `Player ${activePlayer.playerSymbol} has won!`;
        moves = 0;
      }
    }

    if (moves === 9 && !checkWin(board)) {
      message.textContent = "It's a draw!";
      moves = 0;
    }
  };

  return { playTurn, restartActivePlayer, getActivePlayer };
})();

function checkWin(board) {
  const b = board;

  const winningCombinations = [
    // rows
    [...b[0]],
    [...b[1]],
    [...b[2]],
    //columns
    [b[0][0], b[1][0], b[2][0]],
    [b[0][1], b[1][1], b[2][1]],
    [b[0][2], b[1][2], b[2][2]],
    //diagonals
    [b[0][0], b[1][1], b[2][2]],
    [b[0][2], b[1][1], b[2][0]],
  ];

  for (let combination of winningCombinations) {
    if (
      combination[0].getValue() === combination[1].getValue() &&
      combination[1].getValue() === combination[2].getValue() &&
      typeof combination[0].getValue() === 'number'
    )
      return true;
  }
}

const renderBoard = () => {
  const message = document.querySelector('.display-message');
  const board = document.querySelector('.game-board');
  const printedBoard = gameBoard.getBoard();
  removeAllChildNodes(board);

  for (let row of printedBoard) {
    for (let cell of row) {
      const newCell = document.createElement('div');
      newCell.classList.add('board-square');
      board.appendChild(newCell);
      newCell.textContent = cell.getSymbol();
      newCell.setAttribute('data-row', `${cell.getRow()}`);
      newCell.setAttribute('data-col', `${cell.getCol()}`);
    }
  }

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  const playerSymbol = gameLogic.getActivePlayer().playerSymbol;
  message.textContent = `Player ${playerSymbol}'s turn!`;
};

const playGame = (type, move) => {
  renderBoard();
  const cells = document.querySelectorAll('.board-square');
  cells.forEach((cell) =>
    cell.addEventListener('click', () => {
      let row = +cell.getAttribute('data-row');
      let col = +cell.getAttribute('data-col');
      gameLogic.playTurn(row, col);
    })
  );

  if (type === 'PvE') {
    cells.forEach((cell) =>
      cell.addEventListener('click', () => {
        console.log
        // while (gameLogic.playTurn(...move) === false) gameLogic.playTurn(...move);
      })
    );
  }
};

const restartGame = (() => {
  const restartButton = document.querySelector('.game-area button');
  restartButton.addEventListener('click', () => gameBoard.restartBoard());
})();

const gameSelection = (() => {
  const gameArea = document.querySelector('.game-area');
  const playerVsPlayer = document.querySelector('.pvp');
  const playerVsAI = document.querySelector('.pve');
  gameArea.style.cssText = 'transform: scale(0)';

  playerVsPlayer.addEventListener('click', () => {
    gameArea.style.cssText = 'transform: scale(1)';
    playGame();
  });

  playerVsAI.addEventListener('click', () => {
    gameArea.style.cssText = 'transform: scale(1)';
    aiGameplay();
  });
})();

const aiGameplay = () => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  playGame('PvE', [getRandomInt(3), getRandomInt(3)]);

 
};
