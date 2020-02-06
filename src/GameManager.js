export default class GameManager {
    /**
    * コンストラクタ
    * PIXI.Applicationインスタンスはユーザー任意のものを使用する
    */
    constructor(app) {
        if (GameManager.instance) {
            throw new Error('GameManager can be instantiate only once');
        }
        this.game = app;
    }
    /**
    *	ゲームを起動する
    *	画面サイズやPIXI.ApplicationOptionsを渡すことが出来る
    */
    static start(params) {
        // PIXI Applicatio生成
        const game = new PIXI.Application(params.glWidth, params.glHeight, params.option);
    }
}
