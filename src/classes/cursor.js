export class Cursor {

    constructor(player) {
        this.game = player.game;
        this.player = player;
        this.i = 0;
        this.j = 11;
        this.prevI = this.i;
        this.prevJ = this.j;
        this.lineWidth = 10;
        this.width = (player.grid.blockSize * 2) + this.lineWidth;
        this.height = (player.grid.blockSize) + this.lineWidth;
        this.x = (this.i * player.grid.blockSize) - (this.lineWidth/2);
        this.y = ((this.j * player.grid.blockSize) - (this.lineWidth/2));
        this.selection = {
            left: {i: this.i, j: this.j}, 
            right: {i: this.i + 1, j: this.j}
        };
    }

    move(i, j) {
        this.prevI = this.i;
        this.prevJ = this.j;
        this.i = i;
        this.j = j;
        this.x = (this.i * this.player.grid.blockSize) - (this.lineWidth/2);
        this.y = ((this.j * this.player.grid.blockSize) - (this.lineWidth/2));
        this.selection = {
            left: {i: this.i, j: this.j}, 
            right: {i: this.i + 1, j: this.j}
        };
    }

    async swap() {
        console.log(this.selection)
        const leftBlock = this.player.grid.getBlock(this.selection.left.i, this.selection.left.j);
        const rightBlock = this.player.grid.getBlock(this.selection.right.i, this.selection.right.j);
        if (!(leftBlock.content == 'EMPTY' && rightBlock.content == 'EMPTY') && !leftBlock.locked && !rightBlock.locked) {
            this.game.soundManager.play('click');
            await this.player.grid.swapBlocks(leftBlock, rightBlock, 100);
            if (this.player.grid.getFallingBlocks().length > 0) {
                this.player.grid.applyGravity(true);
            } else {
                await this.player.grid.solve(true);
            }
        } else {
            console.log('EMPTY');
        }

    }
    
}