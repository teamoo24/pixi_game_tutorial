export default class Scene extends PIXI.Container {
    //メインループ
    update(delta) {
        this.updateRegisteredObjects(delta);
    }
    //メインループで更新処理を行うべきオブジェクトの登録
    registerUpdatingObject(object) {
    }
    // registerUpdatingObjectで登録されたオブジェクトのフレーム更新
    updateRegisteredObjects(delta) {
    }
    // シーン開始トランジット
    // 引数はトランジション終了時のコールバック
    beginTransitionIn(onTransitionFinished) {
        onTransitionFinished(this);
    }
    // シーン終了トランジション
    // 引数でトランジション終了時のコールバック
    beginTransitionOut(onTransitionFinished) {
        onTransitionFinished(this);
    }
}
