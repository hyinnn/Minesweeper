import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Global variables
const MINE = "*";
const FLAG = "F";
const COLORS = ['white', '#1E90FF', '#228B22', '#FF0000', '#191970', '#8B0000', 
                '#3CB371', 'black', '#FFA07A']; 

class Square extends React.Component {
  render() {
    const weight = (this.props.value === MINE || this.props.value === FLAG) ? "bolder" : "normal";
    const valueStyle = {
      "fontWeight" : weight,
      "color" : COLORS[this.props.value],
    };

    return (<div className="square"  
                 onClick={() => this.props.onClick()}
                 onContextMenu={(e) => {e.preventDefault(); this.props.onContextMenu()}} >
              <div style={valueStyle} className="value">{this.props.value}</div>
            </div>);
  }
}

class Board extends React.Component {
  render() {
    // CSS styling for the row width
    const rowStyle = {
      width: this.props.cols * 34,
    }

    // Create the rendering board in an array
    const rows = [];
    for (let i = 0; i < this.props.rows; i++) {
      const row = [];

      for (let j = 0; j < this.props.cols; j++) {
        row.push(<Square value={this.props.player[i][j]}
                          onClick={() => this.props.onClick(i, j)}
                          onContextMenu={() => this.props.onContextMenu(i, j)} />)
      }

      rows.push(<div style={rowStyle} className="board-row">{row}</div>);
    }

    return(
      <div className="board">
          {rows}
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
        if (i >= 0 && i < this.M && j >= 0 && j < this.N && squares[i][j] === MINE) {
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
      squares[m][n] = MINE;
    }

    for (let i = 0; i < this.M; i++) {
      for (let j = 0; j < this.N; j++) {
        if (squares[i][j] !== MINE) {
          squares[i][j] = this.countAdjMines(squares, i, j);
        }
      }
    }

    return squares;
  }

  // Set the difficulty of the game
  setEasy() {
    this.M = 9;
    this.N = 9;
    this.mines = 10;
    this.reset();
  }
  setMedium() {
    this.M = 16;
    this.N = 16;
    this.mines = 40;
    this.reset();
  }
  setHard() {
    this.M = 16;
    this.N = 30;
    this.mines = 99;
    this.reset();
  }

  reset()  {
    this.setState({
      squares: this.initializeSquares(),
      player: Array(this.M).fill().map(() => Array(this.N).fill(null)),
      gameIsOver: false, 
      revealCount: 0,
    });
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
        if (squares[i][j] === MINE) {
          end[i][j] = MINE;
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

    const squares = this.state.squares;
    const player = this.state.player;

    if (player[i][j] === FLAG) {
      player[i][j] = null;
    }
    else if (player[i][j] === null) {
      player[i][j] = FLAG;
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

    // Do nothing if cell is flagged
    if (player[i][j] === FLAG) {
      return;
    }

    // Reveal all the mines if player stepped on mine
    if (square === MINE) {
      const end = this.revealAllMines(player, squares);

      this.setState({
        gameIsOver: true,
        player: end,
      });

      return;
    }

    // Reveal the clicked connected squares on the player board
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

  shortCutReset(e) {
    if (e.keyCode === 82) {
      this.reset();
    }
  }

  render() {
    return (
      <div style={{outline : "none"}} tabindex="0" onKeyDown={(e) => this.shortCutReset(e)}>
        <div className='settings'>
          <button className="reset" onClick={() => this.reset()}>Reset</button>
          <button className="options" onClick={() => this.setEasy()}>Easy</button>
          <button className="options" onClick={() => this.setMedium()}>Medium</button>
          <button className="options" onClick={() => this.setHard()}>Hard</button>
        </div>
        <Board rows={this.M}
               cols={this.N}
               squares={this.state.squares}
               player={this.state.player}
               onClick={(i, j) => this.handleClick(i, j)} 
               onContextMenu={(i, j) => {this.handleContext(i, j)}} />
        </div>
    );
  }
}

ReactDOM.render(
  <div><Game/></div>,
  document.getElementById('root'),
);