import { Frame } from './frame';

export class Spritesheet {

    constructor(game, img, tileWidth, tileHeight) {
        this.game = game;
        this.img = img;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.width = img.width / tileWidth;
        this.height = img.height / tileHeight;
        this.nbFrames = this.width * this.height;
        this.frames = [];
    }

    build() {
        let index = 0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const frame = new Frame(index, i, j, this.tileWidth, this.tileHeight);
                this.frames.push(frame);
            }
        }
    }

    getFrame(index) {
        return this.frames[index];
    }
}
