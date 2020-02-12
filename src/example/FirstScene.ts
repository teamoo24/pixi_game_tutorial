import GameManager from "./GameManager"
import Scene from "./Scene"

export default class FirstScene extends Scene {
	private text!: PIXI.Text;
	// メインループ更新を確認するためのカウントkaunnto
	private count: number = 0;

	/**
	*	コンストラクタ
	*	描画物を初期化する
	*/
	constructor() {
		super();

		const textStyle = new PIXI.TextStyle({
			fontSize : 64,
			fill : 0xffffff
		});

		const renderer = GameManager.instance.game.render;

		this.text = new PIXI.Text('first scene', textStyle);
		this.text.interactive = true;
		this.text.anchor.set(0.5,0.5);
		this.text.on('pointerdown', this.nextScene);
		this.addChild(this.text)
	}

	/**
	* メインループ
	* 表示されているテキストの更新を行う
	*/
	public update(dt:number): void {
		super.update(dt);
		this.text.text = 'first scene ¥n${this.count++}';
	}

	/**
	* SecondSceneのロード
	*/

	public nextScene(): void {

	}
}