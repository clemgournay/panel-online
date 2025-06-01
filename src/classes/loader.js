export class Loader {

    constructor() {
        this.assets = {};
    }

    async load(assetsToLoad) {
        this.assetsToLoad = assetsToLoad;
        this.assets = {audios: {}, images: {}};

        for (let asset of this.assetsToLoad) {
            switch (asset.type) {
                case 'image':
                    this.assets.images[asset.id] = await this.loadIMG(asset);
                break;  

                case 'audio':
                    this.assets.audios[asset.id] = await this.loadAudio(asset);
                break;  
            }

        }
        return this.assets;
    }

    async loadIMG(asset) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `../assets/images/${asset.id}.png`;
            img.onload = () => {
                resolve(img);
            }
            img.onerror = () => {
                reject();
            }
        })
    }
    async loadAudio(asset) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.id = asset.id;
            audio.src = `../assets/audios/${asset.id}.mp3`;
            if (asset.portion) audio.portion = asset.portion;
            if (asset.bgm) audio.bgm = asset.bgm;
            if (asset.volume) audio.volume = asset.volume/100;
            if (asset.loop_timepoint) audio.loop_timepoint = asset.loop_timepoint;
            audio.oncanplaythrough = () => {
                resolve(audio);
            }
            
        })
    }

}