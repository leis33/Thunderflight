import * as PIXI from "pixi.js";
import { Main } from "./scenes/Main";
import { Settings } from "./utils/Settings";
import { Localizer } from "./utils/Localizer";

let gameApp: GameApp;

class GameApp {
    private app: PIXI.Application;
    private main: Main;

    private blackBars: PIXI.Graphics;

    constructor() {
        this.createApp();
        this.loadAssets();
    }

    private async createApp(): Promise<void> {
        this.app = new PIXI.Application();

        await this.app.init({
            resizeTo: window,
            background: Settings.BACKGROUND_COLOR
        });
        
        let mainNode: HTMLElement = document.getElementById(Settings.CONTAINER_ID);
        mainNode.appendChild(<any>this.app.canvas);


        this.app.renderer.events.cursorStyles.default = "none";
        this.app.resizeTo.onresize = () => {
            this.resize();
        }

        Localizer.getInstance().language = Settings.LANGUAGE;
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
        PIXI.Assets.add({ alias: "gas_can", src: "assets/sprites/gas_can.png" });
        PIXI.Assets.add({ alias: "heart", src: "assets/sprites/heart.png" });

        PIXI.Assets.add({ alias: "en", src: "assets/locals/en.json" });

        const assetsKeys: string[] = [
            "plane", "layer0", "layer1", "layer2", "layer3", "layer4", "layer5", "layer6", "layer7",
            "tank1", "tank2", "bullet1", "bullet2", "missile", "gas_can", "heart", "en"
        ];

        await PIXI.Assets.load(assetsKeys);

        this.startMainScene();
    }
    
    private startMainScene(): void {
        this.main = new Main(this.app);
        this.app.stage.addChild(this.main);

        this.blackBars = new PIXI.Graphics();
        this.app.stage.addChild(this.blackBars);

        this.resize();
    }
    
    private resize(): void {
        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const scale = Math.min(width / Settings.GAME_WIDTH, height / Settings.GAME_HEIGHT);

        if (this.main) {
            this.main.scale.set(scale);
            // this.main.x = this.app.screen.width / 2 - this.main.width / 2;
            // this.main.y = this.app.screen.height / 2 - this.main.height / 2;
        }

        this.createBlackBars();
    }

    private createBlackBars(): void {
        const bounds: PIXI.Bounds = this.main.getBackgroundBounds();

        this.blackBars.clear();

        if (bounds.width < this.app.screen.width) {
            this.blackBars.beginPath();
            this.blackBars.moveTo(bounds.width, 0);
            this.blackBars.lineTo(this.app.screen.width, 0);
            this.blackBars.lineTo(this.app.screen.width, this.app.screen.height);
            this.blackBars.lineTo(bounds.width, this.app.screen.height);
            this.blackBars.lineTo(bounds.width, 0);
            this.blackBars.fill(Settings.BACKGROUND_COLOR);
        }
    }

    public destroy(): void {
        if (this.main) {
            this.main.destroy();
        }

        if (this.app.stage) {
            this.app.stage.removeAllListeners();
        }

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
