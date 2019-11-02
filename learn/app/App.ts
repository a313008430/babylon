import Game from "./logic/Game";
import EntranceView from "./logic/view/EntranceView";
import Core from "./core/Core";
/**
 * 项目入口
 */
export default class App {

    constructor() {
        Core.init();
        Game.engineInit();

        new EntranceView();

        // BABYLON.SceneLoader.Append('./res/', 'majiangjiang.glb', Game.scene, (container) => {
        //     // console.log(container);
        //     Game.scene.activeCamera = container.cameras[1];
        //     let desk = Game.scene.getNodeByName('desk') as BABYLON.Mesh;

        //     let a = desk.material as BABYLON.PBRMaterial;

        //     a.specularIntensity = 1;//镜面

        // })


    }

    /**
     * 添加物体
     */
    private addBox() {
        BABYLON.MeshBuilder.CreateBox('box', {}, Game.scene);
    }



}
