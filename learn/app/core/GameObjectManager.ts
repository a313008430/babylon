import SafeArray from "./SafeArray";
import GameBaseObject from "./GameBaseObject";

/**
 * 游戏对象管理器
 * 只初始一次
 */
export default class GameObjectManager {

    /** 所有游戏类列表 */
    private gameObjects: SafeArray;

    constructor() {
        this.gameObjects = new SafeArray();
    }

    /** 
     * 创建注册游戏<实体>对象
     * @param entity 需要绑定的实体对象
     * @param name 实体名称
     * @description 注册实体对象到GameObjectManager中，以方便绑定脚本组件
     */
    createGameObject<T>(entity:T, name:string): GameBaseObject {
        const gameObj = new GameBaseObject(entity, name);
        this.gameObjects.add(gameObj)
        return gameObj;
    }

    /**
     * 删除注销游戏对象
     */
    removeGameObject(gameObject) {
        this.gameObjects.remove(gameObject);
    }
}