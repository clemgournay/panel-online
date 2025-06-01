import { Cursor } from './cursor.js';
import { View } from './view.js';
import { Camera } from './camera.js';
import { GUI } from './gui.js';
import { Wait } from '../utils/timing.js';
import { Grid } from './grid.js';

export class Player {


    constructor(game, id, viewSelector) {
        this.game = game;
        this.id = id;
        this.setScoring();
        this.grid = new Grid(this, game.grid.width, game.grid.height, game.grid.blockSize, game.grid.blocks)
        this.camera = new Camera(this, 600, 1200);
        this.view = new View(this, viewSelector);
        this.cursor = new Cursor(this);
        this.sprites = [];
        this.shapes = [];
        this.gameEnded = false;
    }

    async init() {
        this.grid.build();
        this.view.init();
    }

    setScoring() {
        this.scoring = {
            score: this.game.settings.score ? this.game.settings.score : 0,
            stage: this.game.settings.stage ? this.game.settings.stage : 1,
            speed: this.game.settings.speed ? this.game.settings.speed : 1,
            round: this.game.settings.round ? this.game.settings.round : 1,
            goal: 8,
            levelScore: 0,
            levelUpInterval: 200,
            levelUpMultiplier: 1.2,
            combo: 0
        };
        switch (this.game.mode) {
            case 'stage':
                let stageInc = (this.scoring.stage-1) * 3;
                this.scoring.speed = stageInc + this.scoring.round;
                this.scoring.goal = this.scoring.goal + ((this.scoring.round-1) * 2);
                console.log('STAGE SCORING SPEED', this.scoring.speed);
            break;
            case 'infinite':
                this.scoring.levelUpInterval = this.scoring.levelUpInterval + (this.scoring.speed * 1.2);
            break;
            
        }
        console.log('[SCORING]', this.scoring);

    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    removeSprite(id) {
        let x = 0, found = false;
        while (!found && x < this.sprites.length) {
            if (this.sprites[x].id === id) found = true;
            else x++;
        }
        if (found) this.sprites.splice(x, 1);
    }

    shapeSolved(shapes) {
        this.shapes = shapes;
        for (let shape of shapes) {
            let score = (shape.length * 10) * this.scoring.combo;
            this.scoring.score += score;
            if (this.mode === 'infinite') {
                this.scoring.levelScore += score;
            }
        }

        this.game.gui.updateScoring();
    
        
    }

    levelUp() {
        this.scoring.speed++;
        this.camera.updateScrollSpeed();
        this.game.soundManager.play('level-up');
        this.game.gui.updateScoring();
    }

    increaseCombo() {
        this.scoring.combo++;
        this.game.gui.updateScoring();
        if (this.scoring.combo >= 2) {
            if (this.scoring.combo >= 4) {
                this.game.soundManager.play('fanfare');
            } else {
                this.game.soundManager.play('sugoi');
            }
        }
    }


    resetCombo() {
        this.scoring.combo = 0;
        this.game.gui.updateScoring();
    }

    resetShapes() {
        this.shapes = [];
    }

    update() {
        this.grid.update();
        this.camera.update();
        for (let sprite of this.sprites) {
            sprite.update();
        }
        this.view.update();
    }
}