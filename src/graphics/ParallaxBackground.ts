import * as PIXI from "pixi.js"
import { Settings } from "../utils/Settings";

class ParallaxBackground extends PIXI.Container {
    private layer0: PIXI.TilingSprite;
    private layer1: PIXI.TilingSprite;
    private layer2: PIXI.TilingSprite;
    private layer3: PIXI.TilingSprite;
    private layer4: PIXI.TilingSprite;
    private layer5: PIXI.TilingSprite;
    private layer6: PIXI.TilingSprite;
    private layer7: PIXI.TilingSprite;

    constructor() {
        super();

        this.createLayers();
    }

    public updateLayers(): void {
        this.layer7.tilePosition.x += Settings.LAYER_7_SPEED;
        this.layer6.tilePosition.x += Settings.LAYER_6_SPEED;
        this.layer5.tilePosition.x += Settings.LAYER_5_SPEED;
        this.layer4.tilePosition.x += Settings.LAYER_4_SPEED;
        this.layer3.tilePosition.x += Settings.LAYER_3_SPEED;
        this.layer2.tilePosition.x += Settings.LAYER_2_SPEED;
        this.layer1.tilePosition.x += Settings.LAYER_1_SPEED;
        this.layer0.tilePosition.x += Settings.LAYER_0_SPEED;
    }
    

    private createLayers(): void {
        this.layer7 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer7") });
        this.addChild(this.layer7);
        
        this.layer6 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer6") });
        this.addChild(this.layer6);
        
        this.layer5 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer5") });
        this.addChild(this.layer5);
        
        this.layer4 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer4") });
        this.addChild(this.layer4);
        
        this.layer3 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer3") });
        this.addChild(this.layer3);
        
        this.layer2 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer2") });
        this.addChild(this.layer2);
        
        this.layer1 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer1") });
        this.addChild(this.layer1);

        this.layer0 = new PIXI.TilingSprite({ texture: PIXI.Texture.from("layer0") });
        this.addChild(this.layer0);
    }

    public destroy(): void {
        super.destroy(true);
    }
}

export { ParallaxBackground }
