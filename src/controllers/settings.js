export class Settings {
    
    constructor() {
        this.startBtn = document.getElementById('start-btn');
        this.propertyEls = document.querySelectorAll('.property');
        this.settings = {
            mode: window.localStorage.getItem('mode') ? window.localStorage.getItem('mode') : 'stage',
            stage: window.localStorage.getItem('stage') ? parseInt(window.localStorage.getItem('stage')) : 1,
            speed: window.localStorage.getItem('speed') ? parseInt(window.localStorage.getItem('speed')) : 1
        }
        console.log('SETTINGS', this.settings);
    }

    run() {

        this.updateValues();

        this.startBtn.onclick = () => {
            window.location.href = '../game';
        }

        const inputEls = document.querySelectorAll('input');
        for (let inputEl of inputEls) {
            const key = inputEl.dataset.key;
            inputEl.onchange = () => {
                this.settings[key] = parseInt(inputEl.value);
                this.updateValues();
            }
        }

        const toggleBtn = document.querySelectorAll('.toggle .btn');
        for (let btn of toggleBtn) {
            const key = btn.dataset.key;
            btn.onclick = () => {
                const value = btn.dataset.setValue;
                this.settings[key] = value;
                this.updateValues();
            }
        }
            
    }

    updateValues() {
        console.log(this.settings)
        for (let key in this.settings) {
            const value = this.settings[key];

            // Display values
            const valueEls = document.querySelectorAll(`[data-value="${key}"]`);
            for (let valueEl of valueEls) {
                valueEl.innerHTML = value;
            }

            // Update input value
            const inputEls = document.querySelectorAll(`input[data-key="${key}"]`);
            for (let inputEl of inputEls) {
                inputEl.value = this.settings[key];
            }

            // Set toggle buttons active
            const toggleBtn = document.querySelectorAll(`.toggle .btn[data-key="${key}"]`);
            for (let btn of toggleBtn) {
                if (btn.dataset.setValue === value) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
            
        
            window.localStorage.setItem(key, value);
            
        }
        for (let property of this.propertyEls) {
            if (property.dataset.mode === 'all' || property.dataset.mode === this.settings.mode) {
                property.classList.add('shown');
            } else {
                property.classList.remove('shown');
            }
        }
        
    }
}