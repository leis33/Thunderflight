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
            background: Settings.BACKGROUND_COLOR
        });
        
        let mainNode: HTMLElement = document.getElementById(Settings.CONTAINER_ID);
        mainNode.appendChild(<any>this.app.canvas);


        this.app.resizeTo.onresize = () => {
            this.resize();
        }

        this.loadAssets();
    }
    
    private async loadAssets(): Promise<void> {
        PIXI.Assets.add({ alias: "layer0", src: "assets/sprites/background/layer0.png" });
        PIXI.Assets.add({ alias: "layer1", src: "assets/sprites/background/layer1.png" });
        PIXI.Assets.add({ alias: "layer2", src: "assets/sprites/background/layer2.png" });
        PIXI.Assets.add({ alias: "layer3", src: "assets/sprites/background/layer3.png" });
        PIXI.Assets.add({ alias: "layer4", src: "assets/sprites/background/layer4.png" });
        PIXI.Assets.add({ alias: "layer5", src: "assets/sprites/background/layer5.png" });
        PIXI.Assets.add({ alias: "layer6", src: "assets/sprites/background/layer6.png" });
        PIXI.Assets.add({ alias: "layer7", src: "assets/sprites/background/layer7.png" });

        PIXI.Assets.add({ alias: "plane", src: "assets/sprites/plane.png" });
        PIXI.Assets.add({ alias: "tank1", src: "assets/sprites/tank1.png" });
        PIXI.Assets.add({ alias: "tank2", src: "assets/sprites/tank2.png" });
        PIXI.Assets.add({ alias: "bullet1", src: "assets/sprites/bullet1.png" });
        PIXI.Assets.add({ alias: "bullet2", src: "assets/sprites/bullet2.png" });
        PIXI.Assets.add({ alias: "missile", src: "assets/sprites/missile.png" });

        const assetsKeys: string[] = [
            "plane", "layer0", "layer1", "layer2", "layer3", "layer4", "layer5", "layer6", "layer7",
            "tank1", "tank2", "bullet1", "bullet2", "missile"
        ];

        await PIXI.Assets.load(assetsKeys);

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
            // this.main.x = this.app.screen.width / 2 - this.main.width / 2;
            // this.main.y = this.app.screen.height / 2 - this.main.height / 2;
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
