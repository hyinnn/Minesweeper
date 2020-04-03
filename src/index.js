import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// Minesweeper steps
// 1. Create the board
// 2. Handle click
// 3. Implement game logic


// Game Logic
// 1. Place all the mines 
// 2. Handle Click

// Handle click
// - Expand until hits a number
// - 

class Square extends React.Component {
  render() {
    return (<button className="square"  
                    onClick={() => this.props.onClick()}
                    onContextMenu={() => this.props.handleContext()} >
              {this.props.value}
            </button>);
  }
}

class Board extends React.Component {
  render() {
    // Create the rendering board in an array
    const rows = [];
    for (let i = 0; i < this.props.rows; i++) {
      const row = [];

      for (let j = 0; j < this.props.cols; j++) {
        rows.push(<Square value={this.props.player[i][j]}
                          onClick={() => this.props.onClick(i, j)}
                          onContextMenu={() => this.props.handleContext(i, j)} />)
      }

      rows.push(<div className="board-row">{row}</div>);
    }

    return(<div>
      <div>
        <button className="game-icon"></button>
      </div>
      <div className="board">
        {rows}
      </div>
    </div>);
  }
}

class Game extends React.Component {

  // Input: 2D List, Integers
  // Output: Integer
  // Count the number of adjacent mines in given row and col index
  countAdjMines(squares, row, col) {
    let adj = 0;

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < this.M && j >= 0 && j < this.N && squares[i][j] === 'm') {
          adj++;
        }
      }
    }

    return adj;
  }

  // Return the board (2D array) with randomized mines placed and its number clues
  initializeSquares() {
    // Place random mines in the board
    // Describe number of adjacent mines for each square
    const squares = Array(this.M).fill().map(() => Array(this.N).fill(0));
    let set = new Set();

    for (let i = 0; i < this.mines; i++) {
      let m = Math.floor(Math.random() * this.M);
      let n = Math.floor(Math.random() * this.N);

      while (set.has(m * this.N + n)) {
        m = Math.floor(Math.random() * this.M);
        n = Math.floor(Math.random() * this.N);
      }

      set.add(m * this.N + n);
      squares[m][n] = 'm';
    }

    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        if (squares[i][j] !== 'm') {
          squares[i][j] = this.countAdjMines(squares, i, j);
        }
      }
    }

    return squares;
  }


  constructor(props) {
    super(props);

    this.M = 9;
    this.N = 9;
    this.mines = 10;

    this.state = {
      squares: this.initializeSquares(),
      player: Array(this.M).fill().map(() => Array(this.N).fill(null)),
      gameIsOver: false, 
      revealCount: 0,
    };
  }

  // Reveal all the mines on the board to the player board
  revealAllMines(player, squares) {
    const end = []; // Make a copy of the player board
    for (let i = 0; i < squares.length; i++) {
      end[i] = player[i].slice();
    }

    // Reveal the mines on the player board
    for (let i = 0; i < squares.length; i++) {
      for (let j = 0; j < squares[i].length; j++) {
        if (squares[i][j] === 'm') {
          end[i][j] = 'm';
        }
      }
    }

    return end;
  }

  // Check if the row, col position is valid to reveal
  // Within boundaries, and has not been revealed yet
  isValid(player, row, col) {
    return row >= 0 && row < this.M && col >= 0 && col < this.N && player[row][col] === null;
  }

  // Get all valid adjacent board positions
  // Returns 2d Array where a pos is array [x, y]
  getAdj(player, row, col) {
    const adj = [];

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i === row && j === col) {
          continue;
        }
        if (this.isValid(player, i, j)) {
          adj.push([i, j]);
        }
      }
    }

    return adj;
  }

  // Set the flag for right clicking a button
  handleContext(i, j) {
    if (this.state.gameIsOver) {
      return;
    }

    alert("Hello!");
    return;

    const squares = this.state.squares;
    const player = this.state.player;

    if (player[i][j] === 'F') {
      player[i][j] = null;
    }
    else if (player[i][j] === null) {
      player[i][j] = 'F';
    }

    this.setState({
      player: player,
    });
  }

  // Reveal the square in the player board
  // If the square is a mine: gameover
  // Else: reveal everything
  handleClick(i, j) {
    if (this.state.gameIsOver) {
      return;
    }

    const squares = this.state.squares;
    const player = this.state.player;
    let count = this.state.revealCount;
    let square = squares[i][j];

    // Reveal all the mines if player stepped on mine
    if (square === 'm') {
      const end = this.revealAllMines(player, squares);

      this.setState({
        gameIsOver: true,
        player: end,
      });

      return;
    }

    // Reveal all the squares on the player board
    const queue = [[i, j]];
    while (queue.length > 0) {
      let [row, col] = queue.pop();

      if (player[row][col] === null) {
        count++;
      }

      // If 0, then expand
      // Else, just reveal
      player[row][col] = squares[row][col];
      console.log(count);

      if (squares[row][col] === 0) {
        const adj = this.getAdj(player, row, col);
        for (const pos of adj) {
          queue.push(pos);
        }
      }
    }

    this.setState({
      player: player,
      revealCount: count,
    });

    if (count === (this.M * this.N - this.mines)) {
      alert("You won!");
      this.setState({
        gameIsOver: true,
      });
    }
  }

  render() {
    return (<Board rows={this.M}
                   cols={this.N}
                   squares={this.state.squares}
                   player={this.state.player}
                   onClick={(i, j) => this.handleClick(i, j)} 
                   onContextMenu={(i, j) => this.handleContext(i, j)} />);
  }
}

ReactDOM.render(
  <div><Game/></div>,
  document.getElementById('root'),
);