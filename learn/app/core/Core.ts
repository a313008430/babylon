import Component from "./Component";
import GameObjectManager from "./GameObjectManager";
import EventDispatcher from "./EventDispatcher";

/**
 * 核心模块入口
 */
export default class Core {
    /** 组件 */
    static component = Component;
    /** 游戏类管理 */
    static gameManage:GameObjectManager;
    /** 事件中介 */
    static evet:EventDispatcher;

    static init() {
        this.gameManage = new GameObjectManager();
        this.evet = new EventDispatcher();
    }
}
