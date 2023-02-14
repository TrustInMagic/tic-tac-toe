const cell = () => {
  let value = '';

  const changeValue = (symbol) => {
    value = symbol;
  };
  const getValue = () => value;

  return { getValue, changeValue };
};

const gameBoard = (() => {
  const board = [];
  const rows = 3;
  const cols = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  return { getBoard };
})();

const printBoard = (board) => {
  let boardSlice = board.slice();
  let renderedBoard = [];

  for (let i = 0; i < board.length; i++) {
    const renderedRow = boardSlice[i].map((element) => element.getValue());
    renderedBoard.push(renderedRow);
  }

  console.log(renderedBoard);
};

const playerFactory = (name, playerSymbol) => {
  return { name, playerSymbol };
};

const gameFlow = (() => {
  const playerOne = playerFactory('Bill', 'X');
  const playerTwo = playerFactory('John', 'O');
  let activePlayer = playerOne;

  const toggleTurn = () => {
    activePlayer = playerOne ? playerTwo : playerOne;
  };

  const playTurn = (player, row, col) => {
    let symbol = player.playerSymbol;
    gameBoard.getBoard()[row][col].changeValue(symbol);
    toggleTurn();
  };

  return { playTurn };
})();



printBoard(gameBoard.getBoard());
gameFlow.playTurn(playerFactory('jim', 'X'), 0, 1);
printBoard(gameBoard.getBoard());
