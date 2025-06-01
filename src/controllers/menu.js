export class Menu {

    constructor() {
        this.buttons = document.querySelectorAll('.items .btn');

    }

    run() {
        for (let btn of this.buttons) {
            btn.onclick = () => {
                const value = btn.dataset.setValue;
                window.localStorage.setItem('mode', value);

                switch (value) {
                    case 'stage':
                        window.location.href = '../stage-selection';
                    break;

                    case 'infinite':
                        window.location.href = '../settings';
                    break;

                    
                    case 'multiplayer':
                        window.location.href = '../settings';
                    break;
                }
            }
        }
    }

}