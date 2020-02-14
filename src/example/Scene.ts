import UpdateObject from '../interfaces/UpdateObjects'
import Transition from '../interfaces/Transition'
import Immediate from './transition/immediate'
import Fade from './transition/Fade'


/**
*	このゲームにおけるトランジション
*		* 描画物を持つ
*		* メインループによる時間経過で描画物や状態を変化する
*		* 状態は外部から制御させない
*		* 処理終了時に実行するコールバックを設定できる
*		* 自然消滅する
*		* シーンを直接扱わない
*/

export default abstract class Scene extends PIXI.Container{
	/**
	*	更新すべきオブジェクトを保持する
	*/
	protected objectsToUpdate: UpdateObject[] = []

	/**
	*	シーン開始用のトランジションオブジェクト
	*/
	protected transitionIn: Transition = new Immediate();

	/**
	*	シーン終了用のトランジションオブジェクト
	*/
	protected transitionOut: Transition = new Immediate();

	/**
	*	GameManagerによってrequestAnimationFrame毎に呼び出されるメソッド
	*/
	public update(delta: number) : void {
		if(this.transitionIn.isActive()) {
			this.transitionIn.update(delta);
		} else if (this.transitionOut.isActive()) {
			this.transitionOut.update(delta);
		}
	}

	//メインループで更新処理を行うべきオブジェクトの登録
	protected registerUpdatingObject(object: UpdateObject): void {
	}

	// registerUpdatingObjectで登録されたオブジェクトのフレーム更新
	protected updateRegisteredObjects(delta: number):void {
	}

	/**
	*	シーン追加トランジション開始
	*	引数でトランジション終了時のコールバックを指定できる
	*/
	public beginTransitionIn(onTransitionFinished: (scene: Scene) => void): void {
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
	public beginTransitionOut(onTransitionFinished: (scene: Scene)=> void): void {
		this.transitionOut.setCallback(() => onTransitionFinished(this));

		const container = this.transitionOut.getContainer();
		if (container) {
			this.addChild(container);
		}

		this.transitionOut.begin();
	}
}