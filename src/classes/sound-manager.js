import { Wait } from '../utils/timing';

export class SoundManager {

    constructor(game) {
        this.game = game;
        this.nbChannels = 20;
        this.channels = {};
        this.bgmBuffer = 75;
    }

    async play(id, portionIndex = -1) {

        const audio = this.game.assets.audios[id];

        let existingChannel = this.getChannelByKeyValue('id', id);
        if (existingChannel && audio.bgm) {
            existingChannel.play();
        } else {
            const index = this.getAvailableChannelIndex();
            if (index >= 0) {
                this.channels[index] = audio.cloneNode();
                this.channels[index].volume = audio.volume;
    
                let startTime = 0;
                if (portionIndex >= 0) {
                    startTime = (portionIndex * audio.portion) / 1000;
                }
                this.channels[index].currentTime = startTime;
                this.channels[index].play();
    
                if (portionIndex >= 0) {
                    await Wait(audio.portion);
                    this.channels[index].pause();
                }

            }
        }

    }

    pause(id) {
        let index = this.getChannelIndexByKeyValue('id', id);
        if (index >= 0) {
            this.channels[index].pause();
        }
    }
    
    update() {
        const audio = this.game.assets.audios.bgm;
        const bgm = this.getChannelByKeyValue('id', 'bgm');
        if (bgm) {
            if (bgm.currentTime >= bgm.duration - (this.bgmBuffer/1000)) {
                bgm.currentTime = (audio.loop_timepoint / 1000);
            }
        }
        
    }
    
    getChannelIndexByKeyValue(key, value) {
        let x = 0, found = false;
        while (!found && x < this.nbChannels) {
            if (this.channels[x] && this.channels[x][key] === value) found = true;
            else x++;
        }
        return (found) ? x : -1;
    }

    getChannelByKeyValue(key, value) {
        let index = this.getChannelIndexByKeyValue(key, value);
        return (index >= 0) ? this.channels[index] : null;
    }

    getAvailableChannelIndex() {
        let x = 0, found = false;
        while (!found && x < this.nbChannels) {
            if (!this.channels[x] || this.channels[x].paused) found = true;
            else x++;
        }
        return (found) ? x : -1;
    }

    reset() {
        this.channels = {};
        this.bgmTime =  new Date().getTime();
        this.looped = false;

    }
    
}