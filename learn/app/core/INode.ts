export default class INode extends BABYLON.GUI.Container {
    /**  */
    constructor() {
        super();

        // 容器适应其子代的大小：
        this.adaptHeightToChildren = true;
        this.adaptWidthToChildren = true;
    }

    // addControl(){

    // }
}