import { CONTENTS, TILES_CONTENTS } from '../data/tileset.js';
import { CloneObject, GetObjectValues } from '../utils/object.js';
import { Wait } from '../utils/timing.js';
import { Block } from './block.js';
import { Sprite } from './sprite.js';

export class Grid {

    constructor(player, width, height, blockSize, blocks = {}) {
        this.game = player.game;
        this.player = player;
        this.orgWidth = width;
        this.orgHeight = height;
        this.width = this.orgWidth;
        this.height = 0;
        this.blockSize = blockSize;
        this.screenWidth = width * blockSize;
        this.screenHeight = height * blockSize; 
        this.blocksData = blocks;
        this.blocks = [];
        this.gravityDelay = 500;
        this.moveDelay = 100;
        this.time = new Date().getTime();
        this.cameraOffset = 0;
        this.initialHighestBlock = null;
    }

    build() {
        console.log('BUILD', this.blocksData);
        if (Object.keys(this.blocksData).length == 0) {
            for (let j = 0; j <= 5; j++) {
                for (let i = 0; i < this.width; i++) {
                    const coor = `${i}-${j}`;
                    let content = 'EMPTY';
                    this.blocks[coor] = new Block(i, j, this.blockSize, content);
                }
                this.height++;
            }
            for (let j = 1; j <= 7; j++) {
                this.addRow();
            }
        } else {
            for (let coor in this.blocksData) {
                const block = this.blocksData[coor];
                this.blocks[coor] = new Block(block.i, block.j, this.blockSize, block.content);
            }
            this.height = this.orgHeight;
        }
        this.initialHighestBlock = this.getHighestBlock();

        console.log('[GRID] Blocks', this.blocks);

    }

    
    addRow(blocks = null) {
        if (blocks) {
            for (let coor in blocks) {
                const block = blocks[coor];
                this.blocks[coor] = new Block(block.i, block.j, this.blockSize, block.content);
            }
        } else {
            for (let i = 0; i < this.width; i++) {
                const j = this.height;
                let contents = JSON.parse(JSON.stringify(CONTENTS));
    
                const blocks = [];
                const leftBlock = this.getBlock(i-1, j);
                const rightBlock = this.getBlock(i+1, j);
                const topBlock = this.getBlock(i, j-1);
    
                if (leftBlock) blocks.push(leftBlock);
                if (rightBlock) blocks.push(rightBlock);
                if (topBlock) blocks.push(topBlock);
    
                let toRemove = [];
                for (let block of blocks) {
                    let x = 0, found = false;
                    while (!found && x < contents.length) {
                        const content = contents[x];
                        if (content === block.content) found = true;
                        else x++;
                    }
                    if (found) toRemove.push(contents[x]);
                }
                contents = contents.filter(y => !toRemove.includes(y));
                let index = Math.floor(Math.random() * contents.length);
                this.blocks[`${i}-${j}`] = new Block(i, j, this.blockSize, contents[index]);
            }
        }

        this.height++;
    }

    getBlock(i, j) {
        return this.blocks[`${i}-${j}`];
    }

    updateBlockContent(i, j, content) {
        const block = this.getBlock(i, j);
        block.content = content;
    }


    async solve() {
        const newSolvableShapes = this.getSolvableShapes();
        await this.breakBlocks(newSolvableShapes);
        this.applyGravity();
    }

    async breakBlocks(solvableShapes) {
    
        console.log('[SOLVABLE SHAPES]', solvableShapes);

        if (solvableShapes.length > 0) {
            this.player.increaseCombo();
            this.player.shapeSolved(solvableShapes);
            for (let shape of solvableShapes) {
                for (let block of shape) {
                    block.lock();
                    block.updateDisplay('break1');
                }
            }
            await Wait(500);
        
            let  index = 0;
            for (let shape of solvableShapes) {
                console.log('remove shape', `${shape[0].i}-${shape[0].j}`);
                for (let block of shape) {
                    block.updateContent('EMPTY');
                    block.updateDisplay('normal');
                    const sprite = new Sprite(
                        this.player, 
                        new Date().getTime(),
                        block.x - (block.size/2), block.y - (block.size/2), 
                        block.size * 2, block.size * 2, 
                        this.game.assets.images.explosion, 
                        256, 256
                    );
                    this.player.addSprite(sprite);
                    sprite.play('forwards');
                    await Wait(100);
                    block.unlock();
                    this.game.soundManager.play('scoring', index);
                    index++;
                }
            }
            console.log('SOLVABLE', solvableShapes);
            this.player.resetShapes();
        
        }
    }

