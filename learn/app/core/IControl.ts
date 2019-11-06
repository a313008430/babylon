/**
 * 脚本组件基类
 */
export default class IControl extends BABYLON.GUI.Container {
    constructor(name?: string | undefined) {
        super(name);

        console.log(this)
    }
}