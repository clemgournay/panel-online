export class StageSelection {

    constructor() {
        this.stagesEl = document.querySelector('.stages');
        this.stageTemplate = this.stagesEl.querySelector('.template').cloneNode(true);
        this.stage = window.localStorage.getItem('stage') ? parseInt(window.localStorage.getItem('stage')) : 1;
        this.stages = [
            {id: 1, name: 'STAGE 1'},
            {id: 2, name: 'STAGE 2'},
            {id: 3, name: 'STAGE 3'},
            {id: 4, name: 'STAGE 4'},
            {id: 5, name: 'STAGE 5'},
            {id: 6, name: 'STAGE 6'}
        ];
    }

    run() {
        this.stagesEl.querySelector('.template').remove();
        console.log(this.stageTemplate);
        let count = 1;
        for (let stage of this.stages) {
            const stageEl = this.stageTemplate.cloneNode(true);
            stageEl.classList.remove('template');
            stageEl.dataset.stage = stage.id;
            if (count > this.stage) stageEl.classList.add('disabled');
            const thumbnailEl = stageEl.querySelector('[data-thumbnail]');
            thumbnailEl.style.backgroundImage = `url(../assets/images/stages/${stage.id}.jpg)`;
            for (let key in stage) {
                const valueEl = stageEl.querySelector(`[data-value="${key}"]`);
                if (valueEl) valueEl.innerHTML = stage[key];
            }
            const roundEls = stageEl.querySelectorAll('.rounds .round');
            let roundCount = 1;
            for (let roundEl of roundEls) {

                if (
                    parseInt(window.localStorage.stage) > count || 
                    (parseInt(window.localStorage.stage) === count && parseInt(window.localStorage.round) > roundCount)
                ) {
                    roundEl.classList.add('checked');
                } else {
                    roundEl.classList.remove('checked');
                }
                roundCount++;
            }
            stageEl.onclick = () => {
                const stage = stageEl.dataset.stage;
                if (stage !== parseInt(window.localStorage.stage)) {
                    window.localStorage.round = 1;
                }
                window.localStorage.stage = parseInt(stage);
                window.location.href = '../game';
            }
            this.stagesEl.appendChild(stageEl);
            count++;
        }
    }

}