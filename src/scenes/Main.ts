import * as PIXI from "pixi.js";

class Main extends PIXI.Container {
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        super();

        this.app = app;

        console.log("Main loaded");
    }
}

export { Main }
