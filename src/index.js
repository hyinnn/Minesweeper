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
                    onClick={() => this.props.onClick() }>
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
                          onClick={() => this.props.onClick(i, j)} />)
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
    };
  }

  // Reveal the square in the player board
  handleClick(i, j) {
    const squares = this.state.squares;
    const player = this.state.player;

    player[i][j] = squares[i][j];
    this.setState({player: player});
  }

  render() {
    return (<Board rows={this.M}
                   cols={this.N}
                   squares={this.state.squares}
                   player={this.state.player}
                   onClick={(i, j) => this.handleClick(i, j)} />);
  }
}

ReactDOM.render(
  <div><Game/></div>,
  document.getElementById('root'),
);