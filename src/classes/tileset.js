import { TILES_CONTENTS } from '../data/tileset';
import { Block } from './block';

export class Tileset {

    constructor(game, width, height, tileSize) {
        this.game = game;
        this.tileSize = tileSize;
        this.width = width;
        this.height = height;
        this.tiles = {};
    }

    build() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const coor = `${i}-${j}`;
                const content = TILES_CONTENTS[coor];
                this.tiles[coor] = new Block(i, j, this.tileSize, content);
            }
        }
    }

    getBlockByContent(content) {
        let found = false, x = 0;
        let block = null;
        const coors =  Object.keys(TILES_CONTENTS);
        while (!found && x < coors.length) {
            const coor = coors[x];
            if (TILES_CONTENTS[coor] === content) found = true;
            else x++;
        }
        if (found) {
            const coor = coors[x];
            block = this.tiles[coor];
        }
        return block;
    }
}