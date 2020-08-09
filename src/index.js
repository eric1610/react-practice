import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        const createBoard = (() => {
            const board = [];
            for (let i = 0; i < 3; i ++)
            {
                const row = [];
                for (let j = 0; j < 3; j ++)
                {
                    row.push(this.renderSquare((i * 3) + j));
                }
                board.push(
                    <div key={i} className="board-row">
                        {row}
                    </div>
                );
            }
            return board;
        })();

        return (
            <div>
                {createBoard}
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1].squares;
        if (calculateWinner(current) || current[i]) {
            return;
        }
        const squares = current.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({
                squares: squares
            }),
            stepNumber: this.state.stepNumber + 1,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
            history: this.state.history.slice(0, step + 1),
        });
    }
    render() {
        const current = this.state.history[this.state.stepNumber].squares;
        const winner = calculateWinner(current);
        const status = winner ? 'Winner is: ' + winner : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        const moves = this.state.history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })
        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current} 
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
}
  
function calculateWinner(squares)
{
    const winners = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winners.length; i ++)
    {
        const [a, b, c] = winners[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        {
            return squares[a];
        }
    }
    return null;
}
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  