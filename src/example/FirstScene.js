import * as PIXI from 'pixi.js';
import GameManager from "./GameManager";
import SecondScene from './SecondScene';
import Scene from "./Scene";
export default class FirstScene extends Scene {
    /**
    *	コンストラクタ
    *	描画物を初期化する
    */
    constructor() {
        super();
        // メインループ更新を確認するためのカウント
        this.count = 0;
        const textStyle = new PIXI.TextStyle({
            fontSize: 64,
            fill: 0xffffff
        });
        const renderer = GameManager.instance.game.renderer;
        this.text = new PIXI.Text('first scene', textStyle);
        this.text.interactive = true;
        this.text.anchor.set(0.5, 0.5);
        this.text.position.set(renderer.width * 0.5, renderer.height * 0.5);
        this.text.on('pointerdown', this.nextScene);
        this.addChild(this.text);
    }
    /**
    * メインループ
    * 表示されているテキストの更新を行う
    */
    update(dt) {
        super.update(dt);
        this.text.text = 'first scene \n' + this.count++;
    }
    /**
    * SecondSceneのロード
    */
    nextScene() {
        GameManager.loadScene(new SecondScene());
    }
}
