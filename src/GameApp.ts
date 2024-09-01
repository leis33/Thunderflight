import * as PIXI from "pixi.js";
import { Main } from "./scenes/Main";

let gameApp: GameApp;

class GameApp {
    private app: PIXI.Application;
    private main: PIXI.Container;

    constructor() {
        this.createApp();
    }

    private async createApp(): Promise<any> {
        this.app = new PIXI.Application();
        await this.app.init({
            resizeTo: window,
            background: "#00AA00"
        });
        
        let mainNode: HTMLElement = document.getElementById("gameApp");
        mainNode.appendChild(<any>this.app.canvas);

        this.loadAssets();
    }
    
    private async loadAssets(): Promise<any> {
        PIXI.Assets.add({ alias: "plane", src: "assets/sprites/plane.png" });
        await PIXI.Assets.load(["plane"]);

        this.startMainScene();
    }
    
    private startMainScene(): void {
        this.main = new Main(this.app);
        this.app.stage.addChild(this.main);
    }

    public destroy(): void {
        if (this.main) {
            this.main.destroy();
        }

        this.app.stage.removeAllListeners();
        this.app.destroy(true, true);
    }
}

export { GameApp }

gameApp = new GameApp();

window.addEventListener("beforeunload", (event) => {
    if (gameApp) {
        gameApp.destroy();
    }
});
