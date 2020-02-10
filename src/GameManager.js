import * as PIXI from 'pixi.js';
export default class GameManager {
    /**
    * コンストラクタ
    * PIXI.Applicationインスタンスはユーザー任意のものを使用する
    */
    constructor(app) {
        // トランジションが完了しているかのフラグ
        this.sceneTransitionOutFinished = true;
        if (GameManager.instance) {
            throw new Error('GameManager can be instantiate only once');
        }
        this.game = app;
    }
    /**
    *	可能であれば新しいシーンへのトランジションを開始する
    */
    static transitionInIfPossible(newScene) {
        const instance = GameManager.instance;
        if (!instance.sceneTransitionOutFinished) {
            return false;
        }
        if (instance.currentScene) {
            instance.currentScene.destroy();
        }
        instance.currentScene = newScene;
        if (instance.game) {
            instance.game.stage.addChild(newScene);
        }
        newScene.beginTransitionIn((_) => { });
        return true;
    }
    /**
    * シーンをロードする
    * 新しいシーンと古いシーンのトランジションを同時に開始する
    */
    static loadScene(newScene) {
        const instance = GameManager.instance;
        if (instance.currentScene) {
            instance.sceneTransitionOutFinished = false;
            instance.currentScene.beginTransitionOut((_) => {
                instance.sceneTransitionOutFinished = true;
                GameManager.transitionInIfPossible(newScene);
            });
        }
        else {
            instance.sceneTransitionOutFinished = true;
            GameManager.transitionInIfPossible(newScene);
        }
    }
    /**
    *	ゲームを起動する
    *	画面サイズやPIXI.ApplicationOptionsを渡すことが出来る
    */
    static start(params) {
        // PIXI Applicatio生成
        const game = new PIXI.Application(params.glHeight, params.glHeight, params.option);
        // GameManagerインスタンス生成
        GameManager.instance = new GameManager(game);
        // canvasをDOM追加
        document.body.appendChild(game.view);
        game.ticker.add((delta) => {
            // メインループ
        });
    }
}
