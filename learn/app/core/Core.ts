import Component from "./Component";
import GameObjectManager from "./GameObjectManager";
import EventDispatcher from "./EventDispatcher";
import Node from "./Node";
/**
 * 核心模块入口
 */
export default class Core {
    /** 组件 */
    static component = Component;
    /** 游戏类管理 */
    static gameManage: GameObjectManager;
    /** 事件中介 */
    static event: EventDispatcher;
    /** 创建Node节点 */
    static get node() {
        return Node;
    }

    static init() {
        this.gameManage = new GameObjectManager();
        this.event = new EventDispatcher();
    }
}
