/**
 * 项目入口
 */
export default class App {

    /** 场景 */
    private scene: BABYLON.Scene;
    /** 3d引擎 */
    private engine: BABYLON.Engine;
    /** 相机 */
    private camera:BABYLON.ArcRotateCamera;

    constructor() {
        this.scene = this.createScene();

        //  渲染
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })

        // Watch for browser/canvas resize events
        window.addEventListener("resize", ()=>{
            this.engine.resize();
        });

        this.addLight();
        this.addBox();
    
    }

    /**
     * 添加物体
     */
    private addBox(){
        BABYLON.MeshBuilder.CreateBox('box', {}, this.scene);
    }

    /**
     * 添加灯光
     */
    private addLight(){
        new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this.scene);
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
        this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 1, 5), scene);
        this.camera.attachControl(canvas, true);

        return scene;

    }
}