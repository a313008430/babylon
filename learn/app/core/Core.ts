import Component from "./Component";
import GameObjectManager from "./GameObjectManager";

/**
 * 核心模块入口
 */
export default class Core {
    /** 组件 */
    static component = Component;
    /** 游戏类管理 */
    static gameManage:GameObjectManager;

    static init() {
        this.gameManage = new GameObjectManager();
    }
}
