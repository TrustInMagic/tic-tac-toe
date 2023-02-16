const cell = (r, c) => {
  let symbol = '';
  let row = r;
  let col = c;
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
  const playerOne = playerFactory('Bill', 'X');
  const playerTwo = playerFactory('John', 'O');
  let activePlayer = playerOne;
  let moves = 0;
  const message = document.querySelector('.display-message');

  const toggleTurn = () => {
    activePlayer === playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
  };

  const restartActivePlayer = () => (activePlayer = playerOne);

  const getPlayerTurn = () => activePlayer;

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
      }
    }
    
    if (moves === 9 && !checkWin(board)) {
      message.textContent = "It's a draw!";
      console.log('draw');
    }
  };

  return { playTurn, restartActivePlayer, getPlayerTurn };
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
  const playerSymbol = gameLogic.getPlayerTurn().playerSymbol;
  message.textContent = `Player ${playerSymbol}'s turn!`;
};

const playGame = () => {
  renderBoard();
  const cells = document.querySelectorAll('.board-square');
  cells.forEach((cell) =>
    cell.addEventListener('click', () => {
      let row = +cell.getAttribute('data-row');
      let col = +cell.getAttribute('data-col');
      gameLogic.playTurn(row, col);
    })
  );
};

const restartGame = (() => {
  const restartButton = document.querySelector('button');
  restartButton.addEventListener('click', () => gameBoard.restartBoard());
})();

playGame();
