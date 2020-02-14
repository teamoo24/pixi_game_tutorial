// Transition は interface なので extends ではなく implement を使う
export default class Immediate {
    constructor() {
        this.onTransitionFinished = () => { };
        this.finished = false;
    }
    /**
    *	トランジション描画物を含むPIXI.Containerインスタンスを返す
    */
    getContainer() {
        return null;
    }
    /**
    * トランジション開始処理
    * このトランジションは即時終了させる
    */
    begin() {
        this.finished = true;
        this.onTransitionFinished();
    }
    /**
    * トランジションが開始しているかどうかを返す
    * このトランジションは即時終了するため、trueになることはない
    */
    isBegan() {
        return false;
    }
    /**
    * トランジションが終了しているかどうかを返す
    */
    isFinished() {
        return this.finished;
    }
    /**
    * トランジションが実行中かどうかを返す
    * このトランジションは即時終了されるため、trueになることはない
    */
    isActive() {
        return false;
    }
    /**
    * トランジションを更新する
    * このトランジションは即時終了するため、何も行わない
    */
    update(_dt) {
        return;
    }
    /**
    * トランジション終了時のコールバックを登録する
    */
    setCallback(callback) {
        this.onTransitionFinished = callback;
    }
}
