import { TitleScreen } from './controllers/title-screen.js';
import { Settings } from './controllers/settings.js';
import { StageSelection } from './controllers/stage-selection.js';
import { Game } from './controllers/game.js';
import { Menu } from './controllers/menu.js';

const mainEl = document.querySelector('main');
const controllerName = mainEl.dataset.controller;

let run = async () => {
    let controller;
    switch (controllerName) {
        case 'title-screen':
            controller = new TitleScreen();
            controller.run();
        break;    
         
        case 'menu':
            controller = new Menu();
            controller.run();
        break;

        case 'stage-selection':
            controller = new StageSelection();
            controller.run();
        break;
        
        case 'settings':
            controller = new Settings();
            controller.run();
        break; 
    
        case 'game':
            const settings = {
                score: window.localStorage.getItem('score') ? parseInt(window.localStorage.getItem('score')) : 0,
                stage: window.localStorage.getItem('stage') ? parseInt(window.localStorage.getItem('stage')) : 1,
                speed: window.localStorage.getItem('speed') ? parseInt(window.localStorage.getItem('speed')) : 1,
                round: window.localStorage.getItem('round') ? parseInt(window.localStorage.getItem('round')) : 1,
                mode: window.localStorage.getItem('mode') ? window.localStorage.getItem('mode') : 'stage',
            }
            controller = new Game(settings);
            await controller.load();
            controller.init();
        break;
    }
}

run();


