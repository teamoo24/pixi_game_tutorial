import UpdateObject from '../interfaces/UpdateObjects'


export default abstract class Scene extends PIXI.Container{
	//メインループ
	public update(delta: number) : void {
		this.updateRegisteredObjects(delta);
	}

	//メインループで更新処理を行うべきオブジェクトの登録
	protected registerUpdatingObject(object: UpdateObject): void {
	}

	// registerUpdatingObjectで登録されたオブジェクトのフレーム更新
	protected updateRegisteredObjects(delta: number):void {
	}

	// シーン開始トランジット
	// 引数はトランジション終了時のコールバック
	public beginTransitionIn(onTransitionFinished: (scene: Scene) => void): void {
		onTransitionFinished(this);
	}

	// シーン終了トランジション
	// 引数でトランジション終了時のコールバック
	public beginTransitionOut(onTransitionFinished: (scene: Scene)=> void): void {
		onTransitionFinished(this);
	}
}