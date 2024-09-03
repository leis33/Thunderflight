import * as PIXI from "pixi.js"

class UI extends PIXI.Container {
    private scoreText: PIXI.Text;

    constructor() {
        super();

        this.scoreText = new PIXI.Text({ text: "SCORE: 0", style: { fontSize: 36, fill: "#FFFFFF" } });
        this.scoreText.x = 30;
        this.scoreText.y = 30;
        this.addChild(this.scoreText);
    }

    public setScore(score: number): void {
        this.scoreText.text = "SCORE: " + score;
    }

    destroy(): void {
        super.destroy(true);
    }
}

export { UI }
