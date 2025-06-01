export class Frame {

    constructor(index, i, j, width, height) {
        this.index = index;
        this.i = i;
        this.j = j;
        this.width = width;
        this.height = height;
        this.x = this.i * this.width;
        this.y = this.i * this.height;
    }
}