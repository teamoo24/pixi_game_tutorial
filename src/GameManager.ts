import * as PIXI from 'pixi.js';

export default class GameManager {
	// シングルトンインスタンス
	public static instance: GameManager;
	// PIXI.Applicationをインスタンス
	public game!: PIXI.Application;



	/**
	* コンストラクタ
	* PIXI.Applicationインスタンスはユーザー任意のものを使用する
	*/

	constructor(app: PIXI.Application) {
		if(GameManager.instance) {
			throw new Error('GameManager can be instantiate only once');
		}

		type PixiApplicationV5 = {
			autoStart?:boolean;
		}

		this.game = app;
	}

	/**
	*	ゲームを起動する
	*	画面サイズやPIXI.ApplicationOptionsを渡すことが出来る
	*/
	public static start(params: {
		glWidth: number,
		glHeight: number,
		option?: PIXI.ApplicationOptions
	}): void {
		// PIXI Applicatio生成
		const game = new PIXI.Application(params.glHeight, params.glHeight, params.option)
		// GameManagerインスタンス生成
		GameManager.instance = new GameManager(game);

		// canvasをDOM追加
		document.body.appendChild(game.view);

		game.ticker.add((delta:number) => {
			// メインループ
		});
	}
}