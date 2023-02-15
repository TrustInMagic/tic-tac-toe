const cell = (rowNumber, colNumber) => {
  let value = '.';
  const row = rowNumber;
  const col = colNumber;

  const changeValue = (symbol) => {
    value = symbol;
  };
  const getValue = () => value;

  const getNeighborTop = () =>  gameBoard.getBoard()?.[row - 1]?.[col];
  const getNeighborBottom = () => gameBoard.getBoard()?.[row + 1]?.[col];
  const getNeighborLeft = () => gameBoard.getBoard()?.[row]?.[col - 1];
  const getNeighborRight = () => gameBoard.getBoard()?.[row]?.[col + 1];
  const getNeighborTopLeft = () => gameBoard.getBoard()?.[row - 1]?.[col - 1];
  const getNeighborTopRight = () => gameBoard.getBoard()?.[row - 1]?.[col + 1];
  const getNeighborBottomLeft = () => gameBoard.getBoard()?.[row + 1]?.[col - 1];
  const getNeighborBottomRight = () => gameBoard.getBoard()?.[row + 1]?.[col + 1];

  const neighbors = [
    getNeighborTop,
    getNeighborLeft,
    getNeighborRight,
    getNeighborBottom,
    getNeighborTopLeft,
    getNeighborTopRight,
    getNeighborBottomLeft,
    getNeighborBottomRight,
  ];

  const getAllNeighbors = () => neighbors;

  return { getValue, changeValue, getAllNeighbors };
};

const gameBoard = (() => {
  const board = [];
  const rows = 3;
  const cols = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(cell(i, j));
    }
  }

  const getBoard = () => board;

  return { getBoard };
})();

const printBoard = (board) => {
  let boardSlice = board.slice();
  let printedBoard = [];

  for (let i = 0; i < board.length; i++) {
    const printedRow = boardSlice[i].map((element) => element.getValue());
    printedBoard.push(printedRow);
  }

  console.table(printedBoard);
};

const playerFactory = (name, playerSymbol) => {
  return { name, playerSymbol };
};

const gameFlow = (() => {
  const playerOne = playerFactory('Bill', 'X');
  const playerTwo = playerFactory('John', '0');
  let activePlayer = playerOne;

  const toggleTurn = () => {
    activePlayer === playerOne
      ? (activePlayer = playerTwo)
      : (activePlayer = playerOne);
  };

  const validateMove = (board, row, col) => {
    if (board[row][col].getValue() !== '.') {
      return false;
    } else return true;
  };

  const playTurn = (row, col) => {
    let player = activePlayer;
    let symbol = player.playerSymbol;
    const board = gameBoard.getBoard();
    const targetCell = board[row][col];

    if (!validateMove(board, row, col)) {
      console.log('Invalid move, try again.');
      return false;
    } else {
      targetCell.changeValue(symbol);

      checkWin(targetCell);

      printBoard(gameBoard.getBoard());
      toggleTurn();
    }
  };

  return { playTurn };
})();

function checkWin(cell) {
  const cellValue = cell.getValue();
  const neighborCellFunctions = cell.getAllNeighbors();
  const neighbors = []
  for (let i = 0; i < neighborCellFunctions.length; i++) {
    neighbors.push(neighborCellFunctions[i]());
  }

  [up, left, right, bottom, topLeft, topRight, bottomLeft, bottomRight] = neighbors;


  const checkNeighborCellValue = () => {
    const sameValueNeighbors = []

    for (let i = 0; i < neighbors.length; i++) {
      if (neighbors[i] == undefined) {
        continue
      } else if (neighbors[i].getValue() === cellValue) {
        let neighborAndIndex = [neighbors[i], i];
        sameValueNeighbors.push(neighborAndIndex)
      }
    }

    return sameValueNeighbors
  };

  const neighborsWithSameValue = checkNeighborCellValue()
}

gameFlow.playTurn(2, 2);
gameFlow.playTurn(2, 1);
gameFlow.playTurn(1, 2);
gameFlow.playTurn(0, 0);
gameFlow.playTurn(1, 1);



// each cell has a function that returns neighbour cells; directions -> top, bottom, left right, top left, top right, bottom left, bottom right;
// make a checkWin() function; it will get target cell's value and compare to neighbour cells's value;
// if same value (ex top), that neighbour cell will check it's neighbour cell (in direction to form a straight line)
// if it finds same value, return win; else continue.
