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
    *	可能であれば新しいシーンへのトランジションを開始するメソッドを設定する
    *		・トランジション開始を処理するメソッドの名称を「transitionInIfPossible」としているのは、トランジション開始処理の排他をこのメソッドで
    *		  行なっていることを明確にするためです
    *		・新しいシーンのトランジション開始が排他される条件には、単純に前のシーンのトランジション終了が完了していないという理由のほかに、新しいシーン
    *		  でするリソースの取得が終わっておらず描画できない状態である、という理由などがあります。
    *
    *	以下は現時点の実装で現在のシーンがある状態とない状態の状態遷移を表したものです。
    *		・現在のシーンがない場合
    *			- 新しいシーン -> new() -> Transition In 開始 ->  Transition In 終了 -> Active -> new()
    *		・現在のシーンがある場合
    *			- 古いシーン -> Active -> Transition Out 開始 -> Transition Out 終了 -> Destroy
    *			- 新しいシーン -> new()											  -> Transition In 開始 -> Transition In 終了 -> Active
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
        const instance = new GameManager(game);
        GameManager.instance = instance;
        // canvasをDOM追加
        document.body.appendChild(game.view);
        // メインループ
        game.ticker.add((delta) => {
            if (instance.currentScene) {
                instance.currentScene.update(delta);
            }
        });
    }
}
