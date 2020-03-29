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
                    onClick={() => this.props.onClick() }>{this.props.value}</button>);
  }
}

class Board extends React.Component {
  render() {
    const rows = [];
    for (let i = 0; i < this.props.rows; i++) {
      const row = [];

      for (let j = 0; j < this.props.cols; j++) {
        rows.push(<Square value={this.props.squares[i][j]} />)
      }

      rows.push(<div>{row}</div>);
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
  initializeSquares() {
    // Place random mines in the board
    // Describe number of adjacent mines for each square
    const squares = Array(this.M).fill().map(() => Array(this.N).fill(0));

    for (let i = 0; i < this.mines; i++) {
      let m = Math.floor(Math.random() * this.M);
      let n = Math.floor(Math.random() * this.N);

      //console.log(m + ", " + n);

      squares[m][n] = 'm';
    }

    //squares[0][0] = 'M';

    //console.log(squares[0][0]);
    //console.log(squares);

    return squares;
  }


  constructor(props) {
    super(props);

    this.M = 9;
    this.N = 9;
    this.mines = 10;

    this.state = {
      squares: this.initializeSquares(),
    };
  }

  handleClick() {
    // Left click:
    //    i) non-mine: expand
    //    ii) mine: game-over
    // Right click: place flag
  }

  render() {
    return (<Board rows={this.M}
                   cols={this.N}
                   squares={this.state.squares} />);
  }
}

ReactDOM.render(
  <div><Game/></div>,
  document.getElementById('root'),
);