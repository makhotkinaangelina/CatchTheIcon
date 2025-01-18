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
        this.initialIconChangeSpeed = 1000;
        this.minIconChangeSpeed = 500;
        this.iconChangeSpeed = this.initialIconChangeSpeed;

        this.catchSound = new Audio('catch.mp3');
        this.missSound = new Audio('miss.mp3');

        this.startButton.onclick = () => this.startGame();
    }

    startGame() {
        try {
            this.startScreen.classList.add('hidden');
            this.gameScreen.classList.remove('hidden');

            this.score = 0;
            this.timeRemaining = 30;
            this.iconChangeSpeed = this.initialIconChangeSpeed;

            this.updateScore();
            this.startButton.disabled = true;
            this.resetGameField();
            this.updateField();
            this.startTimer();
        } catch (error) {
            console.error('Ошибка при запуске игры:', error);
        }
    }

    startTimer() {
        try {
            this.timer = setInterval(() => {
                this.timeRemaining--;
                this.timerElement.textContent = `Оставшееся время: ${this.timeRemaining} сек.`;

                this.adjustIconChangeSpeed();

                if (this.timeRemaining <= 0) {
                    clearInterval(this.timer);
                    clearInterval(this.updateInterval);
                    this.resetGame(false);
                }
            }, 1000);

            this.changeUpdateInterval(this.iconChangeSpeed);
        } catch (error) {
            console.error('Ошибка в таймере:', error);
        }
    }

    adjustIconChangeSpeed() {
        try {
            const timeElapsed = 30 - this.timeRemaining;
            const speedRange = this.initialIconChangeSpeed - this.minIconChangeSpeed;
            this.iconChangeSpeed = this.initialIconChangeSpeed - (speedRange * (timeElapsed / 30));
            this.iconChangeSpeed = Math.max(this.iconChangeSpeed, this.minIconChangeSpeed);
            this.changeUpdateInterval(this.iconChangeSpeed);
        } catch (error) {
            console.error('Ошибка при изменении скорости:', error);
        }
    }

    changeUpdateInterval(interval) {
        try {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            this.updateInterval = setInterval(() => this.updateField(), interval);
        } catch (error) {
            console.error('Ошибка при смене интервала обновления:', error);
        }
    }

    playSound(sound) {
        try {
            sound.pause();
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.error('Ошибка при воспроизведении звука:', error);
            });
        } catch (error) {
            console.error('Ошибка в методе воспроизведения звука:', error);
        }
    }

    updateField() {
        try {
            const cells = this.gameField.querySelectorAll('.cell');

            if (cells.length === 0) {
                throw new Error('Игровое поле не заполнено. Проверьте resetGameField.');
            }

            if (this.iconPosition !== -1 && cells[this.iconPosition]) {
                cells[this.iconPosition].innerHTML = '';
                cells[this.iconPosition].style.backgroundColor = ''; // Reset any red background
            }

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * (this.gridSize * this.gridSize));
            } while (randomIndex === this.previousIconPosition);

            this.previousIconPosition = randomIndex;
            this.iconPosition = randomIndex;

            if (cells[randomIndex]) {
                cells[randomIndex].innerHTML = '<img src="icon.png" alt="icon">';
            } else {
                throw new Error('Ячейка для обновления не найдена.');
            }
        } catch (error) {
            console.error('Ошибка при обновлении игрового поля:', error);
        }
    }

    handleCellClick(cellIndex) {
        try {
            if (cellIndex === this.iconPosition) {
                this.playSound(this.catchSound);
                this.score++;
                this.updateScore();

                if (this.score >= this.winCount) {
                    clearInterval(this.timer);
                    clearInterval(this.updateInterval);
                    this.resetGame(true);
                } else {
                    this.updateField();
                }
            } else {
                this.playSound(this.missSound);
                const cells = this.gameField.querySelectorAll('.cell');
                if (cells[cellIndex]) {
                    cells[cellIndex].style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
                    setTimeout(() => {
                        cells[cellIndex].style.backgroundColor = '';
                    }, 500);
                } else {
                    throw new Error('Ячейка для обработки клика не найдена.');
                }
            }
        } catch (error) {
            console.error('Ошибка при обработке клика по ячейке:', error);
        }
    }

    updateScore() {
        try {
            this.scoreElement.textContent = `${this.score}/10`;
        } catch (error) {
            console.error('Ошибка при обновлении счёта:', error);
        }
    }

    resetGameField() {
        try {
            this.gameField.innerHTML = '';
            for (let i = 0; i < this.gridSize * this.gridSize; i++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.onclick = () => this.handleCellClick(i);
                this.gameField.appendChild(cell);
            }
        } catch (error) {
            console.error('Ошибка при сбросе игрового поля:', error);
        }
    }

    resetGame(winner = false) {
        try {
            this.startButton.disabled = false;
            this.startButton.textContent = 'Сыграть ещё';

            const resultMessage = document.getElementById('result-message');
            const gameTitle = document.getElementById('game-title');
            const gameDescription = document.getElementById('game-description');

            gameTitle.classList.add('hidden');
            gameDescription.classList.add('hidden');

            resultMessage.classList.remove('hidden');
            resultMessage.textContent = winner ? 'Победа!' : 'Поражение!';
            resultMessage.style.opacity = 1;

            clearInterval(this.timer);
            clearInterval(this.updateInterval);

            this.gameField.innerHTML = '';

            this.gameScreen.classList.add('hidden');
            this.startScreen.classList.remove('hidden');
        } catch (error) {
            console.error('Ошибка при сбросе игры:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const gameField = document.getElementById('game-field');
        const scoreElement = document.getElementById('score');
        const timerElement = document.getElementById('timer');
        const startButton = document.getElementById('start-button');
        const startScreen = document.getElementById('start-screen');
        const gameScreen = document.getElementById('game-screen');

        const game = new CatchTheIconGame(gameField, scoreElement, timerElement, startButton, startScreen, gameScreen);
    } catch (error) {
        console.error('Ошибка при инициализации игры:', error);
    }
});
