(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Game = factory());
}(this, function () { 'use strict';

    /**
     * 组件基类
     */
    class Component extends BABYLON.GUI.Container {
        constructor() {
            super();
            this.components = new Set();
        }
        /**
         * 添加组件
         * @param component {T} 组件
         * TODO 传进来的组件要是未实例的类，这个引擎自带的组件不是特别适合，在构造函数里面要不能有值
         */
        addComponent(component) {
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
        removeComponent(component) {
            this.components.delete(component);
        }
        /**
         * 销毁
         */
        onDestroy() {
            this.components.clear();
            this.destroy();
        }
        /**
         * 触发销毁
         */
        destroy() {
        }
    }
    //# sourceMappingURL=Component.js.map

    /**
     * 数组管理
     */
    class SafeArray {
        constructor() {
            this.array = [];
            this.addQueue = [];
            this.removeQueue = new Set();
        }
        /** 缓存数组是否为空 */
        get isEmpty() {
            return this.addQueue.length + this.array.length > 0;
        }
        add(element) {
            this.addQueue.push(element);
        }
        remove(element) {
            this.removeQueue.add(element);
        }
        forEach(fn) {
            this.addQueued();
            this.removeQueued();
            for (const element of this.array) {
                if (this.removeQueue.has(element)) {
                    continue;
                }
                fn(element);
            }
        }
        addQueued() {
            if (this.addQueue.length) {
                this.array.splice(this.array.length, 0, ...this.addQueue);
            }
        }
        removeQueued() {
            if (this.removeQueue.size) {
                this.array = this.array.filter(element => !this.removeQueue.has(element));
                this.removeQueue.clear();
            }
        }
    }
    //# sourceMappingURL=SafeArray.js.map

    /**
     * 游戏基类
     */
    class GameBaseObject {
        constructor(entity, name) {
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
        update() {
        }
    }
    //# sourceMappingURL=GameBaseObject.js.map

    /**
     * 游戏对象管理器
     * 只初始一次
     */
    class GameObjectManager {
        constructor() {
            this.gameObjects = new SafeArray();
        }
        /**
         * 创建注册游戏<实体>对象
         * @param entity 需要绑定的实体对象
         * @param name 实体名称
         * @description 注册实体对象到GameObjectManager中，以方便绑定脚本组件
         */
        createGameObject(entity, name) {
            const gameObj = new GameBaseObject(entity, name);
            this.gameObjects.add(gameObj);
            return gameObj;
        }
        /**
         * 删除注销游戏对象
         */
        removeGameObject(gameObject) {
            this.gameObjects.remove(gameObject);
        }
    }
    //# sourceMappingURL=GameObjectManager.js.map

    /**
     * 事件分发 事件中介
     */
    class EventDispatcher {
        constructor() {
            /** 已经绑定事件列表 */
            this.list = {};
        }
        /**
         * 派发事件
         * @param type 事件类型
         * @param (可选) 回调数据
         */
        event(type, data) {
            let list = this.list[type];
            if (list) {
                for (let x = list.length - 1; x > -1; x--) {
                    list[x]['listener'].call(list[x]['caller'], data);
                }
            }
        }
        /**
         * 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知
         * @param type type 事件类型
         * @param caller	事件侦听函数的执行域。
         * @param listener 事件侦听函数
         */
        on(type, caller, listener) {
            if (!this.list[type]) { //检测是否已经绑定过事件
                this.list[type] = [];
            }
            for (let x = 0; x < this.list[type].length; x++) {
                if (this.list[type][x].listener === listener) {
                    console.error('事件冲突');
                    return;
                }
            }
            //保证方法的唯一性
            // console.error('事件容错处理')
            let keys = Object.keys(caller.__proto__);
            for (let x = keys.length - 1; x > -1; x--) {
                if (caller[keys[x]] === listener) {
                    listener = caller[keys[x]] = caller[keys[x]].bind(caller);
                    break;
                }
            }
            this.list[type].push({ caller: caller, listener: listener });
        }
        /**
         * 对象移除指定类型的事件侦听器对象，
         * @param type
         * @param caller	事件侦听函数的执行域。
         * @param listener
         */
        off(type, caller, listener) {
            let list = this.list[type];
            if (list) {
                for (let x = list.length - 1; x > -1; x--) {
                    if (list[x]['listener'] === listener) {
                        list[x]['listener'] = null;
                        list.splice(x, 1);
                    }
                }
            }
        }
    }
    //# sourceMappingURL=EventDispatcher.js.map

    class BImage {
    }

    class Node extends Component {
        /**  */
        constructor() {
            super();
            // 容器适应其子代的大小：
            this.adaptHeightToChildren = true;
            this.adaptWidthToChildren = true;
            console.log(BImage);
        }
        /**
         * 创建图片节点
         */
        createImage(name, url) {
            let img = new BABYLON.GUI.Image(name, url);
            this.name = name;
            // img.stretch = BABYLON.GUI.Image.STRETCH_NONE;//缩放容器以适应图像大小。
            this.addControl(img);
            return new Promise((resolve) => {
                img.onImageLoadedObservable.addOnce(() => {
                    img.width = img.domImage.width + 'px';
                    img.height = img.domImage.height + 'px';
                    resolve(this);
                });
            });
        }
        static createImage(name, url) {
            let node = new Node();
            return node.createImage(name, url);
        }
    }

    /**
     * 核心模块入口
     */
    class Core {
        /** 创建Node节点 */
        static get node() {
            return Node;
        }
        static init() {
            this.gameManage = new GameObjectManager();
            this.event = new EventDispatcher();
        }
    }
    /** 组件 */
    Core.component = Component;
    //# sourceMappingURL=Core.js.map

    var EventMap = {
        /** 浏览器尺寸变化事件 */
        RESIZE: 'resize',
    };
    //# sourceMappingURL=EventMap.js.map

    /**
     * 游戏逻辑
     */
    class Game {
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
        static createFullGui() {
            let gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
            this.gui = gui;
            gui.renderAtIdealSize = true; //自适应缩放
            gui.useSmallestIdeal = true;
            this.createFullBox();
            this.refreshRem();
        }
        /**
         * 创建全屏节点容器根节点
         */
        static createFullBox() {
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
        static addLight() {
            let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -2), Game.scene);
            light.diffuse = new BABYLON.Color3(1, 1, 1);
        }
        /**
         * 监听浏览器尺寸变化做对应适配
         */
        static refreshRem() {
            var doc = document;
            var win = window;
            var docEl = doc.documentElement;
            var clientWidth;
            var clientHeight;
            var loadBox = doc.querySelector('#box');
            clientWidth = win.innerWidth ||
                doc.documentElement.clientWidth ||
                doc.body.clientWidth;
            clientHeight = win.innerHeight ||
                doc.documentElement.clientHeight ||
                doc.body.clientHeight;
            if (!clientWidth)
                return;
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
            }
            else {
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
        static renderLoop() {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }
        /**
         * 创建场景 添加相机 等
         */
        static createScene() {
            let canvas = document.getElementById("renderCanvas"); // Get the canvas element 
            this.engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
            // // Create the scene space
            let scene = new BABYLON.Scene(this.engine);
            // Add a camera to the scene and attach it to the canvas
            this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 1, 3), scene);
            this.camera.attachControl(canvas, true, true); //设置相机是否可移动
            return scene;
        }
    }
    /** 设计尺寸 宽 */
    Game.designWidth = 1334;
    /** 设计尺寸 高 */
    Game.designHeight = 750;
    /** 相对设计尺寸缩放比例 */
    Game.scaleRatio = 1;
    //# sourceMappingURL=Game.js.map

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class EntranceView {
        constructor() {
            this.init();
        }
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                let node = yield Core.node.createImage('background', './res/fangjian028.png');
                Game.rootBox.addControl(node);
                // node = await Core.node.createImage('icon', './res/fish03.png');
                let img = new BABYLON.GUI.Image('icon', './res/fish03.png');
                // img.stretch = BABYLON.GUI.Image.STRETCH_NONE;//缩放容器以适应图像大小。
                img.onImageLoadedObservable.addOnce(() => {
                    img.width = img.domImage.width + 'px';
                    img.height = img.domImage.height + 'px';
                });
                node.addControl(img);
                // console.log(node.('icon'))
            });
        }
    }
    //# sourceMappingURL=EntranceView.js.map

    /**
     * 项目入口
     */
    class App {
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
        addBox() {
            BABYLON.MeshBuilder.CreateBox('box', {}, Game.scene);
        }
    }
    //# sourceMappingURL=App.js.map

    return App;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2FwcC9jb3JlL0NvbXBvbmVudC50cyIsIi4uL2FwcC9jb3JlL1NhZmVBcnJheS50cyIsIi4uL2FwcC9jb3JlL0dhbWVCYXNlT2JqZWN0LnRzIiwiLi4vYXBwL2NvcmUvR2FtZU9iamVjdE1hbmFnZXIudHMiLCIuLi9hcHAvY29yZS9FdmVudERpc3BhdGNoZXIudHMiLCIuLi9hcHAvY29yZS9JbWFnZS50cyIsIi4uL2FwcC9jb3JlL05vZGUudHMiLCIuLi9hcHAvY29yZS9Db3JlLnRzIiwiLi4vYXBwL2NvcmUvRXZlbnRNYXAudHMiLCIuLi9hcHAvbG9naWMvR2FtZS50cyIsIi4uL2FwcC9sb2dpYy92aWV3L0VudHJhbmNlVmlldy50cyIsIi4uL2FwcC9BcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNhZmVBcnJheSBmcm9tIFwiLi9TYWZlQXJyYXlcIjtcclxuXHJcbi8qKlxyXG4gKiDnu4Tku7bln7rnsbtcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIEJBQllMT04uR1VJLkNvbnRhaW5lciB7XHJcblxyXG4gICAgLyoqICDnu4Tku7bliJfooaggKi9cclxuICAgIHByb3RlY3RlZCBjb21wb25lbnRzOiBTZXQ8YW55PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IG5ldyBTZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOe7hOS7tlxyXG4gICAgICogQHBhcmFtIGNvbXBvbmVudCB7VH0g57uE5Lu2XHJcbiAgICAgKiBUT0RPIOS8oOi/m+adpeeahOe7hOS7tuimgeaYr+acquWunuS+i+eahOexu++8jOi/meS4quW8leaTjuiHquW4pueahOe7hOS7tuS4jeaYr+eJueWIq+mAguWQiO+8jOWcqOaehOmAoOWHveaVsOmHjOmdouimgeS4jeiDveacieWAvFxyXG4gICAgICovXHJcbiAgICBhZGRDb21wb25lbnQ8VD4oY29tcG9uZW50OiB7IG5ldygpOiBUIH0pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjb21wb25lbnQpXHJcbiAgICAgICAgLy8gaWYgKHRoaXMuY29tcG9uZW50cy5oYXMoY29tcG9uZW50KSkge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLndhcm4oJ2hhcyBjb21wb25lbnQnKVxyXG4gICAgICAgIC8vICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy5jb21wb25lbnRzLmFkZChjb21wb25lbnQpO1xyXG4gICAgICAgIC8vIHJldHVybiBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgLy8gZ2V0Q29tcG9uZW50PFQ+KGNvbXBvbmVudDogVCl7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2codGhpcy5jb21wb25lbnRzKVxyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGNvbXBvbmVudClcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIoOmZpOe7hOS7tlxyXG4gICAgICogQHBhcmFtIGNvbXBvbmVudCDnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlQ29tcG9uZW50PFQ+KGNvbXBvbmVudDogVCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5kZWxldGUoY29tcG9uZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgb25EZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R6ZSA5q+BXHJcbiAgICAgKi9cclxuICAgIGRlc3Ryb3koKSB7XHJcblxyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOaVsOe7hOeuoeeQhlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2FmZUFycmF5IHtcclxuICAgIC8qKiDlr7nosaHliJfooaggKi9cclxuICAgIHByaXZhdGUgYXJyYXk6IGFueVtdO1xyXG4gICAgLyoqIOa3u+WKoOeahOWvueixoeWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBhZGRRdWV1ZTogYW55W107XHJcbiAgICAvKiog57yT5a2Y5Li05pe25Yig6Zmk55qE5pWw5o2u5YiX6KGoICovXHJcbiAgICBwcml2YXRlIHJlbW92ZVF1ZXVlOiBTZXQ8YW55PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmFycmF5ID0gW107XHJcbiAgICAgICAgdGhpcy5hZGRRdWV1ZSA9IFtdO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlUXVldWUgPSBuZXcgU2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIOe8k+WtmOaVsOe7hOaYr+WQpuS4uuepuiAqL1xyXG4gICAgZ2V0IGlzRW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkUXVldWUubGVuZ3RoICsgdGhpcy5hcnJheS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZDxUPihlbGVtZW50OlQpIHtcclxuICAgICAgICB0aGlzLmFkZFF1ZXVlLnB1c2goZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZVF1ZXVlLmFkZChlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JFYWNoKGZuOiBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMuYWRkUXVldWVkKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVRdWV1ZWQoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5hcnJheSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW1vdmVRdWV1ZS5oYXMoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZuKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFF1ZXVlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5hZGRRdWV1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5hcnJheS5zcGxpY2UodGhpcy5hcnJheS5sZW5ndGgsIDAsIC4uLnRoaXMuYWRkUXVldWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZVF1ZXVlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW1vdmVRdWV1ZS5zaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXkgPSB0aGlzLmFycmF5LmZpbHRlcihlbGVtZW50ID0+ICF0aGlzLnJlbW92ZVF1ZXVlLmhhcyhlbGVtZW50KSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUXVldWUuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiogXHJcbiAqIOa4uOaIj+Wfuuexu1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUJhc2VPYmplY3Qge1xyXG4gICAgLyoqIOWQjeensCAqL1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqIOe7hOS7tuWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBjb21wb25lbnRzOiBhbnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbnRpdHksIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDnu4Tku7bnu5HlrppcclxuICAgICAqL1xyXG4gICAgYWRkQ29tcG9uZW50KENvbXBvbmVudFR5cGUsIC4uLmFyZ3MpIHtcclxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50VHlwZSh0aGlzLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMucHVzaChjb21wb25lbnQpO1xyXG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnqLPlrprnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGNvbnN0IG5keCA9IHRoaXMuY29tcG9uZW50cy5pbmRleE9mKGNvbXBvbmVudCk7XHJcbiAgICAgICAgaWYgKG5keCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cy5zcGxpY2UobmR4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29tcG9uZW50KENvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzLmZpbmQoYyA9PiBjIGluc3RhbmNlb2YgQ29tcG9uZW50VHlwZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHVwZGF0ZSgpe1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCBTYWZlQXJyYXkgZnJvbSBcIi4vU2FmZUFycmF5XCI7XHJcbmltcG9ydCBHYW1lQmFzZU9iamVjdCBmcm9tIFwiLi9HYW1lQmFzZU9iamVjdFwiO1xyXG5cclxuLyoqXHJcbiAqIOa4uOaIj+WvueixoeeuoeeQhuWZqFxyXG4gKiDlj6rliJ3lp4vkuIDmrKFcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVPYmplY3RNYW5hZ2VyIHtcclxuXHJcbiAgICAvKiog5omA5pyJ5ri45oiP57G75YiX6KGoICovXHJcbiAgICBwcml2YXRlIGdhbWVPYmplY3RzOiBTYWZlQXJyYXk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cyA9IG5ldyBTYWZlQXJyYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiDliJvlu7rms6jlhozmuLjmiI885a6e5L2TPuWvueixoVxyXG4gICAgICogQHBhcmFtIGVudGl0eSDpnIDopoHnu5HlrprnmoTlrp7kvZPlr7nosaFcclxuICAgICAqIEBwYXJhbSBuYW1lIOWunuS9k+WQjeensFxyXG4gICAgICogQGRlc2NyaXB0aW9uIOazqOWGjOWunuS9k+WvueixoeWIsEdhbWVPYmplY3RNYW5hZ2Vy5Lit77yM5Lul5pa55L6/57uR5a6a6ISa5pys57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUdhbWVPYmplY3Q8VD4oZW50aXR5OlQsIG5hbWU6c3RyaW5nKTogR2FtZUJhc2VPYmplY3Qge1xyXG4gICAgICAgIGNvbnN0IGdhbWVPYmogPSBuZXcgR2FtZUJhc2VPYmplY3QoZW50aXR5LCBuYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzLmFkZChnYW1lT2JqKVxyXG4gICAgICAgIHJldHVybiBnYW1lT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yig6Zmk5rOo6ZSA5ri45oiP5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUdhbWVPYmplY3QoZ2FtZU9iamVjdCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMucmVtb3ZlKGdhbWVPYmplY3QpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOS6i+S7tuWIhuWPkSDkuovku7bkuK3ku4tcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RGlzcGF0Y2hlciB7XHJcblxyXG4gICAgLyoqIOW3sue7j+e7keWumuS6i+S7tuWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBsaXN0OiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOa0vuWPkeS6i+S7tlxyXG4gICAgICogQHBhcmFtIHR5cGUg5LqL5Lu257G75Z6LXHJcbiAgICAgKiBAcGFyYW0gKOWPr+mAiSkg5Zue6LCD5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIGV2ZW50KHR5cGU6IHN0cmluZywgZGF0YT86IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBsaXN0OiBhbnlbXSA9IHRoaXMubGlzdFt0eXBlXTtcclxuICAgICAgICBpZiAobGlzdCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gbGlzdC5sZW5ndGggLSAxOyB4ID4gLTE7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdFt4XVsnbGlzdGVuZXInXS5jYWxsKGxpc3RbeF1bJ2NhbGxlciddLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWvueixoeazqOWGjOaMh+Wumuexu+Wei+eahOS6i+S7tuS+puWQrOWZqOWvueixoe+8jOS7peS9v+S+puWQrOWZqOiDveWkn+aOpeaUtuS6i+S7tumAmuefpVxyXG4gICAgICogQHBhcmFtIHR5cGUgdHlwZSDkuovku7bnsbvlnotcclxuICAgICAqIEBwYXJhbSBjYWxsZXJcdOS6i+S7tuS+puWQrOWHveaVsOeahOaJp+ihjOWfn+OAglxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOS6i+S7tuS+puWQrOWHveaVsFxyXG4gICAgICovXHJcbiAgICBvbih0eXBlOiBzdHJpbmcsIGNhbGxlcjogYW55LCBsaXN0ZW5lcjogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMubGlzdFt0eXBlXSkgey8v5qOA5rWL5piv5ZCm5bey57uP57uR5a6a6L+H5LqL5Lu2XHJcbiAgICAgICAgICAgIHRoaXMubGlzdFt0eXBlXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmxpc3RbdHlwZV0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGlzdFt0eXBlXVt4XS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+S6i+S7tuWGsueqgScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+S/neivgeaWueazleeahOWUr+S4gOaAp1xyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ+S6i+S7tuWuuemUmeWkhOeQhicpXHJcbiAgICAgICAgbGV0IGtleXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoY2FsbGVyLl9fcHJvdG9fXyk7XHJcbiAgICAgICAgZm9yIChsZXQgeCA9IGtleXMubGVuZ3RoIC0gMTsgeCA+IC0xOyB4LS0pIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxlcltrZXlzW3hdXSA9PT0gbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gY2FsbGVyW2tleXNbeF1dID0gY2FsbGVyW2tleXNbeF1dLmJpbmQoY2FsbGVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxpc3RbdHlwZV0ucHVzaCh7IGNhbGxlcjogY2FsbGVyLCBsaXN0ZW5lcjogbGlzdGVuZXIgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlr7nosaHnp7vpmaTmjIflrprnsbvlnovnmoTkuovku7bkvqblkKzlmajlr7nosaHvvIxcclxuICAgICAqIEBwYXJhbSB0eXBlIFxyXG4gICAgICogQHBhcmFtIGNhbGxlclx05LqL5Lu25L6m5ZCs5Ye95pWw55qE5omn6KGM5Z+f44CCXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIgXHJcbiAgICAgKi9cclxuICAgIG9mZih0eXBlOiBzdHJpbmcsIGNhbGxlcjogYW55LCBsaXN0ZW5lcjogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBsZXQgbGlzdDogYW55W10gPSB0aGlzLmxpc3RbdHlwZV07XHJcbiAgICAgICAgaWYgKGxpc3QpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IGxpc3QubGVuZ3RoIC0gMTsgeCA+IC0xOyB4LS0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0W3hdWydsaXN0ZW5lciddID09PSBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RbeF1bJ2xpc3RlbmVyJ10gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3Quc3BsaWNlKHgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiLi9Db21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJJbWFnZSB7XHJcblxyXG59IiwiaW1wb3J0IENvbXBvbmVudCBmcm9tIFwiLi9Db21wb25lbnRcIjtcclxuaW1wb3J0IEltYWdlVCBmcm9tIFwiLi9JbWFnZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9kZSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICAvKiogICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyDlrrnlmajpgILlupTlhbblrZDku6PnmoTlpKflsI/vvJpcclxuICAgICAgICB0aGlzLmFkYXB0SGVpZ2h0VG9DaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5hZGFwdFdpZHRoVG9DaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coSW1hZ2VUKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65Zu+54mH6IqC54K5XHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUltYWdlKG5hbWU/OiBzdHJpbmcgfCB1bmRlZmluZWQsIHVybD86IEJBQllMT04uTnVsbGFibGU8c3RyaW5nPik6IFByb21pc2U8Tm9kZT4ge1xyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgQkFCWUxPTi5HVUkuSW1hZ2UobmFtZSwgdXJsKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIC8vIGltZy5zdHJldGNoID0gQkFCWUxPTi5HVUkuSW1hZ2UuU1RSRVRDSF9OT05FOy8v57yp5pS+5a655Zmo5Lul6YCC5bqU5Zu+5YOP5aSn5bCP44CCXHJcbiAgICAgICAgdGhpcy5hZGRDb250cm9sKGltZyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbkltYWdlTG9hZGVkT2JzZXJ2YWJsZS5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGltZy53aWR0aCA9IGltZy5kb21JbWFnZS53aWR0aCArICdweCc7XHJcbiAgICAgICAgICAgICAgICBpbWcuaGVpZ2h0ID0gaW1nLmRvbUltYWdlLmhlaWdodCArICdweCc7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyAgY3JlYXRlSW1hZ2UobmFtZT86IHN0cmluZyB8IHVuZGVmaW5lZCwgdXJsPzogQkFCWUxPTi5OdWxsYWJsZTxzdHJpbmc+KTogUHJvbWlzZTxOb2RlPiB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgTm9kZSgpO1xyXG4gICAgICAgIHJldHVybiBub2RlLmNyZWF0ZUltYWdlKG5hbWUsIHVybCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQ29tcG9uZW50IGZyb20gXCIuL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgR2FtZU9iamVjdE1hbmFnZXIgZnJvbSBcIi4vR2FtZU9iamVjdE1hbmFnZXJcIjtcclxuaW1wb3J0IEV2ZW50RGlzcGF0Y2hlciBmcm9tIFwiLi9FdmVudERpc3BhdGNoZXJcIjtcclxuaW1wb3J0IE5vZGUgZnJvbSBcIi4vTm9kZVwiO1xyXG4vKipcclxuICog5qC45b+D5qih5Z2X5YWl5Y+jXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3JlIHtcclxuICAgIC8qKiDnu4Tku7YgKi9cclxuICAgIHN0YXRpYyBjb21wb25lbnQgPSBDb21wb25lbnQ7XHJcbiAgICAvKiog5ri45oiP57G7566h55CGICovXHJcbiAgICBzdGF0aWMgZ2FtZU1hbmFnZTogR2FtZU9iamVjdE1hbmFnZXI7XHJcbiAgICAvKiog5LqL5Lu25Lit5LuLICovXHJcbiAgICBzdGF0aWMgZXZlbnQ6IEV2ZW50RGlzcGF0Y2hlcjtcclxuICAgIC8qKiDliJvlu7pOb2Rl6IqC54K5ICovXHJcbiAgICBzdGF0aWMgZ2V0IG5vZGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIE5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lTWFuYWdlID0gbmV3IEdhbWVPYmplY3RNYW5hZ2VyKCk7XHJcbiAgICAgICAgdGhpcy5ldmVudCA9IG5ldyBFdmVudERpc3BhdGNoZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAvKiog5rWP6KeI5Zmo5bC65a+45Y+Y5YyW5LqL5Lu2ICovXHJcbiAgICBSRVNJWkU6ICdyZXNpemUnLFxyXG59IiwiaW1wb3J0IENvcmUgZnJvbSBcIi4uL2NvcmUvQ29yZVwiO1xyXG5pbXBvcnQgRXZlbnRNYXAgZnJvbSBcIi4uL2NvcmUvRXZlbnRNYXBcIjtcclxuXHJcbi8qKlxyXG4gKiDmuLjmiI/pgLvovpFcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xyXG5cclxuICAgIC8qKiDorr7orqHlsLrlr7gg5a69ICovXHJcbiAgICBzdGF0aWMgZGVzaWduV2lkdGg6IG51bWJlciA9IDEzMzQ7XHJcbiAgICAvKiog6K6+6K6h5bC65a+4IOmrmCAqL1xyXG4gICAgc3RhdGljIGRlc2lnbkhlaWdodDogbnVtYmVyID0gNzUwO1xyXG4gICAgLyoqIOebuOWvueiuvuiuoeWwuuWvuOe8qeaUvuavlOS+iyAqL1xyXG4gICAgc3RhdGljIHNjYWxlUmF0aW86IG51bWJlciA9IDE7XHJcbiAgICAvKiog5Zy65pmvICovXHJcbiAgICBzdGF0aWMgc2NlbmU6IEJBQllMT04uU2NlbmU7XHJcbiAgICAvKiogM2TlvJXmk44gKi9cclxuICAgIHN0YXRpYyBlbmdpbmU6IEJBQllMT04uRW5naW5lO1xyXG4gICAgLyoqIOebuOacuiAqL1xyXG4gICAgc3RhdGljIGNhbWVyYTogQkFCWUxPTi5BcmNSb3RhdGVDYW1lcmE7XHJcbiAgICAvKiog5YWo5bGPR1VJICovXHJcbiAgICBzdGF0aWMgZ3VpOiBCQUJZTE9OLkdVSS5BZHZhbmNlZER5bmFtaWNUZXh0dXJlO1xyXG4gICAgLyoqIOWFqOWxj+iKgueCueagueWuueWZqCDlhajlsY9HVUnkuIrpnaLnmoToioLngrnlhajmmK/lroPkuIrpnaLnmoTlrZDoioLngrkgKi9cclxuICAgIHN0YXRpYyByb290Qm94OiBCQUJZTE9OLkdVSS5SZWN0YW5nbGU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbmuLjmiI/lvJXmk45cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGVuZ2luZUluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHRoaXMuY3JlYXRlU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUZ1bGxHdWkoKTtcclxuICAgICAgICB0aGlzLmFkZExpZ2h0KCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJMb29wKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICB2YXIgcmVzaXplRXZ0ID0gJ29yaWVudGF0aW9uY2hhbmdlJyBpbiB3aW5kb3cgPyAnb3JpZW50YXRpb25jaGFuZ2UnIDogJ3Jlc2l6ZSc7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIocmVzaXplRXZ0LCAoKSA9PiB0aGlzLnJlZnJlc2hSZW0oKSwgZmFsc2UpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB0aGlzLnJlZnJlc2hSZW0oKSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuWFqOWxj0dVSeWuueWZqFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVGdWxsR3VpKCkge1xyXG4gICAgICAgIGxldCBndWkgPSBCQUJZTE9OLkdVSS5BZHZhbmNlZER5bmFtaWNUZXh0dXJlLkNyZWF0ZUZ1bGxzY3JlZW5VSSgndWknKTtcclxuICAgICAgICB0aGlzLmd1aSA9IGd1aTtcclxuICAgICAgICBndWkucmVuZGVyQXRJZGVhbFNpemUgPSB0cnVlOy8v6Ieq6YCC5bqU57yp5pS+XHJcbiAgICAgICAgZ3VpLnVzZVNtYWxsZXN0SWRlYWwgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRnVsbEJveCgpO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaFJlbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65YWo5bGP6IqC54K55a655Zmo5qC56IqC54K5XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZUZ1bGxCb3goKSB7XHJcbiAgICAgICAgbGV0IGJveCA9IG5ldyBCQUJZTE9OLkdVSS5SZWN0YW5nbGUoKTtcclxuICAgICAgICBib3gud2lkdGggPSAxO1xyXG4gICAgICAgIGJveC5oZWlnaHQgPSAnNzUwcHgnO1xyXG4gICAgICAgIGJveC5jbGlwQ2hpbGRyZW4gPSBmYWxzZTtcclxuICAgICAgICBib3guY2xpcENvbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICBib3gudGhpY2tuZXNzID0gMDtcclxuICAgICAgICB0aGlzLmd1aS5hZGRDb250cm9sKGJveCk7XHJcbiAgICAgICAgdGhpcy5yb290Qm94ID0gYm94O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg54Gv5YWJXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGFkZExpZ2h0KCkge1xyXG4gICAgICAgIGxldCBsaWdodCA9IG5ldyBCQUJZTE9OLkhlbWlzcGhlcmljTGlnaHQoXCJsaWdodDFcIiwgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAtMiksIEdhbWUuc2NlbmUpO1xyXG4gICAgICAgIGxpZ2h0LmRpZmZ1c2UgPSBuZXcgQkFCWUxPTi5Db2xvcjMoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnm5HlkKzmtY/op4jlmajlsLrlr7jlj5jljJblgZrlr7nlupTpgILphY1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVmcmVzaFJlbSgpIHtcclxuICAgICAgICB2YXIgZG9jID0gZG9jdW1lbnQ7XHJcbiAgICAgICAgdmFyIHdpbiA9IHdpbmRvdztcclxuICAgICAgICB2YXIgZG9jRWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICAgIHZhciBjbGllbnRXaWR0aDtcclxuICAgICAgICB2YXIgY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIHZhciBsb2FkQm94ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJyNib3gnKSBhcyBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAgICAgY2xpZW50V2lkdGggPSB3aW4uaW5uZXJXaWR0aCB8fFxyXG4gICAgICAgICAgICBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8XHJcbiAgICAgICAgICAgIGRvYy5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIGNsaWVudEhlaWdodCA9IHdpbi5pbm5lckhlaWdodCB8fFxyXG4gICAgICAgICAgICBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCB8fFxyXG4gICAgICAgICAgICBkb2MuYm9keS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgaWYgKCFjbGllbnRXaWR0aCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IGNsaWVudFdpZHRoO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBjbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgdmFyIGZ6O1xyXG5cclxuICAgICAgICBpZiAoY2xpZW50V2lkdGggPCBjbGllbnRIZWlnaHQpIHtcclxuICAgICAgICAgICAgbG9hZEJveC5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWig5MGRlZyknO1xyXG4gICAgICAgICAgICBsb2FkQm94LnN0eWxlLndpZHRoID0gY2xpZW50SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICAgICAgbG9hZEJveC5zdHlsZS5oZWlnaHQgPSBjbGllbnRXaWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIGxvYWRCb3guc3R5bGUubWFyZ2luTGVmdCA9IGNsaWVudFdpZHRoICsgJ3B4JztcclxuICAgICAgICAgICAgZnogPSAxMDAgKiBoZWlnaHQgLyB0aGlzLmRlc2lnbldpZHRoO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3VpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmd1aS5pZGVhbFdpZHRoID0gY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ndWkuaWRlYWxIZWlnaHQgPSBjbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gY2xpZW50V2lkdGggLyB0aGlzLmRlc2lnbkhlaWdodDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2FkQm94LnN0eWxlLnRyYW5zZm9ybSA9ICdyb3RhdGVaKDBkZWcpJztcclxuICAgICAgICAgICAgbG9hZEJveC5zdHlsZS53aWR0aCA9IGNsaWVudFdpZHRoICsgJ3B4JztcclxuICAgICAgICAgICAgbG9hZEJveC5zdHlsZS5oZWlnaHQgPSBjbGllbnRIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgICAgICBsb2FkQm94LnN0eWxlLm1hcmdpbkxlZnQgPSAwICsgJ3B4JztcclxuICAgICAgICAgICAgZnogPSAxMDAgKiB3aWR0aCAvIHRoaXMuZGVzaWduV2lkdGg7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ndWkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3VpLmlkZWFsV2lkdGggPSBjbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3VpLmlkZWFsSGVpZ2h0ID0gY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IGNsaWVudEhlaWdodCAvIHRoaXMuZGVzaWduSGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jRWwuc3R5bGUuZm9udFNpemUgPSBmeiArICdweCc7XHJcblxyXG4gICAgICAgIC8v55uu5YmN55qE6K6+6K6h6YC76L6R5piv5a696YCC6YWN77yM6auY5q+U5L6L57yp5bCP77yM5a696Ieq5Yqo5pS+5aSn5pS+5bCPXHJcbiAgICAgICAgdGhpcy5yb290Qm94LnNjYWxlWCA9IHRoaXMuc2NhbGVSYXRpbztcclxuICAgICAgICB0aGlzLnJvb3RCb3guc2NhbGVZID0gdGhpcy5zY2FsZVJhdGlvO1xyXG4gICAgICAgIHRoaXMucm9vdEJveC53aWR0aCA9IDEgLyB0aGlzLnNjYWxlUmF0aW87XHJcblxyXG4gICAgICAgIENvcmUuZXZlbnQuZXZlbnQoRXZlbnRNYXAuUkVTSVpFLCB0aGlzLnNjYWxlUmF0aW8pO1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZS5yZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4suafk1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZW5kZXJMb29wKCkge1xyXG4gICAgICAgIHRoaXMuZW5naW5lLnJ1blJlbmRlckxvb3AoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnJlbmRlcigpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlnLrmma8g5re75Yqg55u45py6IOetiSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlU2NlbmUoKSB7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVuZGVyQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50OyAvLyBHZXQgdGhlIGNhbnZhcyBlbGVtZW50IFxyXG4gICAgICAgIHRoaXMuZW5naW5lID0gbmV3IEJBQllMT04uRW5naW5lKGNhbnZhcywgdHJ1ZSkgYXMgQkFCWUxPTi5FbmdpbmU7IC8vIEdlbmVyYXRlIHRoZSBCQUJZTE9OIDNEIGVuZ2luZVxyXG4gICAgICAgIC8vIC8vIENyZWF0ZSB0aGUgc2NlbmUgc3BhY2VcclxuICAgICAgICBsZXQgc2NlbmUgPSBuZXcgQkFCWUxPTi5TY2VuZSh0aGlzLmVuZ2luZSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhIGNhbWVyYSB0byB0aGUgc2NlbmUgYW5kIGF0dGFjaCBpdCB0byB0aGUgY2FudmFzXHJcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgQkFCWUxPTi5BcmNSb3RhdGVDYW1lcmEoXCJDYW1lcmFcIiwgTWF0aC5QSSAvIDIsIE1hdGguUEkgLyAyLCAyLCBuZXcgQkFCWUxPTi5WZWN0b3IzKDAsIDEsIDMpLCBzY2VuZSk7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEuYXR0YWNoQ29udHJvbChjYW52YXMsIHRydWUsIHRydWUpOy8v6K6+572u55u45py65piv5ZCm5Y+v56e75YqoXHJcblxyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCBHYW1lIGZyb20gXCIuLi9HYW1lXCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuLi8uLi9jb3JlL0NvcmVcIjtcclxuaW1wb3J0IEV2ZW50TWFwIGZyb20gXCIuLi8uLi9jb3JlL0V2ZW50TWFwXCI7XHJcbmltcG9ydCBOb2RlIGZyb20gXCIuLi8uLi9jb3JlL05vZGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudHJhbmNlVmlldyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBpbml0KCkge1xyXG4gICAgICAgIGxldCBub2RlID0gYXdhaXQgQ29yZS5ub2RlLmNyZWF0ZUltYWdlKCdiYWNrZ3JvdW5kJywgJy4vcmVzL2ZhbmdqaWFuMDI4LnBuZycpXHJcbiAgICAgICAgR2FtZS5yb290Qm94LmFkZENvbnRyb2wobm9kZSk7XHJcbiAgICAgICAgLy8gbm9kZSA9IGF3YWl0IENvcmUubm9kZS5jcmVhdGVJbWFnZSgnaWNvbicsICcuL3Jlcy9maXNoMDMucG5nJyk7XHJcblxyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgQkFCWUxPTi5HVUkuSW1hZ2UoJ2ljb24nLCAnLi9yZXMvZmlzaDAzLnBuZycpO1xyXG4gICAgICAgIC8vIGltZy5zdHJldGNoID0gQkFCWUxPTi5HVUkuSW1hZ2UuU1RSRVRDSF9OT05FOy8v57yp5pS+5a655Zmo5Lul6YCC5bqU5Zu+5YOP5aSn5bCP44CCXHJcbiAgICAgICAgaW1nLm9uSW1hZ2VMb2FkZWRPYnNlcnZhYmxlLmFkZE9uY2UoKCkgPT4ge1xyXG4gICAgICAgICAgICBpbWcud2lkdGggPSBpbWcuZG9tSW1hZ2Uud2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgICBpbWcuaGVpZ2h0ID0gaW1nLmRvbUltYWdlLmhlaWdodCArICdweCc7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBub2RlLmFkZENvbnRyb2woaW1nKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlLignaWNvbicpKVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vbG9naWMvR2FtZVwiO1xyXG5pbXBvcnQgRW50cmFuY2VWaWV3IGZyb20gXCIuL2xvZ2ljL3ZpZXcvRW50cmFuY2VWaWV3XCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuL2NvcmUvQ29yZVwiO1xyXG4vKipcclxuICog6aG555uu5YWl5Y+jXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIENvcmUuaW5pdCgpO1xyXG4gICAgICAgIEdhbWUuZW5naW5lSW5pdCgpO1xyXG5cclxuICAgICAgICBuZXcgRW50cmFuY2VWaWV3KCk7XHJcblxyXG4gICAgICAgIC8vIEJBQllMT04uU2NlbmVMb2FkZXIuQXBwZW5kKCcuL3Jlcy8nLCAnbWFqaWFuZ2ppYW5nLmdsYicsIEdhbWUuc2NlbmUsIChjb250YWluZXIpID0+IHtcclxuICAgICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coY29udGFpbmVyKTtcclxuICAgICAgICAvLyAgICAgR2FtZS5zY2VuZS5hY3RpdmVDYW1lcmEgPSBjb250YWluZXIuY2FtZXJhc1sxXTtcclxuICAgICAgICAvLyAgICAgbGV0IGRlc2sgPSBHYW1lLnNjZW5lLmdldE5vZGVCeU5hbWUoJ2Rlc2snKSBhcyBCQUJZTE9OLk1lc2g7XHJcblxyXG4gICAgICAgIC8vICAgICBsZXQgYSA9IGRlc2subWF0ZXJpYWwgYXMgQkFCWUxPTi5QQlJNYXRlcmlhbDtcclxuXHJcbiAgICAgICAgLy8gICAgIGEuc3BlY3VsYXJJbnRlbnNpdHkgPSAxOy8v6ZWc6Z2iXHJcblxyXG4gICAgICAgIC8vIH0pXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOeJqeS9k1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZEJveCgpIHtcclxuICAgICAgICBCQUJZTE9OLk1lc2hCdWlsZGVyLkNyZWF0ZUJveCgnYm94Jywge30sIEdhbWUuc2NlbmUpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcbiJdLCJuYW1lcyI6WyJJbWFnZVQiXSwibWFwcGluZ3MiOiI7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
