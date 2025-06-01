import { Cursor } from '../classes/cursor.js';
import { Grid } from '../classes/grid.js';
import { InputManager } from '../classes/input-manager.js';
import { SoundManager } from '../classes/sound-manager.js';
import { Loader } from '../classes/loader.js';
import { Tileset } from '../classes/tileset.js';
import { View } from '../classes/view.js';
import { Camera } from '../classes/camera.js';
import { GUI } from '../classes/gui.js';
import { Wait } from '../utils/timing.js';
import { Player } from '../classes/player.js';
import { SocketManager } from '../classes/socket-manager.js';
import { FindItemByKeyValue } from '../utils/array.js';
import { ParseCoordinates } from '../utils/coordinates.js';

export class Game {

    constructor(settings) {
        this.settings = settings;
        this.mode = this.settings.mode ? this.settings.mode : 'stage'; 
        this.blockSize = 100;
        this.tileset = new Tileset(this, 5, 3, 100);
        this.inputManager = new InputManager(this);
        this.soundManager = new SoundManager(this);
        this.loader = new Loader();
        this.assets = {audios: [], images: []};
        this.time = new Date().getTime();
        this.gui = new GUI(this);
        this.debug = false;
        this.gameEnded = false;
        this.speedIncInterval = 30000;
        this.speedIncTime = new Date().getTime();
        this.pausedTime = 0;
        this.cleared = false;
        this.players = [];
    }

    setGrid(data) {
        this.grid = new Grid(this, data.width, data.height, this.blockSize, data.blocks);
        this.grid.build();
    }

    addPlayer(id, main) {
        if (main) {
            this.mainPlayer = new Player(this, id, '#game-view');
            this.mainPlayer.init();
            this.players.push(this.mainPlayer);
            this.gui.updateScoring();
        } else {
            const opponent = new Player(this, id, '#opponent-view');
            this.players.push(opponent);
            opponent.init();
        }
    }
    
    async load() {
        this.assets = await this.loader.load([
            {id: 'tileset', type: 'image'},
            {id: 'cursor', type: 'image'},
            {id: 'explosion', type: 'image'},
            {id: 'click', type: 'audio'},
            {id: 'bgm', type: 'audio', volume: 50, bgm: true, loop_timepoint: 14760},
            {id: 'beam', type: 'audio'},
            {id: 'break', type: 'audio'},
            {id: 'combo', type: 'audio'},
            {id: 'fanfare', type: 'audio'},
            {id: 'level-up', type: 'audio'},
            {id: 'game-over', type: 'audio'},
            {id: 'stage-clear', type: 'audio'},
            {id: 'count-down-start', type: 'audio'},
            {id: 'count-down-end', type: 'audio'},
            {id: 'ikuyo', type: 'audio'},
            {id: 'yatta', type: 'audio'},
            {id: 'sugoi', type: 'audio'},
            {id: 'stage-clear-voice', type: 'audio'},
            {id: 'scoring', type: 'audio', portion: 240},
        ]);
    }


    async init() {
        this.tileset.build();
        this.inputManager.init();
        if (this.mode === 'multiplayer') {
            this.socketManager = new SocketManager(this);
            this.socketManager.init();
            this.gui.showView('lobby');
        } else {
            this.grid = new Grid(this, 6, 13, this.blockSize);
            this.grid.build();
            this.gui.showView('start');
            this.mainPlayer = new Player(this, 'main', '#game-view');
            this.players = [this.mainPlayer];
            this.mainPlayer.init();
            this.gui.updateScoring();

        }


    }

    async run() {
        console.log('RUN')
        this.time = new Date().getTime();
        this.speedIncTime = new Date().getTime();
        this.paused = true;
        for (let player of this.players) {
            player.view.update();
        }
        await this.countDown();
        this.play();
        this.update();
        await Wait(500);
        this.soundManager.play('bgm');

    }

