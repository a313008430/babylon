/** 
 * 游戏基类
 */
export default class GameBaseObject {
    /** 名称 */
    name: string;
    /** 组件列表 */
    private components: any[];

    constructor(entity, name: string) {
        this.name = name;
        this.components = [];
    }

    /**
     * 添加组件绑定
     */
    addComponent(ComponentType, ...args) {
        const component = new ComponentType(this, ...args);
        this.components.push(component);
        return component;
    }

    /**
     * 稳定组件
     */
    removeComponent(component) {
        const ndx = this.components.indexOf(component);
        if (ndx >= 0) {
            this.components.splice(ndx, 1);
        }
    }

    getComponent(ComponentType) {
        return this.components.find(c => c instanceof ComponentType);
    }
    
    update(){

    }
}