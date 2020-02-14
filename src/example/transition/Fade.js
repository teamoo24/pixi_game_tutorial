import * as PIXI from 'pixi.js';
import GameManager from '../GameManager';
export default class Fade {
    constructor(alphaFrom, alphaTo, alphaProgress) {
        // 黒画面のコンテナ
        this.container = new PIXI.Container();
        // 黒画面の描画
        this.overlay = new PIXI.Graphics();
        // トランジション開始フラグ
        this.transitionBegan = false;
        // トランジション終了フラグ
        this.transitionFinished = false;
        // トランジション終了コールバック
        this.onTransitionFinished = () => { };
        this.alphaForm = alphaFrom;
        this.alphaTo = alphaTo;
        this.alphaProgress = alphaProgress;
        const width = GameManager.instance.game.view.width;
        const height = GameManager.instance.game.view.height;
        this.overlay.beginFill(0x000000);
        this.overlay.moveTo(0, 0);
        this.overlay.lineTo(width, 0);
        this.overlay.lineTo(width, height);
        this.overlay.lineTo(0, height);
        this.overlay.endFill();
        this.overlay.alpha = this.alphaForm;
        this.container.addChild(this.overlay);
    }
    getContainer() {
        return this.container;
    }
    begin() {
        this.transitionBegan = true;
    }
    isBegan() {
        return this.transitionBegan;
    }
    isFinished() {
        return this.transitionFinished;
    }
    isActive() {
        return this.isBegan() && !this.isFinished();
    }
    update(_dt) {
        if (!this.isBegan())
            return;
        if (this.isFinished())
            return;
        if ((this.alphaTo <= this.alphaForm && this.overlay.alpha <= this.alphaTo) ||
            (this.alphaTo >= this.alphaForm && this.overlay.alpha >= this.alphaTo)) {
            this.onTransitionFinished();
        }
        else {
            this.overlay.alpha += this.alphaProgress;
        }
    }
    setCallback(callback) {
        this.onTransitionFinished = callback;
    }
}
