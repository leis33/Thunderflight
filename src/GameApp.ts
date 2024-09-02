import * as PIXI from "pixi.js";
import { Main } from "./scenes/Main";
import { Settings } from "./utils/Settings";

let gameApp: GameApp;

class GameApp {
    private app: PIXI.Application;
    private main: PIXI.Container;

    constructor() {
        this.createApp();
    }

    private async createApp(): Promise<void> {
        this.app = new PIXI.Application();
        await this.app.init({
            resizeTo: window,
            background: "#00AA00"
        });
        
        let mainNode: HTMLElement = document.getElementById(Settings.CONTAINER_ID);
        mainNode.appendChild(<any>this.app.canvas);


        this.app.resizeTo.onresize = () => {
            this.resize();
        }

        this.loadAssets();
    }
    
    private async loadAssets(): Promise<void> {
        PIXI.Assets.add({ alias: "plane", src: "assets/sprites/plane.png" });
        await PIXI.Assets.load(["plane"]);

        this.startMainScene();
    }
    
    private startMainScene(): void {
        this.main = new Main(this.app);
        this.app.stage.addChild(this.main);
        this.resize();
    }
    
    public resize(): void {
        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const scale = Math.min(width / Settings.GAME_WIDTH, height / Settings.GAME_HEIGHT);

        if (this.main) {
            this.main.scale.set(scale);
        }
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
