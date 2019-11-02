import Component from "./Component";

interface tComponent extends Component{

}

export default class BImage extends BABYLON.GUI.Image implements tComponent{
    constructor(){
        super();
    }
    protected components: Set<any>;    addComponent<T>(component: new () => T): void {
        throw new Error("Method not implemented.");
    }
    removeComponent<T>(component: T): void {
        throw new Error("Method not implemented.");
    }
    protected onDestroy(): void {
        throw new Error("Method not implemented.");
    }
    destroy(): void {
        throw new Error("Method not implemented.");
    }


}