import * as PIXI from 'pixi.js'
import UpdateObject from '../interfaces/UpdateObjects'
import Transition from '../interfaces/Transition'
import Immediate from './transition/immediate'
import LoaderAddParam from  '../interfaces/PixiTypePolyfill/LoaderAddParam'
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
	* リソースリストを作成して返却する
	*/
	protected createInitialResourceList(): (LoaderAddParam | string)[] {
		return [];
	}

	/**
	* リソースダウンロードのフローを実行する
	*/
	public beginLoadResource(onLoaded: () => void):Promise<void> {
		return new Promise((resolve) => {
			this.loadInitialResource(() => resolve());
		}).then(() => {
			onLoaded();
		}).then(() => {
			this.onResourceLoaded();
		})
	}

	/**
	* 最初に指定されたリソースをダウンロードする
	*/
	protected loadInitialResource(onLoaded: () => void):void {
		const assets = this.createInitialResourceList();
		const filteredAssets = this.filterLoadedAssets(assets);

		if(filteredAssets.length > 0) {
			PIXI.loader.add(filteredAssets).load(() => onLoaded());
		} else {
			onLoaded();
		}
	}

	/**
	* beginLoadResource 完了時のコールバックメソッド
	*/
	protected onResourceLoaded(): void {
	}

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

	/**
	* 更新処理を行うべきオブジェクトとして渡されたオブジェクトを登録する
	*/
	protected registerUpdatingObject(object: UpdateObject): void {
		this.objectsToUpdate.push(object);
	}

	/**
	* 更新処理を行うべきオブジェクトを更新する
	*/
	protected updateRegisteredObjects(delta: number):void {
		const nextObjectsToUpdate = [];

		for (let i = 0; i < this.objectsToUpdate.length; i++) {
			const obj = this.objectsToUpdate[i];
			if(!obj || obj.isDestroyed()) {
				continue;
			}
			obj.update(delta);
			nextObjectsToUpdate.push(obj);
		}

		this.objectsToUpdate = nextObjectsToUpdate;
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

		this.transitionIn.begin();
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

	/**
	* 渡されたアセットのリストからロード済みのものをフィルタリングする
	*/
	private filterLoadedAssets(assets: (LoaderAddParam | string)[]): LoaderAddParam[] {
		const assetMap = new Map<string, LoaderAddParam>();

		for (let i = 0; i < assets.length; i++) {
			const asset = assets[i];
			if (typeof asset === 'string') {
				if (!PIXI.loader.resources[asset] && !assetMap.has(asset)) {
					assetMap.set(asset, {name:asset, url: asset});
				}
			} else {
				if (!PIXI.loader.resources[asset.name] && !assetMap.has(asset.name)) {
					assetMap.set(asset.name, asset);
				}
			}
		}

		return Array.from(assetMap.values());
	}

}