    blockInArray(block, arr) {
        let x = 0, found = false;
        while (!found && x < arr.length) {
            if (arr[x].i == block.i && arr[x].j == block.j) found = true;
            else x++;
        }
        return found;
    }

    blockInShapes(block, shapes) {
        let x = 0, found = false;
        while (!found && x < shapes.length) {
            if (this.blockInArray(block, shapes[x])) found = true;
            else x++;
        }
        return found;
    }

    getSolvableShapes() {
        let shapes = [];
        for (let coor in this.blocks) {
            const block = this.blocks[coor];
            const horBlocks = this.getHorizontalBlocks(block);
            const verBlocks = this.getVerticalBlocks(block);

            let shape = horBlocks;
            for (let verBlock of verBlocks) {
                if (!this.blockInShapes(verBlock, shapes) && !this.blockInArray(verBlock, shape)) {
                    shape.push(verBlock);
                }
            }

            if (shape.length > 0) {

                // Combine shapes that are connected
                let x = 0, foundShape = false;
                while (!foundShape && x < shapes.length) {
                    let otherShape = shapes[x];

                    let y = 0;
                    while (!foundShape && y < shape.length) {
                        const block = shape[y];
            
                        let z = 0, foundBlock = false;
                        while (!foundBlock && z < otherShape.length) {
                            const otherBlock = otherShape[x];
                            if (
                                (otherBlock.i === block.i && 
                                    (otherBlock.j === block.j-1) || 
                                    (otherBlock.j === block.j+1) || 
                                    (otherBlock.j === block.j)
                                ) || 
                                (otherBlock.j === block.j && 
                                    (otherBlock.i  === block.i-1) || 
                                    (otherBlock.i === block.i+1) || 
                                    (otherBlock.i === block.i)
                                )
                            ) foundBlock = true;
                            else z++;
                        }
                        if (foundBlock) foundShape = true;
                        else y++;
                    }
                    if (!foundShape) x++;

                }
                if (foundShape) {
                    let otherShape = shapes[x];
                    for (let block of shape) {
                        if (!this.blockInArray(otherShape, shape)) {
                            shapes[x].push(block);
                        }
                    }
                } else {
                    shapes.push(shape);
                }
        
            }
        }

        return shapes;
    }

    getHorizontalBlocks(block) {
        let blocks = [];
        let same = true, i = block.i, j = block.j;
        let sameBlocks = [];
        if (block.content !== 'EMPTY') {
            while (same && i <= this.width - 1) {
                const newCoor = `${i}-${j}`;
                const newBlock = this.blocks[newCoor];
                if (!newBlock || newBlock.locked || newBlock.content != block.content) same = false;
                else {
                    i++;
                    sameBlocks.push(this.blocks[newCoor]);
                }
            }
            if (sameBlocks.length >= 3) {
                blocks = sameBlocks;
            }
        }
        return blocks;
    }

    getVerticalBlocks(block) {
        let blocks = [];
        let same = true, i = block.i, j = block.j;
        let sameBlocks = [];
        if (block.content !== 'EMPTY') {
            while (same && j <= this.height - 1) {
                const newCoor = `${i}-${j}`;
                const newBlock = this.blocks[newCoor];
                if (!newBlock || newBlock.locked || newBlock.content != block.content) same = false;
                else {
                    j++;
                    sameBlocks.push(this.blocks[newCoor]);
                }
            }
            if (sameBlocks.length >= 3) {
                blocks = sameBlocks;
            }
        }
        return blocks;
    }

