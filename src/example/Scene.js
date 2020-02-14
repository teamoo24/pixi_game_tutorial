import Fade from './transition/Fade';
/**
*	このゲームにおけるトランジション
*		* 描画物を持つ
*		* メインループによる時間経過で描画物や状態を変化する
*		* 状態は外部から制御させない
*		* 処理終了時に実行するコールバックを設定できる
*		* 自然消滅する
*		* シーンを直接扱わない
*/
export default class Scene extends PIXI.Container {
    constructor() {
        super(...arguments);
        /**
        *	更新すべきオブジェクトを保持する
        */
        this.objectsToUpdate = [];
        /**
        *	シーン開始用のトランジションオブジェクト
        */
        this.transitionIn = new Fade(1.0, 0.0, -0.01);
        /**
        *	シーン終了用のトランジションオブジェクト
        */
        this.transitionOut = new Fade(0.0, 1.0, 0.01);
    }
    /**
    *	GameManagerによってrequestAnimationFrame毎に呼び出されるメソッド
    */
    update(delta) {
        if (this.transitionIn.isActive()) {
            this.transitionIn.update(delta);
        }
        else if (this.transitionOut.isActive()) {
            this.transitionOut.update(delta);
        }
    }
    //メインループで更新処理を行うべきオブジェクトの登録
    registerUpdatingObject(object) {
    }
    // registerUpdatingObjectで登録されたオブジェクトのフレーム更新
    updateRegisteredObjects(delta) {
    }
    /**
    *	シーン追加トランジション開始
    *	引数でトランジション終了時のコールバックを指定できる
    */
    beginTransitionIn(onTransitionFinished) {
        this.transitionIn.setCallback(() => onTransitionFinished(this));
        const container = this.transitionIn.getContainer();
        if (container) {
            this.addChild(container);
        }
        this.transitionOut.begin();
    }
    /**
    *	シーン削除トランジション開始
    *	引数でトランジション終了時のコールバックを指定できる
    */
    beginTransitionOut(onTransitionFinished) {
        this.transitionOut.setCallback(() => onTransitionFinished(this));
        const container = this.transitionOut.getContainer();
        if (container) {
            this.addChild(container);
        }
        this.transitionOut.begin();
    }
}
