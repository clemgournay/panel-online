export class GUI {

    constructor(game) {
        this.game = game;
        this.viewContEl = document.querySelector('.view-cont');
        this.startEl = document.getElementById('start');
        this.pauseEl = document.getElementById('pause');
        this.gameOverEl = document.getElementById('game-over');
        this.scoringEl = document.getElementById('scoring');
        this.mainEl = document.querySelector('main');
        this.currentView;
        this.showModes();
        if (this.game.mode !== 'multiplayer') {
            this.scoringEl.classList.add('shown');
        }
    }

    showView(id) {
        const viewEl = document.getElementById(id);
        viewEl.classList.add('shown');
        this.currentView = viewEl;
        this.unlockView();
    }

    hideView(id) {
        const viewEl = document.getElementById(id);
        const actionsEl = viewEl.querySelector('.actions');
        viewEl.classList.remove('shown');
        if (actionsEl) actionsEl.classList.remove('shown');
        this.currentView = null;
    }

    lockView() {
        this.currentView.classList.add('locked');
    }

    unlockView() {
        this.currentView.classList.remove('locked');
    }

    showEl(id) {
        const viewEl = document.getElementById(id);
        viewEl.classList.add('shown');
    }

    hideEl(id) {
        const el = document.getElementById(id);
        el.classList.remove('shown');
    }

    showActions() {
        const actionsEl = this.currentView.querySelector('.actions');
        actionsEl.classList.add('shown');
    }

    hideActions() {
        const actionsEl = this.currentView.querySelector('.actions');
        actionsEl.classList.remove('shown');
    }

    showModes() {
        const propEls  = this.scoringEl.querySelectorAll('.property');
        for (let propEl of propEls) {
            if (propEl.dataset.mode === 'all' || propEl.dataset.mode === this.game.mode) {
                propEl.classList.add('shown');
            } else {
                propEl.classList.remove('shown');
            }
        }
    }
    
    showValue(key, value) {
        const countEl = this.currentView.querySelector(`[data-value="${key}"]`);
        countEl.innerHTML = value;
    }

    addClass(className) {
        this.currentView.classList.add(className);
    }

    removeClass(className) {
        this.currentView.classList.remove(className);
    }

    updateScoring() {
        for (let key in this.game.mainPlayer.scoring) {
            const valueEls = this.scoringEl.querySelectorAll(`[data-value=${key}]`);
            for (let valueEl of valueEls) {
                if (valueEl) valueEl.innerHTML = this.game.mainPlayer.scoring[key];
            }
        
        }
    }
}
