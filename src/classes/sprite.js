import { Spritesheet } from './spritesheet';

export class Sprite {

    constructor(game, id, x, y, width, height, img, tileWidth, tileHeight) {
        this.game = game;
        this.id = id;
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.currentFrame = 0;
        this.tiles = {};
        this.animating = false;
        this.animationMode = 'loop';

        this.spritesheet = new Spritesheet(game, img, tileWidth, tileHeight);
        this.spritesheet.build();
    }

    update() {
        if (this.animating) {
            if (this.currentFrame < this.spritesheet.nbFrames - 1) {
                this.currentFrame++;
            } else {
                switch (this.animationMode) {
                    case 'loop':
                        this.currentFrame = 0;
                    break;
                    case 'forwards':
                        this.animating = false;
                        this.game.removeSprite(this.id);
                    break;
                }
            }
        }
    }

    getCurrentFrame() {
        return this.spritesheet.getFrame(this.currentFrame);
    }

    play(animationMode = 'loop') {
        this.animationMode = animationMode;
        this.animating = true;
    }
    
}