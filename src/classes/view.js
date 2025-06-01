export class View {

    constructor(player, selector) {
        this.game = player.game;
        this.player = player;
        this.mainEl = document.querySelector('main');
        this.gameViewEl = document.querySelector(selector);
        this.ctx = this.gameViewEl.getContext('2d');
    }

    init() {
        this.gameViewEl.width = this.player.camera.width;
        this.gameViewEl.height = this.player.camera.height;
        this.gameViewEl.style.width = `${this.gameViewEl.width}px`;
        this.gameViewEl.style.height = `${this.gameViewEl.height}px`;
        if (this.game.mode !== 'multiplayer') {
            document.querySelector('.character').classList.add('shown');
        }
        if (this.game.mode === 'stage') {
            let imageSRC =  `url(../assets/images/stages/${this.player.scoring.stage}.jpg)`;
            this.mainEl.querySelector('.background').style.backgroundImage = imageSRC;
        } 
        document.body.classList.add('loaded');
        this.gameViewEl.classList.add('shown');

    }

    update() {
        this.ctx.clearRect(0, 0, this.gameViewEl.width, this.gameViewEl.height);
        this.drawGrid();
        this.drawCursor();
        this.drawSprites();
        this.drawShapesScore();
        if (this.game.mode === 'stage') this.drawGoal();
        if (this.game.debug) this.drawHelper();
    }

    drawGrid() {
        for (let coor in this.player.grid.blocks) {
            const block = this.player.grid.blocks[coor];
            let content = block.content;
            if (content != 'EMPTY') {
                switch (block.display) {
                    case 'break1':
                        content = content + '_BREAK1';
                    break;
                    
                    case 'break2':
                        console.log('BVREAK2')
                        content = content + '_BREAK2';
                    break;
                }
                const tile = this.game.tileset.getBlockByContent(content);
                
                this.ctx.drawImage(
                    this.game.assets.images.tileset, 
                    tile.x, tile.y, 
                    tile.size, tile.size, 
                    -this.player.camera.x + block.x, 
                    -this.player.camera.y + block.y, 
                    block.size, block.size
                );
            }
            
        }
    }

    drawCursor() {
        this.ctx.drawImage(
            this.game.assets.images.cursor, 
            -this.player.camera.x + this.player.cursor.x, 
            -this.player.camera.y + this.player.cursor.y, 
            this.player.cursor.width, 
            this.player.cursor.height
        );
    }

    drawSprites() {
        for (let sprite of this.player.sprites) {
            const frame = sprite.getCurrentFrame();
            this.ctx.drawImage(
                sprite.img,
                frame.x,
                frame.y,
                frame.width,
                frame.height,
                -this.player.camera.x + sprite.x, 
                -this.player.camera.y + sprite.y, 
                sprite.width, 
                sprite.height
            );
        }
    
    }

    drawShapesScore() {
        if (this.player.shapes.length > 0) {
            this.ctx.font = 'bold 40px Chakra Petch';
            this.ctx.textAlign = 'center';
            const boxPadding = this.player.grid.blockSize * 0.2;
            for (let shape of this.player.shapes) {
                const block = shape[0];
                this.ctx.beginPath();
                this.ctx.fillStyle = 'red';
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.roundRect(
                    -this.player.camera.x + block.x + boxPadding, 
                    -this.player.camera.y + block.y + boxPadding, 
                    block.size - (boxPadding*2), 
                    block.size - (boxPadding*2), 
                    [10]
                );
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(
                    shape.length, 
                    -this.player.camera.x + block.x + (block.size/2), 
                    -this.player.camera.y + block.y + (block.size/2) + 15
                );
                this.ctx.closePath();
            }
        } 
    
    }

    drawGoal() {

        if (this.player.grid.initialHighestBlock) {
            this.ctx.strokeStyle = 'purple';
            this.ctx.fillStyle = 'white';
            const topBlock = this.player.grid.initialHighestBlock;
            let y = topBlock.y + (this.player.scoring.goal * this.player.grid.blockSize);
    
            this.ctx.beginPath();
            this.ctx.rect(
                -this.player.camera.x,
                -this.player.camera.y + y,
                this.gameViewEl.width,
                10
            );
            this.ctx.fill();
            this.ctx.closePath();
    
            let rectWidth = 100;
            let rectHeight = 30;
    
            this.ctx.beginPath();
            this.ctx.roundRect(
                -this.player.camera.x + this.gameViewEl.width - rectWidth,
                -this.player.camera.y + y - rectHeight + 2,
                rectWidth,
                rectHeight,
                [10, 0, 0, 0]
            );
            this.ctx.fill();
            this.ctx.closePath();
    
            this.ctx.textAlign = 'right';
            this.ctx.font = 'bold 24px Chakra Petch';
            this.ctx.fillStyle = 'purple';
            const padding = 10;
            this.ctx.fillText(
                'CLEAR',
                -this.player.camera.x + this.gameViewEl.width - padding,
                -this.player.camera.y + y - (rectHeight/2 - padding),
            );
        }

    }

    drawHelper() {
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'white';
        for (let coor in this.player.grid.blocks) {
            const block = this.player.grid.blocks[coor];
            this.ctx.strokeRect(
                -this.player.camera.x + block.x, 
                -this.player.camera.y + block.y, 
                block.size,
                block.size
            );
            this.ctx.fillText(
                `${block.i}-${block.j}`, 
                -this.player.camera.x + (block.x + (block.size/2)), 
                -this.player.camera.y + (block.y + (block.size/2))
            );
        }
    }

}