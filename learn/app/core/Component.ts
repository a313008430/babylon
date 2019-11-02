import SafeArray from "./SafeArray";

/**
 * 组件基类
 */
export default class Component {

    /**  组件列表 */
    protected components: Set<any>;

    constructor() {
        this.components = new Set();
    }

    /**
     * 添加组件
     * @param component {T} 组件
     * TODO 传进来的组件要是未实例的类，这个引擎自带的组件不是特别适合，在构造函数里面要不能有值
     */
    addComponent<T>(component: { new(): T }) {
        // console.log(component)
        // if (this.components.has(component)) {
        //     console.warn('has component')
        //     return null;
        // }
        // this.components.add(component);
        // return component;
    }

    /**
     * 获取组件
     */
    // getComponent<T>(component: T){
    //     console.log(this.components)
    //     console.log(component)
    // }

    /**
     * 删除组件
     * @param component 组件
     */
    removeComponent<T>(component: T) {
        this.components.delete(component);
    }

    /**
     * 销毁
     */
    protected onDestroy() {
        this.components.clear();
        this.destroy();
    }

    /**
     * 触发销毁
     */
    destroy() {

    }
}