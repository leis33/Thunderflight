class Settings {
    public static GAME_WIDTH: number = 1280;
    public static GAME_HEIGHT: number = 720;

    public static BACKGROUND_COLOR: string = "#95eda3";
    public static CONTAINER_ID: string = "gameApp";

    public static LAYER_0_SPEED: number = -1;
    public static LAYER_1_SPEED: number = -0.5;
    public static LAYER_2_SPEED: number = -0.5;
    public static LAYER_3_SPEED: number = -0.5;
    public static LAYER_4_SPEED: number = -0.5;
    public static LAYER_5_SPEED: number = -0.2;
    public static LAYER_6_SPEED: number = -0.1;
    public static LAYER_7_SPEED: number = -0.05;

    public static PLANE_HITBOX_WIDTH: number = 110;
    public static PLANE_HITBOX_HEIGHT: number = 50;

    public static TANKS_COUNT: number = 4;
    public static TANK_SPEED: number = -1.2;
    public static TANK_SPAWN_X: number = Settings.GAME_WIDTH + 60;
    public static TANK_X_MIN: number = -120;
    public static TANK_SPAWN_Y_MAX: number = 110;
    public static TANK_SPAWN_Y_MIN: number = 50;

    public static GRAVITY: number = 480;
    public static BULLET_VELOCITY_MIN: number = -500;
    public static BULLET_VELOCITY_MAX: number = -1100;

    public static MISSILES_COUNT: number = 10;
    public static MISSILE_SPEED: number = -3;
    public static MISSILE_SPAWN_X: number = Settings.GAME_WIDTH + 60;
    public static MISSILE_X_MIN: number = -80;
    public static MISSILE_SPAWN_Y_MAX: number = 500;
    public static MISSILE_SPAWN_Y_MIN: number = 50;
    public static MISSILE_HITBOX_HEIGHT: number = 10;

}

export { Settings }
