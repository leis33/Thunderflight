import * as PIXI from "pixi.js"
import { Settings } from "../utils/Settings";

class UI extends PIXI.Container {
    private readonly FUEL_TEXT_OFFSET_X: number = 30

    private scoreText: PIXI.Text;
    private fuelText: PIXI.Text;

    constructor() {
        super();

        this.scoreText = new PIXI.Text({ text: "SCORE: 0", style: { fontSize: 36, fill: "#FFFFFF" } });
        this.scoreText.x = 30;
        this.scoreText.y = 30;
        this.addChild(this.scoreText);
        
        this.fuelText = new PIXI.Text({ text: "FUEL: 100", style: { fontSize: 36, fill: "#FFFFFF" } });
        this.fuelText.x = Settings.GAME_WIDTH - this.fuelText.width - this.FUEL_TEXT_OFFSET_X;
        this.fuelText.y = 30;
        this.addChild(this.fuelText);
    }

    public setScore(score: number): void {
        this.scoreText.text = "SCORE: " + score;
    }

    public setFuel(fuel: number): void {
        this.fuelText.text = "FUEL: " + fuel;
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { UI }
