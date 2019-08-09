import Game from "./logic/Game";
import { GameConfig } from "./logic/GameConfig";
import Core from "./core/Core";

/**
 * 项目入口
 */
export default class App {

    /** 场景 */
    private scene: BABYLON.Scene;
    /** 3d引擎 */
    private engine: BABYLON.Engine;
    /** 相机 */
    private camera: BABYLON.ArcRotateCamera;

    private box: BABYLON.Mesh;

    constructor() {

        Core.init();//初始化核心库

        this.scene = this.createScene();
        new Game;
     
        console.log(Game.name)

        //  渲染
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })

        // Watch for browser/canvas resize events
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.addLight();
        // this.addBox();


        BABYLON.SceneLoader.Append('./res/', 'majiangjiang.glb', this.scene, (container) => {
            console.log(container);
            this.scene.activeCamera = container.cameras[1];
            let desk = this.scene.getNodeByName('desk') as BABYLON.Mesh;

            let a = desk.material as BABYLON.PBRMaterial;

            a.specularIntensity = 1;//镜面

        })
    }

    /**
     * 添加物体
     */
    private addBox() {
        this.box = BABYLON.MeshBuilder.CreateBox('box', {}, this.scene);
    }

    /**
     * 添加灯光
     */
    private addLight() {
        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -2), this.scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        // console.log(light)
    }

    /**
     * 创建场景 添加相机 等 
     */
    private createScene(): BABYLON.Scene {
        let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
        this.engine = new BABYLON.Engine(canvas, true) as BABYLON.Engine; // Generate the BABYLON 3D engine
        // Create the scene space
        let scene = new BABYLON.Scene(this.engine);

        // Add a camera to the scene and attach it to the canvas
        this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 1, 3), scene);
        this.camera.attachControl(canvas, true, true);//设置相机是否可移动
        // console.log(this.camera)

        return scene;

    }
}
