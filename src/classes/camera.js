export class Camera {

    constructor(player, width, height) {
        this.game = player.game;
        this.player = player;
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.scrollTimer = new Date().getTime();
        this.scrollDelay = 20;
        this.scrollInc = 0.05;
        this.scrollSpeed = this.scrollInc * this.player.scoring.speed;
    } 

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    translateX(x) {
        this.x = this.x + x;
    }

    translateY(y) {
        this.y = this.y + y;
    }

    update() {
        const time = new Date().getTime();
        if (time >= this.scrollTimer + this.scrollDelay) {
            this.scrollTimer = time;
            this.scroll();
        }
    }

    updateScrollSpeed() {
        this.scrollSpeed = this.player.scoring.speed * this.scrollInc;
        console.log(this.scrollSpeed);

    }
    
    scroll() {
        this.y = this.y + this.scrollSpeed;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.scrollSpeed = this.player.scoring.speed * this.scrollInc;
    }

}