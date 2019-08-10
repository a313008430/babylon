(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Game = factory());
}(this, function () { 'use strict';

    /**
     * 组件基类
     */
    var Component = /** @class */ (function () {
        function Component(gameObj) {
            this.gameObject = gameObj;
        }
        Component.prototype.update = function () {
        };
        return Component;
    }());
    //# sourceMappingURL=Component.js.map

    /**
     * 数组管理
     */
    var SafeArray = /** @class */ (function () {
        function SafeArray() {
            this.array = [];
            this.addQueue = [];
            this.removeQueue = new Set();
        }
        Object.defineProperty(SafeArray.prototype, "isEmpty", {
            /** 缓存数组是否为空 */
            get: function () {
                return this.addQueue.length + this.array.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        SafeArray.prototype.add = function (element) {
            this.addQueue.push(element);
        };
        SafeArray.prototype.remove = function (element) {
            this.removeQueue.add(element);
        };
        SafeArray.prototype.forEach = function (fn) {
            this.addQueued();
            this.removeQueued();
            for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
                var element = _a[_i];
                if (this.removeQueue.has(element)) {
                    continue;
                }
                fn(element);
            }
        };
        SafeArray.prototype.addQueued = function () {
            var _a;
            if (this.addQueue.length) {
                (_a = this.array).splice.apply(_a, [this.array.length, 0].concat(this.addQueue));
            }
        };
        SafeArray.prototype.removeQueued = function () {
            var _this = this;
            if (this.removeQueue.size) {
                this.array = this.array.filter(function (element) { return !_this.removeQueue.has(element); });
                this.removeQueue.clear();
            }
        };
        return SafeArray;
    }());
    //# sourceMappingURL=SafeArray.js.map

    /**
     * 游戏基类
     */
    var GameBaseObject = /** @class */ (function () {
        function GameBaseObject(entity, name) {
            this.name = name;
            this.components = [];
        }
        /**
         * 添加组件绑定
         */
        GameBaseObject.prototype.addComponent = function (ComponentType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var component = new (ComponentType.bind.apply(ComponentType, [void 0, this].concat(args)))();
            this.components.push(component);
            return component;
        };
        /**
         * 稳定组件
         */
        GameBaseObject.prototype.removeComponent = function (component) {
            var ndx = this.components.indexOf(component);
            if (ndx >= 0) {
                this.components.splice(ndx, 1);
            }
        };
        GameBaseObject.prototype.getComponent = function (ComponentType) {
            return this.components.find(function (c) { return c instanceof ComponentType; });
        };
        GameBaseObject.prototype.update = function () {
        };
        return GameBaseObject;
    }());
    //# sourceMappingURL=GameBaseObject.js.map

    /**
     * 游戏对象管理器
     * 只初始一次
     */
    var GameObjectManager = /** @class */ (function () {
        function GameObjectManager() {
            this.gameObjects = new SafeArray();
        }
        /**
         * 创建注册游戏<实体>对象
         * @param entity 需要绑定的实体对象
         * @param name 实体名称
         * @description 注册实体对象到GameObjectManager中，以方便绑定脚本组件
         */
        GameObjectManager.prototype.createGameObject = function (entity, name) {
            var gameObj = new GameBaseObject(entity, name);
            this.gameObjects.add(gameObj);
            return gameObj;
        };
        /**
         * 删除注销游戏对象
         */
        GameObjectManager.prototype.removeGameObject = function (gameObject) {
            this.gameObjects.remove(gameObject);
        };
        return GameObjectManager;
    }());
    //# sourceMappingURL=GameObjectManager.js.map

    /**
     * 事件分发 事件中介
     */
    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
            /** 已经绑定事件列表 */
            this.list = {};
        }
        /**
         * 派发事件
         * @param type 事件类型
         * @param (可选) 回调数据
         */
        EventDispatcher.prototype.event = function (type, data) {
            var list = this.list[type];
            if (list) {
                for (var x = list.length - 1; x > -1; x--) {
                    list[x]['listener'].call(list[x]['caller'], data);
                }
            }
        };
        /**
         * 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知
         * @param type type 事件类型
         * @param caller	事件侦听函数的执行域。
         * @param listener 事件侦听函数
         */
        EventDispatcher.prototype.on = function (type, caller, listener) {
            if (!this.list[type]) { //检测是否已经绑定过事件
                this.list[type] = [];
            }
            for (var x = 0; x < this.list[type].length; x++) {
                if (this.list[type][x].listener === listener) {
                    console.error('事件冲突');
                    return;
                }
            }
            //保证方法的唯一性
            console.error('事件容错处理');
            var keys = Object.keys(caller.__proto__);
            for (var x = keys.length - 1; x > -1; x--) {
                if (caller[keys[x]] === listener) {
                    listener = caller[keys[x]] = caller[keys[x]].bind(caller);
                    break;
                }
            }
            this.list[type].push({ caller: caller, listener: listener });
        };
        /**
         * 对象移除指定类型的事件侦听器对象，
         * @param type
         * @param caller	事件侦听函数的执行域。
         * @param listener
         */
        EventDispatcher.prototype.off = function (type, caller, listener) {
            var list = this.list[type];
            if (list) {
                for (var x = list.length - 1; x > -1; x--) {
                    if (list[x]['listener'] === listener) {
                        list[x]['listener'] = null;
                        list.splice(x, 1);
                    }
                }
            }
        };
        return EventDispatcher;
    }());

    /**
     * 核心模块入口
     */
    var Core = /** @class */ (function () {
        function Core() {
        }
        Core.init = function () {
            this.gameManage = new GameObjectManager();
            this.evet = new EventDispatcher();
        };
        /** 组件 */
        Core.component = Component;
        return Core;
    }());

    var test = /** @class */ (function () {
        function test(name) {
            Core.evet.on('tt', this, this.evet);
            this.name = name;
            // this.evet = this.evet.bind(this);
        }
        test.prototype.evet = function (e) {
            console.log(this.name);
            if (e == 'remove') {
                this.remove();
            }
        };
        test.prototype.moeve = function () {
        };
        test.prototype.remove = function () {
            Core.evet.off('tt', this, this.evet);
        };
        return test;
    }());
    //# sourceMappingURL=test.js.map

    /**
     * 项目入口
     */
    var App = /** @class */ (function () {
        function App() {
            var _this = this;
            Core.init(); //初始化核心库
            this.scene = this.createScene();
            var tt2 = new test(1);
            var tt = new test(2);
            window['t'] = Core;
            window['tt'] = tt;
            // console.log(Game.name)
            //  渲染
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
            // Watch for browser/canvas resize events
            window.addEventListener("resize", function () {
                _this.engine.resize();
            });
            this.addLight();
            // this.addBox();
            BABYLON.SceneLoader.Append('./res/', 'majiangjiang.glb', this.scene, function (container) {
                // console.log(container);
                _this.scene.activeCamera = container.cameras[1];
                var desk = _this.scene.getNodeByName('desk');
                var a = desk.material;
                a.specularIntensity = 1; //镜面
            });
        }
        /**
         * 添加物体
         */
        App.prototype.addBox = function () {
            this.box = BABYLON.MeshBuilder.CreateBox('box', {}, this.scene);
        };
        /**
         * 添加灯光
         */
        App.prototype.addLight = function () {
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, -2), this.scene);
            light.diffuse = new BABYLON.Color3(1, 1, 1);
            // console.log(light)
        };
        /**
         * 创建场景 添加相机 等
         */
        App.prototype.createScene = function () {
            var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
            this.engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
            // Create the scene space
            var scene = new BABYLON.Scene(this.engine);
            // Add a camera to the scene and attach it to the canvas
            this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 1, 3), scene);
            this.camera.attachControl(canvas, true, true); //设置相机是否可移动
            // console.log(this.camera)
            return scene;
        };
        return App;
    }());
    //# sourceMappingURL=App.js.map

    return App;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2FwcC9jb3JlL0NvbXBvbmVudC50cyIsIi4uL2FwcC9jb3JlL1NhZmVBcnJheS50cyIsIi4uL2FwcC9jb3JlL0dhbWVCYXNlT2JqZWN0LnRzIiwiLi4vYXBwL2NvcmUvR2FtZU9iamVjdE1hbmFnZXIudHMiLCIuLi9hcHAvY29yZS9FdmVudERpc3BhdGNoZXIudHMiLCIuLi9hcHAvY29yZS9Db3JlLnRzIiwiLi4vYXBwL2xvZ2ljL3Rlc3QudHMiLCIuLi9hcHAvQXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDnu4Tku7bln7rnsbtcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvbmVudCB7XHJcbiAgICBwcml2YXRlIGdhbWVPYmplY3Q6YW55O1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZU9iail7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0ID0gZ2FtZU9iajtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDmlbDnu4TnrqHnkIZcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNhZmVBcnJheSB7XHJcbiAgICAvKiog5a+56LGh5YiX6KGoICovXHJcbiAgICBwcml2YXRlIGFycmF5OiBhbnlbXTtcclxuICAgIC8qKiDmt7vliqDnmoTlr7nosaHliJfooaggKi9cclxuICAgIHByaXZhdGUgYWRkUXVldWU6IGFueVtdO1xyXG4gICAgLyoqIOe8k+WtmOS4tOaXtuWIoOmZpOeahOaVsOaNruWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVRdWV1ZTogU2V0PGFueT47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5hcnJheSA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWRkUXVldWUgPSBbXTtcclxuICAgICAgICB0aGlzLnJlbW92ZVF1ZXVlID0gbmV3IFNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiDnvJPlrZjmlbDnu4TmmK/lkKbkuLrnqbogKi9cclxuICAgIGdldCBpc0VtcHR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFkZFF1ZXVlLmxlbmd0aCArIHRoaXMuYXJyYXkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBhZGQ8VD4oZWxlbWVudDpUKSB7XHJcbiAgICAgICAgdGhpcy5hZGRRdWV1ZS5wdXNoKGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZShlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVRdWV1ZS5hZGQoZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yRWFjaChmbjogRnVuY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmFkZFF1ZXVlZCgpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlUXVldWVkKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRoaXMuYXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVtb3ZlUXVldWUuaGFzKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmbihlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRRdWV1ZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWRkUXVldWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXkuc3BsaWNlKHRoaXMuYXJyYXkubGVuZ3RoLCAwLCAuLi50aGlzLmFkZFF1ZXVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVRdWV1ZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlUXVldWUuc2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5ID0gdGhpcy5hcnJheS5maWx0ZXIoZWxlbWVudCA9PiAhdGhpcy5yZW1vdmVRdWV1ZS5oYXMoZWxlbWVudCkpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVF1ZXVlLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyoqIFxyXG4gKiDmuLjmiI/ln7rnsbtcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVCYXNlT2JqZWN0IHtcclxuICAgIC8qKiDlkI3np7AgKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKiDnu4Tku7bliJfooaggKi9cclxuICAgIHByaXZhdGUgY29tcG9uZW50czogYW55W107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZW50aXR5LCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg57uE5Lu257uR5a6aXHJcbiAgICAgKi9cclxuICAgIGFkZENvbXBvbmVudChDb21wb25lbnRUeXBlLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgY29tcG9uZW50ID0gbmV3IENvbXBvbmVudFR5cGUodGhpcywgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcclxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56iz5a6a57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBjb25zdCBuZHggPSB0aGlzLmNvbXBvbmVudHMuaW5kZXhPZihjb21wb25lbnQpO1xyXG4gICAgICAgIGlmIChuZHggPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMuc3BsaWNlKG5keCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldENvbXBvbmVudChDb21wb25lbnRUeXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50cy5maW5kKGMgPT4gYyBpbnN0YW5jZW9mIENvbXBvbmVudFR5cGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgU2FmZUFycmF5IGZyb20gXCIuL1NhZmVBcnJheVwiO1xyXG5pbXBvcnQgR2FtZUJhc2VPYmplY3QgZnJvbSBcIi4vR2FtZUJhc2VPYmplY3RcIjtcclxuXHJcbi8qKlxyXG4gKiDmuLjmiI/lr7nosaHnrqHnkIblmahcclxuICog5Y+q5Yid5aeL5LiA5qyhXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lT2JqZWN0TWFuYWdlciB7XHJcblxyXG4gICAgLyoqIOaJgOaciea4uOaIj+exu+WIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBnYW1lT2JqZWN0czogU2FmZUFycmF5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBuZXcgU2FmZUFycmF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICog5Yib5bu65rOo5YaM5ri45oiPPOWunuS9kz7lr7nosaFcclxuICAgICAqIEBwYXJhbSBlbnRpdHkg6ZyA6KaB57uR5a6a55qE5a6e5L2T5a+56LGhXHJcbiAgICAgKiBAcGFyYW0gbmFtZSDlrp7kvZPlkI3np7BcclxuICAgICAqIEBkZXNjcmlwdGlvbiDms6jlhozlrp7kvZPlr7nosaHliLBHYW1lT2JqZWN0TWFuYWdlcuS4re+8jOS7peaWueS+v+e7keWumuiEmuacrOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBjcmVhdGVHYW1lT2JqZWN0PFQ+KGVudGl0eTpULCBuYW1lOnN0cmluZyk6IEdhbWVCYXNlT2JqZWN0IHtcclxuICAgICAgICBjb25zdCBnYW1lT2JqID0gbmV3IEdhbWVCYXNlT2JqZWN0KGVudGl0eSwgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0cy5hZGQoZ2FtZU9iailcclxuICAgICAgICByZXR1cm4gZ2FtZU9iajtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIoOmZpOazqOmUgOa4uOaIj+WvueixoVxyXG4gICAgICovXHJcbiAgICByZW1vdmVHYW1lT2JqZWN0KGdhbWVPYmplY3QpIHtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RzLnJlbW92ZShnYW1lT2JqZWN0KTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDkuovku7bliIblj5Eg5LqL5Lu25Lit5LuLXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudERpc3BhdGNoZXIge1xyXG5cclxuICAgIC8qKiDlt7Lnu4/nu5Hlrprkuovku7bliJfooaggKi9cclxuICAgIHByaXZhdGUgbGlzdDogYW55ID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmtL7lj5Hkuovku7ZcclxuICAgICAqIEBwYXJhbSB0eXBlIOS6i+S7tuexu+Wei1xyXG4gICAgICogQHBhcmFtICjlj6/pgIkpIOWbnuiwg+aVsOaNrlxyXG4gICAgICovXHJcbiAgICBldmVudCh0eXBlOiBzdHJpbmcsIGRhdGE/OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBsZXQgbGlzdDogYW55W10gPSB0aGlzLmxpc3RbdHlwZV07XHJcbiAgICAgICAgaWYgKGxpc3QpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IGxpc3QubGVuZ3RoIC0gMTsgeCA+IC0xOyB4LS0pIHtcclxuICAgICAgICAgICAgICAgIGxpc3RbeF1bJ2xpc3RlbmVyJ10uY2FsbChsaXN0W3hdWydjYWxsZXInXSwgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlr7nosaHms6jlhozmjIflrprnsbvlnovnmoTkuovku7bkvqblkKzlmajlr7nosaHvvIzku6Xkvb/kvqblkKzlmajog73lpJ/mjqXmlLbkuovku7bpgJrnn6VcclxuICAgICAqIEBwYXJhbSB0eXBlIHR5cGUg5LqL5Lu257G75Z6LXHJcbiAgICAgKiBAcGFyYW0gY2FsbGVyXHTkuovku7bkvqblkKzlh73mlbDnmoTmiafooYzln5/jgIJcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDkuovku7bkvqblkKzlh73mlbBcclxuICAgICAqL1xyXG4gICAgb24odHlwZTogc3RyaW5nLCBjYWxsZXI6IGFueSwgbGlzdGVuZXI6IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RbdHlwZV0pIHsvL+ajgOa1i+aYr+WQpuW3sue7j+e7keWumui/h+S6i+S7tlxyXG4gICAgICAgICAgICB0aGlzLmxpc3RbdHlwZV0gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5saXN0W3R5cGVdLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3RbdHlwZV1beF0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCfkuovku7blhrLnqoEnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/kv53or4Hmlrnms5XnmoTllK/kuIDmgKdcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfkuovku7blrrnplJnlpITnkIYnKVxyXG4gICAgICAgIGxldCBrZXlzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGNhbGxlci5fX3Byb3RvX18pO1xyXG4gICAgICAgIGZvciAobGV0IHggPSBrZXlzLmxlbmd0aCAtIDE7IHggPiAtMTsgeC0tKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsZXJba2V5c1t4XV0gPT09IGxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IGNhbGxlcltrZXlzW3hdXSA9IGNhbGxlcltrZXlzW3hdXS5iaW5kKGNhbGxlcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5saXN0W3R5cGVdLnB1c2goeyBjYWxsZXI6IGNhbGxlciwgbGlzdGVuZXI6IGxpc3RlbmVyIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a+56LGh56e76Zmk5oyH5a6a57G75Z6L55qE5LqL5Lu25L6m5ZCs5Zmo5a+56LGh77yMXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBcclxuICAgICAqIEBwYXJhbSBjYWxsZXJcdOS6i+S7tuS+puWQrOWHveaVsOeahOaJp+ihjOWfn+OAglxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIFxyXG4gICAgICovXHJcbiAgICBvZmYodHlwZTogc3RyaW5nLCBjYWxsZXI6IGFueSwgbGlzdGVuZXI6IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGxpc3Q6IGFueVtdID0gdGhpcy5saXN0W3R5cGVdO1xyXG4gICAgICAgIGlmIChsaXN0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBsaXN0Lmxlbmd0aCAtIDE7IHggPiAtMTsgeC0tKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdFt4XVsnbGlzdGVuZXInXSA9PT0gbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0W3hdWydsaXN0ZW5lciddID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZSh4LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBDb21wb25lbnQgZnJvbSBcIi4vQ29tcG9uZW50XCI7XHJcbmltcG9ydCBHYW1lT2JqZWN0TWFuYWdlciBmcm9tIFwiLi9HYW1lT2JqZWN0TWFuYWdlclwiO1xyXG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5cclxuLyoqXHJcbiAqIOaguOW/g+aooeWdl+WFpeWPo1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29yZSB7XHJcbiAgICAvKiog57uE5Lu2ICovXHJcbiAgICBzdGF0aWMgY29tcG9uZW50ID0gQ29tcG9uZW50O1xyXG4gICAgLyoqIOa4uOaIj+exu+euoeeQhiAqL1xyXG4gICAgc3RhdGljIGdhbWVNYW5hZ2U6R2FtZU9iamVjdE1hbmFnZXI7XHJcbiAgICAvKiog5LqL5Lu25Lit5LuLICovXHJcbiAgICBzdGF0aWMgZXZldDpFdmVudERpc3BhdGNoZXI7XHJcblxyXG4gICAgc3RhdGljIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lTWFuYWdlID0gbmV3IEdhbWVPYmplY3RNYW5hZ2VyKCk7XHJcbiAgICAgICAgdGhpcy5ldmV0ID0gbmV3IEV2ZW50RGlzcGF0Y2hlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBDb3JlIGZyb20gXCIuLi9jb3JlL0NvcmVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHRlc3Qge1xyXG4gICAgcHJpdmF0ZSBuYW1lOmFueTtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6YW55KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgQ29yZS5ldmV0Lm9uKCd0dCcsIHRoaXMsIHRoaXMuZXZldCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICAvLyB0aGlzLmV2ZXQgPSB0aGlzLmV2ZXQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAgZXZldChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lKTtcclxuICAgICAgICBpZihlID09ICdyZW1vdmUnKXtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtb2V2ZSgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAgcmVtb3ZlKCl7XHJcbiAgICAgICAgQ29yZS5ldmV0Lm9mZigndHQnLCB0aGlzLCB0aGlzLmV2ZXQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vbG9naWMvR2FtZVwiO1xyXG5pbXBvcnQgeyBHYW1lQ29uZmlnIH0gZnJvbSBcIi4vbG9naWMvR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgQ29yZSBmcm9tIFwiLi9jb3JlL0NvcmVcIjtcclxuaW1wb3J0IHRlc3QgZnJvbSBcIi4vbG9naWMvdGVzdFwiO1xyXG5cclxuLyoqXHJcbiAqIOmhueebruWFpeWPo1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIHtcclxuXHJcbiAgICAvKiog5Zy65pmvICovXHJcbiAgICBwcml2YXRlIHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xyXG4gICAgLyoqIDNk5byV5pOOICovXHJcbiAgICBwcml2YXRlIGVuZ2luZTogQkFCWUxPTi5FbmdpbmU7XHJcbiAgICAvKiog55u45py6ICovXHJcbiAgICBwcml2YXRlIGNhbWVyYTogQkFCWUxPTi5BcmNSb3RhdGVDYW1lcmE7XHJcblxyXG4gICAgcHJpdmF0ZSBib3g6IEJBQllMT04uTWVzaDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgQ29yZS5pbml0KCk7Ly/liJ3lp4vljJbmoLjlv4PlupNcclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IHRoaXMuY3JlYXRlU2NlbmUoKTtcclxuICAgICAgICBuZXcgR2FtZTtcclxuXHJcbiAgICAgICB2YXIgdHQyID0gbmV3IHRlc3QoMSk7XHJcbiAgICAgICB2YXIgdHQgPSBuZXcgdGVzdCgyKTtcclxuXHJcbiAgICAgICAgd2luZG93Wyd0J10gPSBDb3JlO1xyXG4gICAgICAgIHdpbmRvd1sndHQnXSA9IHR0O1xyXG4gICAgIFxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKEdhbWUubmFtZSlcclxuXHJcbiAgICAgICAgLy8gIOa4suafk1xyXG4gICAgICAgIHRoaXMuZW5naW5lLnJ1blJlbmRlckxvb3AoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnJlbmRlcigpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFdhdGNoIGZvciBicm93c2VyL2NhbnZhcyByZXNpemUgZXZlbnRzXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZS5yZXNpemUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRMaWdodCgpO1xyXG4gICAgICAgIC8vIHRoaXMuYWRkQm94KCk7XHJcblxyXG5cclxuICAgICAgICBCQUJZTE9OLlNjZW5lTG9hZGVyLkFwcGVuZCgnLi9yZXMvJywgJ21hamlhbmdqaWFuZy5nbGInLCB0aGlzLnNjZW5lLCAoY29udGFpbmVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWN0aXZlQ2FtZXJhID0gY29udGFpbmVyLmNhbWVyYXNbMV07XHJcbiAgICAgICAgICAgIGxldCBkZXNrID0gdGhpcy5zY2VuZS5nZXROb2RlQnlOYW1lKCdkZXNrJykgYXMgQkFCWUxPTi5NZXNoO1xyXG5cclxuICAgICAgICAgICAgbGV0IGEgPSBkZXNrLm1hdGVyaWFsIGFzIEJBQllMT04uUEJSTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICBhLnNwZWN1bGFySW50ZW5zaXR5ID0gMTsvL+mVnOmdolxyXG5cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg54mp5L2TXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkQm94KCkge1xyXG4gICAgICAgIHRoaXMuYm94ID0gQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goJ2JveCcsIHt9LCB0aGlzLnNjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOeBr+WFiVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZExpZ2h0KCkge1xyXG4gICAgICAgIGxldCBsaWdodCA9IG5ldyBCQUJZTE9OLkhlbWlzcGhlcmljTGlnaHQoXCJsaWdodDFcIiwgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAtMiksIHRoaXMuc2NlbmUpO1xyXG4gICAgICAgIGxpZ2h0LmRpZmZ1c2UgPSBuZXcgQkFCWUxPTi5Db2xvcjMoMSwgMSwgMSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cobGlnaHQpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlnLrmma8g5re75Yqg55u45py6IOetiSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSgpOiBCQUJZTE9OLlNjZW5lIHtcclxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZW5kZXJDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7IC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQgXHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlKSBhcyBCQUJZTE9OLkVuZ2luZTsgLy8gR2VuZXJhdGUgdGhlIEJBQllMT04gM0QgZW5naW5lXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBzY2VuZSBzcGFjZVxyXG4gICAgICAgIGxldCBzY2VuZSA9IG5ldyBCQUJZTE9OLlNjZW5lKHRoaXMuZW5naW5lKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGEgY2FtZXJhIHRvIHRoZSBzY2VuZSBhbmQgYXR0YWNoIGl0IHRvIHRoZSBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBCQUJZTE9OLkFyY1JvdGF0ZUNhbWVyYShcIkNhbWVyYVwiLCBNYXRoLlBJIC8gMiwgTWF0aC5QSSAvIDIsIDIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgMyksIHNjZW5lKTtcclxuICAgICAgICB0aGlzLmNhbWVyYS5hdHRhY2hDb250cm9sKGNhbnZhcywgdHJ1ZSwgdHJ1ZSk7Ly/orr7nva7nm7jmnLrmmK/lkKblj6/np7vliqhcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNhbWVyYSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHNjZW5lO1xyXG5cclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7OztJQUdBO1FBRUksbUJBQVksT0FBTztZQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO1NBQzdCO1FBRUQsMEJBQU0sR0FBTjtTQUVDO1FBQ0wsZ0JBQUM7SUFBRCxDQUFDLElBQUE7OztJQ1pEOzs7SUFHQTtRQVFJO1lBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1NBQ2hDO1FBR0Qsc0JBQUksOEJBQU87O2lCQUFYO2dCQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZEOzs7V0FBQTtRQUVELHVCQUFHLEdBQUgsVUFBTyxPQUFTO1lBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDL0I7UUFFRCwwQkFBTSxHQUFOLFVBQU8sT0FBTztZQUNWLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsMkJBQU8sR0FBUCxVQUFRLEVBQVk7WUFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixLQUFzQixVQUFVLEVBQVYsS0FBQSxJQUFJ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