    async countDown() {
        this.gui.hideActions('start');
        console.log('COUNT DOWN')
        this.gui.showValue('count', 3);
        this.soundManager.play('count-down-start');
        await Wait(1000);
        this.gui.showValue('count', 2);
        this.soundManager.play('count-down-start');
        await Wait(1000);
        this.gui.showValue('count', 1);
        this.soundManager.play('count-down-start');
        await Wait(100);
        this.soundManager.play('ikuyo');
        await Wait(900);
        this.soundManager.play('count-down-end');
        this.gui.hideView('start');
        this.gui.hideView('ready');
    
    }

    update() {
        const time = new Date().getTime();

        if (!this.paused && !this.gameEnded) {

            if (time >= this.speedIncTime + this.speedIncInterval) {
                for (let player of this.players) {
                    this.speedIncTime = time;
                    player.scoring.speed++;
                    player.camera.updateScrollSpeed();
                }
                this.gui.updateScoring();
                this.soundManager.play('level-up')
            }

            for (let player of this.players) {
                player.update();
            }
            TWEEN.update();
            this.soundManager.update();            
        }
        requestAnimationFrame(() => {
            this.update();
        });
    }

    async stageClear() {
        if (!this.cleared) {
            this.cleared = true;
            this.settings.score = this.mainPlayer.scoring.score;
            window.localStorage.setItem('score', parseInt(this.settings.score));
            this.mainPlayer.grid.clearAll();
            this.soundManager.pause('bgm');
            this.soundManager.play('stage-clear');
            await Wait(500);
            this.paused = true;
            await Wait(2000);
            this.gui.showView('victory');
            this.gui.showActions();
            await Wait(700);
            if (this.mainPlayer.scoring.round === 5) {
                this.soundManager.play('stage-clear-voice');
                await Wait(1500);
            }
            this.soundManager.play('yatta');
        }
    }

    reset() {
        console.log('THE RESET');
        this.gameEnded  = false;
        this.cleared = false;
        this.grid = new Grid(this, 6, 13, 100);
        this.grid.build();
        for (let player of this.players) {
            player.grid = new Grid(player, 6, 13, 100, this.grid.blocks);
            player.grid.build();
            player.camera.reset();
            player.setScoring();
        }
        this.soundManager.reset();
        this.gui.updateScoring();
        this.mainPlayer.view.update();
    }

    async gameOver() {
        this.gameEnded = true;
        this.soundManager.pause('bgm');
        this.soundManager.play('break');
        this.mainPlayer.grid.breakAll()
        await Wait(1000);;
        this.gui.showView('game-over');
        this.soundManager.play('game-over');
        await Wait(3000);
        this.gui.showActions();
        this.gui.unlockView();
    }

    pause() {
        this.pausedTime = new Date().getTime();
        this.paused = true;
        this.gui.showView('pause');
        this.soundManager.pause('bgm');
    }

    play() {
        this.paused = false;
        if (this.pausedTime) {
            this.time -= this.pausedTime;
        }
        this.gui.hideView('pause');
        this.soundManager.play('bgm');
    }

    playerMoved(playerID, coor) {
        const player = FindItemByKeyValue(this.players, 'id', playerID);
        const coordinates = ParseCoordinates(coor);
        if (player) {
            player.cursor.move(coordinates.i, coordinates.j);
        }
    }

    playerSwapped(playerID) {
        const player = FindItemByKeyValue(this.players, 'id', playerID);
        if (player) {
            player.cursor.swap();
        }
    }

    playerScrolled(playerID) {
        const player = FindItemByKeyValue(this.players, 'id', playerID);
        if (player) {
            player.camera.translateY(10);
            player.grid.update();
            player.view.update();
        }
    }

    addRow(blocks) {
        this.grid.addRow(blocks);
        for (let player of this.players) {
            player.grid.addRow(blocks);
        }
    }


    emit(message, data = null) {
        this.socketManager.emit(message, data);
    }
}