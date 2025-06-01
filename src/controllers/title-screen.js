import { Wait } from '../utils/timing';

export class TitleScreen {

    constructor() {
        this.mainEl = document.querySelector('main');
        this.startBtn = document.getElementById('start-btn');
    }

    async run() {
        this.mainEl.classList.add('shown');
        await Wait(2000);
        this.startBtn.classList.add('shown');
        this.onAnimationComplete();
    }

    onAnimationComplete() {
        this.startBtn.onclick = () => {
            window.location.href = './menu';
        }
    }

}