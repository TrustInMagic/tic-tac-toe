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
    makeDomPlayAreaElementClickable();
    gameLogic.setMoves(0);

    if (gameLogic.getActivePlayer()?.name !== 'Human') {
      pvpGamePlay();
    } else {
      aiGamePlay();
    }
  };

  const getBoard = () => board;

  return { getBoard, restartBoard };
})();

const playerFactory = (name, playerSymbol) => {
  return { name, playerSymbol };
};

const gameLogic = (() => {
  let playerOne;
  let playerTwo;
  let activePlayer = playerOne;
  let moves = 0;
  const message = document.querySelector('.display-message');

  const toggleTurn = () => {
    activePlayer === playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
  };

  const restartActivePlayer = () => (activePlayer = playerOne);

  const setPlayerOne = (name) => {
    playerOne = playerFactory(name, 'X');
    activePlayer = playerOne;
  };
  const setPlayerTwo = (name) => (playerTwo = playerFactory(name, 'O'));

  const getActivePlayer = () => activePlayer;

  const getMoves = () => moves;
  const setMoves = (value) => (moves = value);

  const validateMove = (board, row, col) => {
    if (board[row][col].getSymbol() !== '') {
      return false;
    } else return true;
  };

  const playTurn = (row, col) => {
    let player = activePlayer;
    let symbol = player.playerSymbol;
    const board = gameBoard.getBoard();
    const targetCell = board[row][col];

    if (!validateMove(board, row, col)) {
      return false;
    } else {
      moves += 1;
      targetCell.changeSymbol(symbol);
      targetCell.setValue();
      toggleTurn();

      if (playerOne.name !== 'Human') {
        pvpGamePlay();
      } else aiGamePlay();

      if (checkWin(board)) {
        toggleTurn();
        makeDomPlayAreaElementUnclickable();
        message.textContent = `${activePlayer.name} has won!`;
        moves = 0;
      }
    }

    if (moves === 9 && !checkWin(board)) {
      message.textContent = "It's a draw!";
      moves = 0;
    }
  };

  return {
    playTurn,
    restartActivePlayer,
    getActivePlayer,
    setPlayerOne,
    setPlayerTwo,
    validateMove,
    setMoves,
    getMoves,
  };
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

  const playerName = gameLogic.getActivePlayer()?.name;
  message.textContent = `${playerName}'s turn!`;
};

const linkDomCellsToLogic = () => {
  const cells = document.querySelectorAll('.board-square');
  cells.forEach((cell) =>
    cell.addEventListener('click', () => {
      let row = +cell.getAttribute('data-row');
      let col = +cell.getAttribute('data-col');
      gameLogic.playTurn(row, col);
    })
  );
};

const pvpGamePlay = () => {
  renderBoard();
  const cells = document.querySelectorAll('.board-square');
  cells.forEach((cell) => cell.classList.remove('vs-ai'));
  linkDomCellsToLogic();
};

const aiGamePlay = () => {
  renderBoard();
  const cells = document.querySelectorAll('.board-square');
  cells.forEach((cell) => cell.classList.add('vs-ai'));
  linkDomCellsToLogic();

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  cells.forEach((cell) =>
    cell.addEventListener('click', () => {
      makeDomPlayAreaElementUnclickable();
      if (gameLogic.getActivePlayer().name === 'C-3PO') {
        const board = gameBoard.getBoard();
        let row = getRandomInt(3);
        let col = getRandomInt(3);

        while (
          gameLogic.validateMove(board, row, col) === false &&
          gameLogic.getMoves() < 9
        ) {
          row = getRandomInt(3);
          col = getRandomInt(3);
        }
        setTimeout(() => {
          gameLogic.playTurn(row, col);
        }, 1000);
      }
    })
  );
  makeDomPlayAreaElementClickable();
};

const restartGame = (() => {
  const restartButton = document.querySelector('.game-area button');
  restartButton.addEventListener('click', () => gameBoard.restartBoard());
})();

const gameSelection = (() => {
  const gameArea = document.querySelector('.game-area');
  const playerVsPlayer = document.querySelector('.pvp');
  const playerVsAI = document.querySelector('.ai');
  const playerSelector = document.querySelector('form');
  gameArea.style.cssText = 'transform: scale(0)';

  playerVsPlayer.addEventListener('click', () => {
    gameArea.style.cssText = 'transform: scale(0)';
    gameBoard.restartBoard();
    playerSelector.style.cssText = 'transform: scale(1)';
    pvpGameLogic();
    pvpGamePlay();
  });

  playerVsAI.addEventListener('click', () => {
    gameArea.style.cssText = 'transform: scale(1)';
    aiGameLogic();
    aiGamePlay();
    gameBoard.restartBoard();
  });
})();

const pvpGameLogic = () => {
  const playerSelector = document.querySelector('form');
  const playerOneInput = document.querySelector('#player1');
  const playerTwoInput = document.querySelector('#player2');
  const gameArea = document.querySelector('.game-area');

  playerSelector.addEventListener('submit', (event) => {
    event.preventDefault();
    let playerOne = playerOneInput.value;
    let playerTwo = playerTwoInput.value;

    gameLogic.setPlayerOne(playerOne);
    gameLogic.setPlayerTwo(playerTwo);

    playerSelector.style.cssText = 'transform: scale(0)';
    gameArea.style.cssText = 'transform: scale(1)';

    const message = document.querySelector('.display-message');
    const playerName = gameLogic.getActivePlayer().name;
    message.textContent = `${playerName}'s turn!`;
  });
};

const aiGameLogic = () => {
  gameLogic.setPlayerOne('Human');
  gameLogic.setPlayerTwo('C-3PO');

  const message = document.querySelector('.display-message');
  const playerName = gameLogic.getActivePlayer().name;
  message.textContent = `${playerName}'s turn!`;
};

const makeDomPlayAreaElementUnclickable = () => {
  const boardDomElement = document.querySelector('.game-board');
  boardDomElement.classList.add('not-allowed');
};

const makeDomPlayAreaElementClickable = () => {
  const boardDomElement = document.querySelector('.game-board');
  boardDomElement.classList.remove('not-allowed');
};
