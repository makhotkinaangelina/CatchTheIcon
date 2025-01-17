class CatchTheIconGame {
    constructor(gameField, scoreElement, timerElement, startButton, startScreen, gameScreen) {
        this.gameField = gameField;
        this.scoreElement = scoreElement;
        this.timerElement = timerElement;
        this.startButton = startButton;
        this.startScreen = startScreen;
        this.gameScreen = gameScreen;

        this.timer = null;
        this.updateInterval = null;
        this.score = 0;
        this.timeRemaining = 30;
        this.winCount = 10;
        this.iconPosition = -1;
        this.previousIconPosition = -1;

        this.gridSize = 4;
        this.iconChangeSpeed = 1000;

        this.startButton.onclick = () => this.startGame();
    }

    startGame() {
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');

        this.score = 0;
        this.timeRemaining = 30;

        this.updateScore();
        this.startButton.disabled = true;
        this.resetGameField();
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.timerElement.textContent = `Оставшееся время: ${this.timeRemaining} сек.`;

            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                clearInterval(this.updateInterval);
                alert('Время вышло! Вы проиграли.');
                this.resetGame();
            } else if (this.timeRemaining <= 10) {
                //this.changeTimerColorAndShake();
                this.changeUpdateInterval(500);
            }
        }, 1000);

        this.changeUpdateInterval(this.iconChangeSpeed);
    }

    changeUpdateInterval(interval) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(() => this.updateField(), interval);
    }

//    changeTimerColorAndShake() {
//        if (this.timeRemaining <= 10) {
//            this.timerElement.classList.add('shake');
//        }
//    }

    updateField() {
        this.resetGameField();

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * (this.gridSize * this.gridSize));
        } while (randomIndex === this.previousIconPosition);

        this.previousIconPosition = randomIndex;
        this.iconPosition = randomIndex;

        const cells = this.gameField.querySelectorAll('.cell');
        cells[randomIndex].innerHTML = '<img src="icon.png" alt="icon">';
    }

    handleCellClick(cellIndex) {
        if (cellIndex === this.iconPosition) {
            this.score++;
            this.updateScore();

            if (this.score >= this.winCount) {
                clearInterval(this.timer);
                clearInterval(this.updateInterval);
                alert('Вы выиграли!');
                this.resetGame();
            }
        } else {
            const cells = this.gameField.querySelectorAll('.cell');
            cells[cellIndex].style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            setTimeout(() => {
                cells[cellIndex].style.backgroundColor = '';
            }, 500);
        }
    }

    updateScore() {
        this.scoreElement.textContent = `Словлено: ${this.score}`;
    }

    resetGameField() {
        this.gameField.innerHTML = '';
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.onclick = () => this.handleCellClick(i);
            this.gameField.appendChild(cell);
        }
    }

    resetGame() {
        this.startButton.disabled = false;
        this.startButton.textContent = 'Начать игру';

        clearInterval(this.timer);
        clearInterval(this.updateInterval);

        this.gameField.innerHTML = '';

        this.gameScreen.classList.add('hidden');
        this.startScreen.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gameField = document.getElementById('game-field');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');

    const game = new CatchTheIconGame(gameField, scoreElement, timerElement, startButton, startScreen, gameScreen);
});
