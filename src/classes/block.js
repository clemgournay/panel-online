export class Block {

    constructor(i, j, size, content = 'EMPTY') {
        this.i = i;
        this.j = j;
        this.size = size;
        this.x = i * size;
        this.y = j * size;
        this.content = content;
        this.display = 'normal';
        this.locked = false;
    }

    updateContent(content) {
        this.content = content;
    }

    updateDisplay(display) {
        this.display = display;
    }

    lock() {
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }

}