    getFallingBlocks() {
        let fallingBlocks = [];
        for (let i = 0; i < this.width; i++) {
            const blocksToMove = [];
            let startMoveBlock = false;
            let keepBlocks = false;
            for (let j = this.height - 1; j >= 0; j--) {
                const block = this.getBlock(i, j);
                if (block.content === 'EMPTY' || startMoveBlock) {
                    startMoveBlock = true;
                    blocksToMove.push(block);
                }
                if (startMoveBlock && block.content !== 'EMPTY') {
                    keepBlocks = true;
                }
            }

            if (blocksToMove.length > 0 && keepBlocks) {
                fallingBlocks = fallingBlocks.concat(blocksToMove);
            }
        }
        return fallingBlocks;
    }

    async applyGravity() {
        console.log('Check gravity');
        let somethingToMove = false;

        const fallingBlocks = this.getFallingBlocks();
        if (fallingBlocks.length > 0) {
            somethingToMove = true;
            this.moveBlocksDown(fallingBlocks);
        }

        if (somethingToMove) {
            console.log('Somthing moved, apply gravity');
            this.applyGravity();
            await Wait(this.gravityDelay);
        } else {
            console.log('Nothing moved, end.');
            const solvableShapes = this.getSolvableShapes();
            if (solvableShapes.length > 0) {
                await this.breakBlocks(solvableShapes);
                this.applyGravity();
            } else {
                if (this.game.mode === 'stage') {
                    const highestBlock = this.getHighestBlock();
                    if (highestBlock.j === this.initialHighestBlock.j + this.player.scoring.goal) {
                        this.game.stageClear();
                    }
                }
                this.player.resetCombo();
            }
        }
    }

    moveBlocksDown(blocks) {
        for (let block of blocks) {
            let prevBlock = this.getBlock(block.i, block.j-1);
            let content = (prevBlock) ? prevBlock.content : 'EMPTY';
            block.updateContent(content);
        }
    }

    async swapBlocks(block1, block2, duration) {
        return new Promise((resolve, reject) => {
            block1.lock();
            block2.lock();
            const content1 = block1.content;
            const content2 = block2.content;
            const orgCoors1 = {x: block1.x, y: block1.y};
            const coors1 = {x: block1.x, y: block1.y};
            const destCoors1 = {x: block2.x, y: block2.y};
            new TWEEN.Tween(coors1)
            .to(destCoors1, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                block1.x = coors1.x;
                block1.y = coors1.y;
            })
            .start();

            const orgCoors2 = {x: block2.x, y: block2.y};
            const coors2 = {x: block2.x, y: block2.y};
            const destCoors2 = {x: block1.x, y: block1.y};
            new TWEEN.Tween(coors2)
            .to(destCoors2, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                block2.x = coors2.x;
                block2.y = coors2.y;
            })
            .onComplete(() => {
                block1.x = orgCoors1.x;
                block1.y = orgCoors1.y;
                block1.content = content2;
                block2.x = orgCoors2.x;
                block2.y = orgCoors2.y;
                block2.content = content1;
                block1.unlock();
                block2.unlock();
                resolve();
            })
            .start();
        })
    }

    getHighestBlock() {

        let highestBlock = this.getBlock(0, this.height - 1);
        for (let i = 0; i < this.width; i++) {
            let j = 0, found = false;
            while (!found && j < this.height) {
                const block = this.getBlock(i, j);
                if (block && block.content != 'EMPTY' && block.y < highestBlock.y) found = true;
                else j++;
            }
            if (found) highestBlock = this.getBlock(i, j);
        }
        return highestBlock;
    }

    clearAll() {
        for (let coor in this.blocks) {
            this.blocks[coor].updateDisplay('break1');
            this.blocks[coor].lock();
        }
    }

    breakAll() {
        for (let coor in this.blocks) {
            this.blocks[coor].updateDisplay('break2');
            this.blocks[coor].lock();
        }
    }

    update() {
        if (this.getHighestBlock() && -this.player.camera.y + this.getHighestBlock().y <= 0) {
            this.game.gameOver();
        } else {
            let diff = this.player.camera.y - this.cameraOffset;
            if (diff >= this.blockSize) {
                this.cameraOffset = this.player.camera.y;
                if (this.game.mode === 'multiplayer') {
                    this.game.emit('request row');
                } else {
                    this.addRow();
                    this.solve();
                }
            } 
        }
    

    }
    
}