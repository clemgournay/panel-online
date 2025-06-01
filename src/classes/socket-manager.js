import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { ENV } from '../env';
import { Grid } from "./grid";

export class SocketManager {

    constructor(game) {
        this.game = game;
        this.socket = io(ENV.apiURL);
    }

    init() {

        this.socket.on('game data', (data) => {
            console.log(data);
            this.game.setGrid(data.grid);
            for (let playerID of data.players) {
                let main = playerID === this.socket.id;
                this.game.addPlayer(playerID, main);
            }
        });

        this.socket.on('new player', (playerID) => {
            this.game.addPlayer(playerID);
        });

        this.socket.on('everyone here', () => {
            this.game.gui.hideView('lobby');
            this.game.gui.showView('ready');
            this.game.gui.removeClass('ready');
        });

        this.socket.on('everyone ready', () => {
            this.game.gui.hideEl('other-player-ready');
            this.game.run();
        });

        this.socket.on('moved', (playerID, coor) => {
            this.game.playerMoved(playerID, coor);
        });

        this.socket.on('swapped', (playerID) => {
            this.game.playerSwapped(playerID);
        });

        this.socket.on('scrolled', (playerID, amount) => {
            this.game.playerScrolled(playerID, amount);
        });

        this.socket.on('new row', (data) => {
            this.game.addRow(data);
        });
    }

    emit(message, data = null) {
        this.socket.emit(message, data);
    }
}