import * as PIXI from 'pixi.js';
import Immediate from './transition/immediate';
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
        this.transitionIn = new Immediate();
        /**
        *	シーン終了用のトランジションオブジェクト
        */
        this.transitionOut = new Immediate();
    }
    /**
    * リソースリストを作成して返却する
    */
    createInitialResourceList() {
        return [];
    }
    /**
    * リソースダウンロードのフローを実行する
    */
    beginLoadResource(onLoaded) {
        return new Promise((resolve) => {
            this.loadInitialResource(() => resolve());
        }).then(() => {
            onLoaded();
        }).then(() => {
            this.onResourceLoaded();
        });
    }
    /**
    * 最初に指定されたリソースをダウンロードする
    */
    loadInitialResource(onLoaded) {
        const assets = this.createInitialResourceList();
        const filteredAssets = this.filterLoadedAssets(assets);
        if (filteredAssets.length > 0) {
            PIXI.loader.add(filteredAssets).load(() => onLoaded());
        }
        else {
            onLoaded();
        }
    }
    /**
    * beginLoadResource 完了時のコールバックメソッド
    */
    onResourceLoaded() {
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
    /**
    * 更新処理を行うべきオブジェクトとして渡されたオブジェクトを登録する
    */
    registerUpdatingObject(object) {
        this.objectsToUpdate.push(object);
    }
    /**
    * 更新処理を行うべきオブジェクトを更新する
    */
    updateRegisteredObjects(delta) {
        const nextObjectsToUpdate = [];
        for (let i = 0; i < this.objectsToUpdate.length; i++) {
            const obj = this.objectsToUpdate[i];
            if (!obj || obj.isDestroyed()) {
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
    beginTransitionIn(onTransitionFinished) {
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
    beginTransitionOut(onTransitionFinished) {
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
    filterLoadedAssets(assets) {
        const assetMap = new Map();
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            if (typeof asset === 'string') {
                if (!PIXI.loader.resources[asset] && !assetMap.has(asset)) {
                    assetMap.set(asset, { name: asset, url: asset });
                }
            }
            else {
                if (!PIXI.loader.resources[asset.name] && !assetMap.has(asset.name)) {
                    assetMap.set(asset.name, asset);
                }
            }
        }
        return Array.from(assetMap.values());
    }
}
