export class InputManager {

    constructor(game) {
        this.game = game;
        this.gameViewEl = document.getElementById('game-view');
        this.startEl = document.getElementById('start');
        this.readyEl = document.getElementById('ready');
        this.pauseEl = document.getElementById('pause');
        this.gameOverEl = document.getElementById('game-over');
        this.victoryEl = document.getElementById('victory');
    }

    init() {

        this.gameViewEl.onmousemove = (e) => {
            const rect = this.gameViewEl.getBoundingClientRect();

            const camera = this.game.mainPlayer.camera;
            const grid = this.game.mainPlayer.grid;
            const cursor = this.game.mainPlayer.cursor;
            const x = parseInt(e.pageX - rect.left);
            const y = camera.y + parseInt(e.pageY - rect.top);
            const i = parseInt(x / grid.blockSize);
            const j = parseInt(y / grid.blockSize);
            const block = grid.getBlock(i, j);
            if (block) {
                const blockY = -camera.y + block.y;
                if (
                    blockY >= 0 &&
                    i >= 0 && i < grid.width - 1 &&
                    j >= 0 && j < grid.height
                ) {
                    cursor.move(i, j);
                    if (this.game.mode === 'multiplayer') {
                        this.game.emit('move', `${i}-${j}`);
                    }
                }
            }
            
        }

        this.startEl.onclick = (e) => {
            this.game.gui.lockView();
            this.game.run();
        }

        
        this.readyEl.onclick = (e) => {
            this.game.gui.lockView();
            this.game.gui.addClass('ready');
            this.game.gui.showEl('other-player-ready');
            this.game.emit('ready');
        }


        this.gameViewEl.onclick = (e) => {
            this.game.mainPlayer.cursor.swap();
            if (this.game.mode === 'multiplayer') {
                this.game.emit('swap');
            }
        }

        this.pauseEl.onclick = () => {
            this.game.play();
        }

        this.gameOverEl.onclick = () => {
            this.game.reset();
            this.game.gui.hideView('game-over');
            this.game.play();
        }

        this.victoryEl.onclick = () => {
            this.game.gui.lockView();
            if (this.game.mainPlayer.scoring.round < 5) {
                this.game.settings.round = this.game.mainPlayer.scoring.round+1;
                window.localStorage.setItem('round', this.game.settings.round);
                this.game.reset();
                this.game.gui.hideView('victory');
                this.game.gui.showView('start');
                this.game.gui.lockView();
                this.game.gui.hideActions('start');
                this.game.gui.showValue('count', '');
                this.game.run();
            } else {
                this.game.settings.stage = this.game.mainPlayer.scoring.stage+1;
                this.game.settings.round = 1;
                window.localStorage.setItem('stage', this.game.settings.stage);
                window.localStorage.setItem('round', this.game.settings.round);
                window.location.href = '../stage-selection';
            }
        }

        document.onwheel = (e) => {
            if (e.deltaY < 0) {
                this.game.mainPlayer.camera.translateY(10);
                this.game.mainPlayer.grid.update();
                this.game.mainPlayer.view.update();
                if (this.game.mode === 'multiplayer') {
                    this.game.emit('scroll', 10);
                }
            }
        }

        document.onkeydown = (e) => {
            switch(e.key) {
            }
        }

        document.onkeyup = (e) => {
            switch(e.key) {
                case 'Enter':
                    this.game.debug = !this.game.debug;
                break;
            }
        }

        window.onblur = () => {
            if (this.game.mode !== 'multiplayer' && document.querySelectorAll('.view.shown').length === 0) {
                this.game.pause();
            }
        }
    }
    
}