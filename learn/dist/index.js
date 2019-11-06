(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Game = factory());
}(this, function () { 'use strict';

    var EventMap = {
        /** 浏览器尺寸变化事件 */
        RESIZE: 'resize',
    };
    //# sourceMappingURL=EventMap.js.map

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

    class INode extends BABYLON.GUI.Container {
        /**  */
        constructor() {
            super();
            // 容器适应其子代的大小：
            this.adaptHeightToChildren = true;
            this.adaptWidthToChildren = true;
        }
    }
    //# sourceMappingURL=INode.js.map

    class IButton extends BABYLON.GUI.Button {
        /**
         * 初始化
         */
        static init(btn) {
            let btnImage = btn.image;
            btnImage.onImageLoadedObservable.addOnce(() => {
                btnImage.width = btnImage.domImage.width + 'px';
                btnImage.height = btnImage.domImage.height + 'px';
                btn.width = btnImage.width;
                btn.height = btnImage.height;
            });
        }
        /**
         * Creates a new button made with an image and a text
         * @param name defines the name of the button
         * @param text defines the text of the button
         * @param imageUrl defines the url of the image
         * @returns a new Button
         */
        static CreateImageButton(name, text, imageUrl) {
            let btn = super.CreateImageButton(name, text, imageUrl);
            this.init(btn);
            return btn;
        }
        ;
        /**
         * Creates a new button made with an image
         * @param name defines the name of the button
         * @param imageUrl defines the url of the image
         * @returns a new Button
         */
        static CreateImageOnlyButton(name, imageUrl) {
            let btn = super.CreateImageOnlyButton(name, imageUrl);
            this.init(btn);
            return btn;
        }
        ;
        /**
         * Creates a new button made with a text
         * @param name defines the name of the button
         * @param text defines the text of the button
         * @returns a new Button
         */
        static CreateSimpleButton(name, text) {
            let btn = super.CreateImageOnlyButton(name, text);
            this.init(btn);
            return btn;
        }
        ;
        /**
         * Creates a new button made with an image and a centered text
         * @param name defines the name of the button
         * @param text defines the text of the button
         * @param imageUrl defines the url of the image
         * @returns a new Button
         */
        static CreateImageWithCenterTextButton(name, text, imageUrl) {
            let btn = super.CreateImageWithCenterTextButton(name, text, imageUrl);
            this.init(btn);
            return btn;
        }
        ;
    }
    //# sourceMappingURL=IButton.js.map

    class IImage extends BABYLON.GUI.Image {
        /** 加载完成 */
        constructor(name, url) {
            super(name, url);
            //加载完成
            this.onImageLoadedObservable.addOnce(() => {
                this.width = this.domImage.width + 'px';
                this.height = this.domImage.height + 'px';
            });
        }
        /**
         * 图片加载
         */
        onLoad() {
            return new Promise((resolve) => {
                //加载完成
                this.onImageLoadedObservable.addOnce(() => {
                    resolve(this);
                });
            });
        }
    }
    //# sourceMappingURL=IImage.js.map

    /**
     * 脚本组件基类
     */
    class IControl extends BABYLON.GUI.Container {
        constructor(name) {
            super(name);
            console.log(this);
        }
    }
    //# sourceMappingURL=IControl.js.map

    const Event = new EventDispatcher();
    //# sourceMappingURL=Core.js.map

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
            Event.event(EventMap.RESIZE, this.scaleRatio);
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
                let node = new INode(), img = new IImage('background', './res/fangjian028.png');
                node.addControl(img);
                Game.rootBox.addControl(node);
                let btn = IButton.CreateImageOnlyButton('btn', './res/fish03.png');
                node.addControl(btn);
            });
        }
    }
    //# sourceMappingURL=EntranceView.js.map

    /**
     * 项目入口
     */
    class App {
        constructor() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2FwcC9jb3JlL0V2ZW50TWFwLnRzIiwiLi4vYXBwL2NvcmUvRXZlbnREaXNwYXRjaGVyLnRzIiwiLi4vYXBwL2NvcmUvSU5vZGUudHMiLCIuLi9hcHAvY29yZS9JQnV0dG9uLnRzIiwiLi4vYXBwL2NvcmUvSUltYWdlLnRzIiwiLi4vYXBwL2NvcmUvSUNvbnRyb2wudHMiLCIuLi9hcHAvY29yZS9Db3JlLnRzIiwiLi4vYXBwL2xvZ2ljL0dhbWUudHMiLCIuLi9hcHAvbG9naWMvdmlldy9FbnRyYW5jZVZpZXcudHMiLCIuLi9hcHAvQXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIC8qKiDmtY/op4jlmajlsLrlr7jlj5jljJbkuovku7YgKi9cclxuICAgIFJFU0laRTogJ3Jlc2l6ZScsXHJcbn0iLCIvKipcclxuICog5LqL5Lu25YiG5Y+RIOS6i+S7tuS4reS7i1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnREaXNwYXRjaGVyIHtcclxuXHJcbiAgICAvKiog5bey57uP57uR5a6a5LqL5Lu25YiX6KGoICovXHJcbiAgICBwcml2YXRlIGxpc3Q6IGFueSA9IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rS+5Y+R5LqL5Lu2XHJcbiAgICAgKiBAcGFyYW0gdHlwZSDkuovku7bnsbvlnotcclxuICAgICAqIEBwYXJhbSAo5Y+v6YCJKSDlm57osIPmlbDmja5cclxuICAgICAqL1xyXG4gICAgZXZlbnQodHlwZTogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGxpc3Q6IGFueVtdID0gdGhpcy5saXN0W3R5cGVdO1xyXG4gICAgICAgIGlmIChsaXN0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBsaXN0Lmxlbmd0aCAtIDE7IHggPiAtMTsgeC0tKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W3hdWydsaXN0ZW5lciddLmNhbGwobGlzdFt4XVsnY2FsbGVyJ10sIGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a+56LGh5rOo5YaM5oyH5a6a57G75Z6L55qE5LqL5Lu25L6m5ZCs5Zmo5a+56LGh77yM5Lul5L2/5L6m5ZCs5Zmo6IO95aSf5o6l5pS25LqL5Lu26YCa55+lXHJcbiAgICAgKiBAcGFyYW0gdHlwZSB0eXBlIOS6i+S7tuexu+Wei1xyXG4gICAgICogQHBhcmFtIGNhbGxlclx05LqL5Lu25L6m5ZCs5Ye95pWw55qE5omn6KGM5Z+f44CCXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg5LqL5Lu25L6m5ZCs5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIG9uKHR5cGU6IHN0cmluZywgY2FsbGVyOiBhbnksIGxpc3RlbmVyOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5saXN0W3R5cGVdKSB7Ly/mo4DmtYvmmK/lkKblt7Lnu4/nu5Hlrprov4fkuovku7ZcclxuICAgICAgICAgICAgdGhpcy5saXN0W3R5cGVdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMubGlzdFt0eXBlXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5saXN0W3R5cGVdW3hdLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcign5LqL5Lu25Yay56qBJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5L+d6K+B5pa55rOV55qE5ZSv5LiA5oCnXHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign5LqL5Lu25a656ZSZ5aSE55CGJylcclxuICAgICAgICBsZXQga2V5czogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhjYWxsZXIuX19wcm90b19fKTtcclxuICAgICAgICBmb3IgKGxldCB4ID0ga2V5cy5sZW5ndGggLSAxOyB4ID4gLTE7IHgtLSkge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGVyW2tleXNbeF1dID09PSBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBjYWxsZXJba2V5c1t4XV0gPSBjYWxsZXJba2V5c1t4XV0uYmluZChjYWxsZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGlzdFt0eXBlXS5wdXNoKHsgY2FsbGVyOiBjYWxsZXIsIGxpc3RlbmVyOiBsaXN0ZW5lciB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWvueixoeenu+mZpOaMh+Wumuexu+Wei+eahOS6i+S7tuS+puWQrOWZqOWvueixoe+8jFxyXG4gICAgICogQHBhcmFtIHR5cGUgXHJcbiAgICAgKiBAcGFyYW0gY2FsbGVyXHTkuovku7bkvqblkKzlh73mlbDnmoTmiafooYzln5/jgIJcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBcclxuICAgICAqL1xyXG4gICAgb2ZmKHR5cGU6IHN0cmluZywgY2FsbGVyOiBhbnksIGxpc3RlbmVyOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGxldCBsaXN0OiBhbnlbXSA9IHRoaXMubGlzdFt0eXBlXTtcclxuICAgICAgICBpZiAobGlzdCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gbGlzdC5sZW5ndGggLSAxOyB4ID4gLTE7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RbeF1bJ2xpc3RlbmVyJ10gPT09IGxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFt4XVsnbGlzdGVuZXInXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoeCwgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBJTm9kZSBleHRlbmRzIEJBQllMT04uR1VJLkNvbnRhaW5lciB7XHJcbiAgICAvKiogICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICAvLyDlrrnlmajpgILlupTlhbblrZDku6PnmoTlpKflsI/vvJpcclxuICAgICAgICB0aGlzLmFkYXB0SGVpZ2h0VG9DaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5hZGFwdFdpZHRoVG9DaGlsZHJlbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkQ29udHJvbCgpe1xyXG5cclxuICAgIC8vIH1cclxufSIsImltcG9ydCB7IElJbWFnZSB9IGZyb20gXCIuL0NvcmVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElCdXR0b24gZXh0ZW5kcyBCQUJZTE9OLkdVSS5CdXR0b24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbml0KGJ0bjpCQUJZTE9OLkdVSS5CdXR0b24pIHtcclxuICAgICAgICBsZXQgYnRuSW1hZ2UgPSBidG4uaW1hZ2UgYXMgSUltYWdlO1xyXG4gICAgICAgIGJ0bkltYWdlLm9uSW1hZ2VMb2FkZWRPYnNlcnZhYmxlLmFkZE9uY2UoKCkgPT4ge1xyXG4gICAgICAgICAgICBidG5JbWFnZS53aWR0aCA9IGJ0bkltYWdlLmRvbUltYWdlLndpZHRoICsgJ3B4JztcclxuICAgICAgICAgICAgYnRuSW1hZ2UuaGVpZ2h0ID0gYnRuSW1hZ2UuZG9tSW1hZ2UuaGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICAgICAgYnRuLndpZHRoID0gYnRuSW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgICAgIGJ0bi5oZWlnaHQgPSBidG5JbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgYnV0dG9uIG1hZGUgd2l0aCBhbiBpbWFnZSBhbmQgYSB0ZXh0XHJcbiAgICAgKiBAcGFyYW0gbmFtZSBkZWZpbmVzIHRoZSBuYW1lIG9mIHRoZSBidXR0b25cclxuICAgICAqIEBwYXJhbSB0ZXh0IGRlZmluZXMgdGhlIHRleHQgb2YgdGhlIGJ1dHRvblxyXG4gICAgICogQHBhcmFtIGltYWdlVXJsIGRlZmluZXMgdGhlIHVybCBvZiB0aGUgaW1hZ2VcclxuICAgICAqIEByZXR1cm5zIGEgbmV3IEJ1dHRvblxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgQ3JlYXRlSW1hZ2VCdXR0b24obmFtZTogc3RyaW5nLCB0ZXh0OiBzdHJpbmcsIGltYWdlVXJsOiBzdHJpbmcpOiBCQUJZTE9OLkdVSS5CdXR0b24ge1xyXG4gICAgICAgIGxldCBidG4gPSBzdXBlci5DcmVhdGVJbWFnZUJ1dHRvbihuYW1lLCB0ZXh0LCBpbWFnZVVybCk7XHJcbiAgICAgICAgdGhpcy5pbml0KGJ0bik7XHJcbiAgICAgICAgcmV0dXJuIGJ0bjtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgYnV0dG9uIG1hZGUgd2l0aCBhbiBpbWFnZVxyXG4gICAgICogQHBhcmFtIG5hbWUgZGVmaW5lcyB0aGUgbmFtZSBvZiB0aGUgYnV0dG9uXHJcbiAgICAgKiBAcGFyYW0gaW1hZ2VVcmwgZGVmaW5lcyB0aGUgdXJsIG9mIHRoZSBpbWFnZVxyXG4gICAgICogQHJldHVybnMgYSBuZXcgQnV0dG9uXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBDcmVhdGVJbWFnZU9ubHlCdXR0b24obmFtZTogc3RyaW5nLCBpbWFnZVVybDogc3RyaW5nKTogQkFCWUxPTi5HVUkuQnV0dG9uIHtcclxuICAgICAgICBsZXQgYnRuID0gc3VwZXIuQ3JlYXRlSW1hZ2VPbmx5QnV0dG9uKG5hbWUsIGltYWdlVXJsKTtcclxuICAgICAgICB0aGlzLmluaXQoYnRuKTtcclxuICAgICAgICByZXR1cm4gYnRuO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBidXR0b24gbWFkZSB3aXRoIGEgdGV4dFxyXG4gICAgICogQHBhcmFtIG5hbWUgZGVmaW5lcyB0aGUgbmFtZSBvZiB0aGUgYnV0dG9uXHJcbiAgICAgKiBAcGFyYW0gdGV4dCBkZWZpbmVzIHRoZSB0ZXh0IG9mIHRoZSBidXR0b25cclxuICAgICAqIEByZXR1cm5zIGEgbmV3IEJ1dHRvblxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgQ3JlYXRlU2ltcGxlQnV0dG9uKG5hbWU6IHN0cmluZywgdGV4dDogc3RyaW5nKTogQkFCWUxPTi5HVUkuQnV0dG9uIHtcclxuICAgICAgICBsZXQgYnRuID0gc3VwZXIuQ3JlYXRlSW1hZ2VPbmx5QnV0dG9uKG5hbWUsIHRleHQpO1xyXG4gICAgICAgIHRoaXMuaW5pdChidG4pO1xyXG4gICAgICAgIHJldHVybiBidG5cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgYnV0dG9uIG1hZGUgd2l0aCBhbiBpbWFnZSBhbmQgYSBjZW50ZXJlZCB0ZXh0XHJcbiAgICAgKiBAcGFyYW0gbmFtZSBkZWZpbmVzIHRoZSBuYW1lIG9mIHRoZSBidXR0b25cclxuICAgICAqIEBwYXJhbSB0ZXh0IGRlZmluZXMgdGhlIHRleHQgb2YgdGhlIGJ1dHRvblxyXG4gICAgICogQHBhcmFtIGltYWdlVXJsIGRlZmluZXMgdGhlIHVybCBvZiB0aGUgaW1hZ2VcclxuICAgICAqIEByZXR1cm5zIGEgbmV3IEJ1dHRvblxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgQ3JlYXRlSW1hZ2VXaXRoQ2VudGVyVGV4dEJ1dHRvbihuYW1lOiBzdHJpbmcsIHRleHQ6IHN0cmluZywgaW1hZ2VVcmw6IHN0cmluZyk6IEJBQllMT04uR1VJLkJ1dHRvbiB7XHJcbiAgICAgICAgbGV0IGJ0biA9IHN1cGVyLkNyZWF0ZUltYWdlV2l0aENlbnRlclRleHRCdXR0b24obmFtZSwgdGV4dCwgaW1hZ2VVcmwpO1xyXG4gICAgICAgIHRoaXMuaW5pdChidG4pO1xyXG4gICAgICAgIHJldHVybiBidG5cclxuICAgIH07XHJcbn0iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSUltYWdlIGV4dGVuZHMgQkFCWUxPTi5HVUkuSW1hZ2Uge1xyXG5cclxuICAgIC8qKiDliqDovb3lrozmiJAgKi9cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lPzogc3RyaW5nIHwgdW5kZWZpbmVkLCB1cmw/OiBCQUJZTE9OLk51bGxhYmxlPHN0cmluZz4pIHtcclxuICAgICAgICBzdXBlcihuYW1lLCB1cmwpO1xyXG5cclxuICAgICAgICAvL+WKoOi9veWujOaIkFxyXG4gICAgICAgIHRoaXMub25JbWFnZUxvYWRlZE9ic2VydmFibGUuYWRkT25jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmRvbUltYWdlLndpZHRoICsgJ3B4JztcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmRvbUltYWdlLmhlaWdodCArICdweCc7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbvueJh+WKoOi9vVxyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKTogUHJvbWlzZTxJSW1hZ2U+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgLy/liqDovb3lrozmiJBcclxuICAgICAgICAgICAgdGhpcy5vbkltYWdlTG9hZGVkT2JzZXJ2YWJsZS5hZGRPbmNlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbn0iLCIvKipcclxuICog6ISa5pys57uE5Lu25Z+657G7XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJQ29udHJvbCBleHRlbmRzIEJBQllMT04uR1VJLkNvbnRhaW5lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lPzogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gJy4vRXZlbnREaXNwYXRjaGVyJztcclxuXHJcbi8qKlxyXG4gKiDmoLjlv4PmqKHlnZflhaXlj6NcclxuICovXHJcblxyXG5leHBvcnQgeyBkZWZhdWx0IGFzIElOb2RlIH0gZnJvbSAnLi9JTm9kZSc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgSUJ1dHRvbiB9IGZyb20gJy4vSUJ1dHRvbic7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgSUltYWdlIH0gZnJvbSAnLi9JSW1hZ2UnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIElDb250cm9sIH0gZnJvbSAnLi9JQ29udHJvbCc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQ29tcG9uZW50IH0gZnJvbSAnLi9Db21wb25lbnQnO1xyXG5leHBvcnQgY29uc3QgRXZlbnQgPSBuZXcgRXZlbnREaXNwYXRjaGVyKCk7XHJcblxyXG4iLCJpbXBvcnQgRXZlbnRNYXAgZnJvbSBcIi4uL2NvcmUvRXZlbnRNYXBcIjtcclxuaW1wb3J0IHsgRXZlbnQgfSBmcm9tIFwiLi4vY29yZS9Db3JlXCI7XHJcblxyXG4vKipcclxuICog5ri45oiP6YC76L6RXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcclxuXHJcbiAgICAvKiog6K6+6K6h5bC65a+4IOWuvSAqL1xyXG4gICAgc3RhdGljIGRlc2lnbldpZHRoOiBudW1iZXIgPSAxMzM0O1xyXG4gICAgLyoqIOiuvuiuoeWwuuWvuCDpq5ggKi9cclxuICAgIHN0YXRpYyBkZXNpZ25IZWlnaHQ6IG51bWJlciA9IDc1MDtcclxuICAgIC8qKiDnm7jlr7norr7orqHlsLrlr7jnvKnmlL7mr5TkvosgKi9cclxuICAgIHN0YXRpYyBzY2FsZVJhdGlvOiBudW1iZXIgPSAxO1xyXG4gICAgLyoqIOWcuuaZryAqL1xyXG4gICAgc3RhdGljIHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xyXG4gICAgLyoqIDNk5byV5pOOICovXHJcbiAgICBzdGF0aWMgZW5naW5lOiBCQUJZTE9OLkVuZ2luZTtcclxuICAgIC8qKiDnm7jmnLogKi9cclxuICAgIHN0YXRpYyBjYW1lcmE6IEJBQllMT04uQXJjUm90YXRlQ2FtZXJhO1xyXG4gICAgLyoqIOWFqOWxj0dVSSAqL1xyXG4gICAgc3RhdGljIGd1aTogQkFCWUxPTi5HVUkuQWR2YW5jZWREeW5hbWljVGV4dHVyZTtcclxuICAgIC8qKiDlhajlsY/oioLngrnmoLnlrrnlmagg5YWo5bGPR1VJ5LiK6Z2i55qE6IqC54K55YWo5piv5a6D5LiK6Z2i55qE5a2Q6IqC54K5ICovXHJcbiAgICBzdGF0aWMgcm9vdEJveDogQkFCWUxPTi5HVUkuUmVjdGFuZ2xlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW5ri45oiP5byV5pOOXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlbmdpbmVJbml0KCkge1xyXG4gICAgICAgIHRoaXMuc2NlbmUgPSB0aGlzLmNyZWF0ZVNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVGdWxsR3VpKCk7XHJcbiAgICAgICAgdGhpcy5hZGRMaWdodCgpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyTG9vcCgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgdmFyIHJlc2l6ZUV2dCA9ICdvcmllbnRhdGlvbmNoYW5nZScgaW4gd2luZG93ID8gJ29yaWVudGF0aW9uY2hhbmdlJyA6ICdyZXNpemUnO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKHJlc2l6ZUV2dCwgKCkgPT4gdGhpcy5yZWZyZXNoUmVtKCksIGZhbHNlKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gdGhpcy5yZWZyZXNoUmVtKCksIGZhbHNlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlhajlsY9HVUnlrrnlmahcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlRnVsbEd1aSgpIHtcclxuICAgICAgICBsZXQgZ3VpID0gQkFCWUxPTi5HVUkuQWR2YW5jZWREeW5hbWljVGV4dHVyZS5DcmVhdGVGdWxsc2NyZWVuVUkoJ3VpJyk7XHJcbiAgICAgICAgdGhpcy5ndWkgPSBndWk7XHJcbiAgICAgICAgZ3VpLnJlbmRlckF0SWRlYWxTaXplID0gdHJ1ZTsvL+iHqumAguW6lOe8qeaUvlxyXG4gICAgICAgIGd1aS51c2VTbWFsbGVzdElkZWFsID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUZ1bGxCb3goKTtcclxuICAgICAgICB0aGlzLnJlZnJlc2hSZW0oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuWFqOWxj+iKgueCueWuueWZqOagueiKgueCuVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVGdWxsQm94KCkge1xyXG4gICAgICAgIGxldCBib3ggPSBuZXcgQkFCWUxPTi5HVUkuUmVjdGFuZ2xlKCk7XHJcbiAgICAgICAgYm94LndpZHRoID0gMTtcclxuICAgICAgICBib3guaGVpZ2h0ID0gJzc1MHB4JztcclxuICAgICAgICBib3guY2xpcENoaWxkcmVuID0gZmFsc2U7XHJcbiAgICAgICAgYm94LmNsaXBDb250ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgYm94LnRoaWNrbmVzcyA9IDA7XHJcbiAgICAgICAgdGhpcy5ndWkuYWRkQ29udHJvbChib3gpO1xyXG4gICAgICAgIHRoaXMucm9vdEJveCA9IGJveDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOeBr+WFiVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhZGRMaWdodCgpIHtcclxuICAgICAgICBsZXQgbGlnaHQgPSBuZXcgQkFCWUxPTi5IZW1pc3BoZXJpY0xpZ2h0KFwibGlnaHQxXCIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgLTIpLCBHYW1lLnNjZW5lKTtcclxuICAgICAgICBsaWdodC5kaWZmdXNlID0gbmV3IEJBQllMT04uQ29sb3IzKDEsIDEsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55uR5ZCs5rWP6KeI5Zmo5bC65a+45Y+Y5YyW5YGa5a+55bqU6YCC6YWNXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlZnJlc2hSZW0oKSB7XHJcbiAgICAgICAgdmFyIGRvYyA9IGRvY3VtZW50O1xyXG4gICAgICAgIHZhciB3aW4gPSB3aW5kb3c7XHJcbiAgICAgICAgdmFyIGRvY0VsID0gZG9jLmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICB2YXIgY2xpZW50V2lkdGg7XHJcbiAgICAgICAgdmFyIGNsaWVudEhlaWdodDtcclxuICAgICAgICB2YXIgbG9hZEJveCA9IGRvYy5xdWVyeVNlbGVjdG9yKCcjYm94JykgYXMgSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGNsaWVudFdpZHRoID0gd2luLmlubmVyV2lkdGggfHxcclxuICAgICAgICAgICAgZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fFxyXG4gICAgICAgICAgICBkb2MuYm9keS5jbGllbnRXaWR0aDtcclxuICAgICAgICBjbGllbnRIZWlnaHQgPSB3aW4uaW5uZXJIZWlnaHQgfHxcclxuICAgICAgICAgICAgZG9jLmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHxcclxuICAgICAgICAgICAgZG9jLmJvZHkuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIGlmICghY2xpZW50V2lkdGgpIHJldHVybjtcclxuICAgICAgICB2YXIgd2lkdGggPSBjbGllbnRXaWR0aDtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIHZhciBmejtcclxuXHJcbiAgICAgICAgaWYgKGNsaWVudFdpZHRoIDwgY2xpZW50SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxvYWRCb3guc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZVooOTBkZWcpJztcclxuICAgICAgICAgICAgbG9hZEJveC5zdHlsZS53aWR0aCA9IGNsaWVudEhlaWdodCArICdweCc7XHJcbiAgICAgICAgICAgIGxvYWRCb3guc3R5bGUuaGVpZ2h0ID0gY2xpZW50V2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgICBsb2FkQm94LnN0eWxlLm1hcmdpbkxlZnQgPSBjbGllbnRXaWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIGZ6ID0gMTAwICogaGVpZ2h0IC8gdGhpcy5kZXNpZ25XaWR0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmd1aSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ndWkuaWRlYWxXaWR0aCA9IGNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3VpLmlkZWFsSGVpZ2h0ID0gY2xpZW50V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IGNsaWVudFdpZHRoIC8gdGhpcy5kZXNpZ25IZWlnaHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9hZEJveC5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlWigwZGVnKSc7XHJcbiAgICAgICAgICAgIGxvYWRCb3guc3R5bGUud2lkdGggPSBjbGllbnRXaWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIGxvYWRCb3guc3R5bGUuaGVpZ2h0ID0gY2xpZW50SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICAgICAgbG9hZEJveC5zdHlsZS5tYXJnaW5MZWZ0ID0gMCArICdweCc7XHJcbiAgICAgICAgICAgIGZ6ID0gMTAwICogd2lkdGggLyB0aGlzLmRlc2lnbldpZHRoO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3VpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmd1aS5pZGVhbFdpZHRoID0gY2xpZW50V2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmd1aS5pZGVhbEhlaWdodCA9IGNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBjbGllbnRIZWlnaHQgLyB0aGlzLmRlc2lnbkhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY0VsLnN0eWxlLmZvbnRTaXplID0gZnogKyAncHgnO1xyXG5cclxuICAgICAgICAvL+ebruWJjeeahOiuvuiuoemAu+i+keaYr+WuvemAgumFje+8jOmrmOavlOS+i+e8qeWwj++8jOWuveiHquWKqOaUvuWkp+aUvuWwj1xyXG4gICAgICAgIHRoaXMucm9vdEJveC5zY2FsZVggPSB0aGlzLnNjYWxlUmF0aW87XHJcbiAgICAgICAgdGhpcy5yb290Qm94LnNjYWxlWSA9IHRoaXMuc2NhbGVSYXRpbztcclxuICAgICAgICB0aGlzLnJvb3RCb3gud2lkdGggPSAxIC8gdGhpcy5zY2FsZVJhdGlvO1xyXG5cclxuICAgICAgICBFdmVudC5ldmVudChFdmVudE1hcC5SRVNJWkUsIHRoaXMuc2NhbGVSYXRpbyk7XHJcblxyXG4gICAgICAgIHRoaXMuZW5naW5lLnJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riy5p+TXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlbmRlckxvb3AoKSB7XHJcbiAgICAgICAgdGhpcy5lbmdpbmUucnVuUmVuZGVyTG9vcCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUucmVuZGVyKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuWcuuaZryDmt7vliqDnm7jmnLog562JIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVTY2VuZSgpIHtcclxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZW5kZXJDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7IC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQgXHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlKSBhcyBCQUJZTE9OLkVuZ2luZTsgLy8gR2VuZXJhdGUgdGhlIEJBQllMT04gM0QgZW5naW5lXHJcbiAgICAgICAgLy8gLy8gQ3JlYXRlIHRoZSBzY2VuZSBzcGFjZVxyXG4gICAgICAgIGxldCBzY2VuZSA9IG5ldyBCQUJZTE9OLlNjZW5lKHRoaXMuZW5naW5lKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGEgY2FtZXJhIHRvIHRoZSBzY2VuZSBhbmQgYXR0YWNoIGl0IHRvIHRoZSBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBCQUJZTE9OLkFyY1JvdGF0ZUNhbWVyYShcIkNhbWVyYVwiLCBNYXRoLlBJIC8gMiwgTWF0aC5QSSAvIDIsIDIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgMyksIHNjZW5lKTtcclxuICAgICAgICB0aGlzLmNhbWVyYS5hdHRhY2hDb250cm9sKGNhbnZhcywgdHJ1ZSwgdHJ1ZSk7Ly/orr7nva7nm7jmnLrmmK/lkKblj6/np7vliqhcclxuXHJcbiAgICAgICAgcmV0dXJuIHNjZW5lO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IHsgSU5vZGUsIEV2ZW50LCBJSW1hZ2UsIElCdXR0b24gfSBmcm9tIFwiLi4vLi4vY29yZS9Db3JlXCI7XHJcbmltcG9ydCBHYW1lIGZyb20gXCIuLi9HYW1lXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRyYW5jZVZpZXcge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaW5pdCgpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBJTm9kZSgpLFxyXG4gICAgICAgICAgICBpbWcgPSBuZXcgSUltYWdlKCdiYWNrZ3JvdW5kJywgJy4vcmVzL2ZhbmdqaWFuMDI4LnBuZycpO1xyXG4gICAgICAgIG5vZGUuYWRkQ29udHJvbChpbWcpO1xyXG4gICAgICAgIEdhbWUucm9vdEJveC5hZGRDb250cm9sKG5vZGUpO1xyXG5cclxuICAgICAgICBsZXQgYnRuID0gSUJ1dHRvbi5DcmVhdGVJbWFnZU9ubHlCdXR0b24oJ2J0bicsICcuL3Jlcy9maXNoMDMucG5nJyk7XHJcblxyXG4gICAgICAgIG5vZGUuYWRkQ29udHJvbChidG4pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vbG9naWMvR2FtZVwiO1xyXG5pbXBvcnQgRW50cmFuY2VWaWV3IGZyb20gXCIuL2xvZ2ljL3ZpZXcvRW50cmFuY2VWaWV3XCI7XHJcbi8qKlxyXG4gKiDpobnnm67lhaXlj6NcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgR2FtZS5lbmdpbmVJbml0KCk7XHJcblxyXG4gICAgICAgIG5ldyBFbnRyYW5jZVZpZXcoKTtcclxuXHJcbiAgICAgICAgLy8gQkFCWUxPTi5TY2VuZUxvYWRlci5BcHBlbmQoJy4vcmVzLycsICdtYWppYW5namlhbmcuZ2xiJywgR2FtZS5zY2VuZSwgKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhjb250YWluZXIpO1xyXG4gICAgICAgIC8vICAgICBHYW1lLnNjZW5lLmFjdGl2ZUNhbWVyYSA9IGNvbnRhaW5lci5jYW1lcmFzWzFdO1xyXG4gICAgICAgIC8vICAgICBsZXQgZGVzayA9IEdhbWUuc2NlbmUuZ2V0Tm9kZUJ5TmFtZSgnZGVzaycpIGFzIEJBQllMT04uTWVzaDtcclxuXHJcbiAgICAgICAgLy8gICAgIGxldCBhID0gZGVzay5tYXRlcmlhbCBhcyBCQUJZTE9OLlBCUk1hdGVyaWFsO1xyXG5cclxuICAgICAgICAvLyAgICAgYS5zcGVjdWxhckludGVuc2l0eSA9IDE7Ly/plZzpnaJcclxuXHJcbiAgICAgICAgLy8gfSlcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg54mp5L2TXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkQm94KCkge1xyXG4gICAgICAgIEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KCdib3gnLCB7fSwgR2FtZS5zY2VuZSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1CQUFlOztRQUVYLE1BQU0sRUFBRSxRQUFRO0tBQ25CLENBQUE7OztJQ0hEOzs7QUFHQSxVQUFxQixlQUFlO1FBQXBDOztZQUdZLFNBQUksR0FBUSxFQUFFLENBQUM7U0FnRTFCOzs7Ozs7UUF6REcsS0FBSyxDQUFDLElBQVksRUFBRSxJQUFVO1lBQzFCLElBQUksSUFBSSxHQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBSSxJQUFJLEVBQUU7Z0JBQ04sS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNyRDthQUNKO1NBQ0o7Ozs7Ozs7UUFRRCxFQUFFLENBQUMsSUFBWSxFQUFFLE1BQVcsRUFBRSxRQUFrQjtZQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJ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
