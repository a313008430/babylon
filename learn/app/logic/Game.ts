import Core from "../core/Core";
import EventMap from "../core/EventMap";

/**
 * 游戏逻辑
 */
export default class Game {

    /** 设计尺寸 宽 */
    static designWidth: number = 1334;
    /** 设计尺寸 高 */
    static designHeight: number = 750;
    /** 相对设计尺寸缩放比例 */
    static scaleRatio: number = 1;
    /** 场景 */
    static scene: BABYLON.Scene;
    /** 3d引擎 */
    static engine: BABYLON.Engine;
    /** 相机 */
    static camera: BABYLON.ArcRotateCamera;
    /** 全屏GUI */
    static gui: BABYLON.GUI.AdvancedDynamicTexture;
    /** 全屏节点根容器 全屏GUI上面的节点全是它上面的子节点 */
    static rootBox: BABYLON.GUI.Rectangle;

    /**
     * 初始化游戏引擎
     */
    static engineInit() {
        this.scene = this.createScene();
        this.createFullGui();
        this.addLight();
        this.renderLoop();





        var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
        window.addEventListener(resizeEvt, () => this.refreshRem(), false);
        document.addEventListener('DOMContentLoaded', () => this.refreshRem(), false);
    }


    /**
     * 创建全屏GUI容器
     */
    private static createFullGui() {
        let gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
        this.gui = gui;
        gui.renderAtIdealSize = true;//自适应缩放
        gui.useSmallestIdeal = true;
        this.createFullBox();
        this.refreshRem();
    }

    /**
     * 创建全屏节点容器根节点
     */
    private static createFullBox() {
        let box = new BABYLON.GUI.Rectangle();
        box.width = 1;
        box.height = '750px';
        box.clipChildren = false;
        box.clipContent = false;
        box.thickness = 0;
        this.gui.addControl(box);
        this.rootBox = box;
    }

    /**
     * 添加灯光
     */
    private static addLight() {
        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -2), Game.scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
    }

    /**
     * 监听浏览器尺寸变化做对应适配
     */
    private static refreshRem() {
        var doc = document;
        var win = window;
        var docEl = doc.documentElement;
        var clientWidth;
        var clientHeight;
        var loadBox = doc.querySelector('#box') as HTMLElement;

        clientWidth = win.innerWidth ||
            doc.documentElement.clientWidth ||
            doc.body.clientWidth;
        clientHeight = win.innerHeight ||
            doc.documentElement.clientHeight ||
            doc.body.clientHeight;
        if (!clientWidth) return;
        var width = clientWidth;
        var height = clientHeight;
        var fz;

        if (clientWidth < clientHeight) {
            loadBox.style.transform = 'rotateZ(90deg)';
            loadBox.style.width = clientHeight + 'px';
            loadBox.style.height = clientWidth + 'px';
            loadBox.style.marginLeft = clientWidth + 'px';
            fz = 100 * height / this.designWidth;

            if (this.gui) {
                this.gui.idealWidth = clientHeight;
                this.gui.idealHeight = clientWidth;
            }

            this.scaleRatio = clientWidth / this.designHeight;
        } else {
            loadBox.style.transform = 'rotateZ(0deg)';
            loadBox.style.width = clientWidth + 'px';
            loadBox.style.height = clientHeight + 'px';
            loadBox.style.marginLeft = 0 + 'px';
            fz = 100 * width / this.designWidth;

            if (this.gui) {
                this.gui.idealWidth = clientWidth;
                this.gui.idealHeight = clientHeight;
            }
            this.scaleRatio = clientHeight / this.designHeight;
        }

        docEl.style.fontSize = fz + 'px';

        //目前的设计逻辑是宽适配，高比例缩小，宽自动放大放小
        this.rootBox.scaleX = this.scaleRatio;
        this.rootBox.scaleY = this.scaleRatio;
        this.rootBox.width = 1 / this.scaleRatio;

        Core.event.event(EventMap.RESIZE, this.scaleRatio);

        this.engine.resize();
    }

    /**
     * 渲染
     */
    private static renderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
    }

    /**
     * 创建场景 添加相机 等 
     */
    private static createScene() {
        let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
        this.engine = new BABYLON.Engine(canvas, true) as BABYLON.Engine; // Generate the BABYLON 3D engine
        // // Create the scene space
        let scene = new BABYLON.Scene(this.engine);

        // Add a camera to the scene and attach it to the canvas
        this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 1, 3), scene);
        this.camera.attachControl(canvas, true, true);//设置相机是否可移动

        return scene;

    }
}

