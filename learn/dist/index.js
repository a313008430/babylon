(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.App = factory());
}(this, function () { 'use strict';

    /**
     * 项目入口
     */
    var App = /** @class */ (function () {
        function App() {
            var _this = this;
            this.scene = this.createScene();
            //  渲染
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
            // Watch for browser/canvas resize events
            window.addEventListener("resize", function () {
                _this.engine.resize();
            });
            this.addLight();
            this.addBox();
        }
        /**
         * 添加物体
         */
        App.prototype.addBox = function () {
            BABYLON.MeshBuilder.CreateBox('box', {}, this.scene);
        };
        /**
         * 添加灯光
         */
        App.prototype.addLight = function () {
            new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this.scene);
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
            this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 1, 5), scene);
            this.camera.attachControl(canvas, true);
            return scene;
        };
        return App;
    }());

    return App;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2FwcC9BcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOmhueebruWFpeWPo1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIHtcclxuXHJcbiAgICAvKiog5Zy65pmvICovXHJcbiAgICBwcml2YXRlIHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xyXG4gICAgLyoqIDNk5byV5pOOICovXHJcbiAgICBwcml2YXRlIGVuZ2luZTogQkFCWUxPTi5FbmdpbmU7XHJcbiAgICAvKiog55u45py6ICovXHJcbiAgICBwcml2YXRlIGNhbWVyYTpCQUJZTE9OLkFyY1JvdGF0ZUNhbWVyYTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNjZW5lID0gdGhpcy5jcmVhdGVTY2VuZSgpO1xyXG5cclxuICAgICAgICAvLyAg5riy5p+TXHJcbiAgICAgICAgdGhpcy5lbmdpbmUucnVuUmVuZGVyTG9vcCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUucmVuZGVyKCk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gV2F0Y2ggZm9yIGJyb3dzZXIvY2FudmFzIHJlc2l6ZSBldmVudHNcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZS5yZXNpemUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRMaWdodCgpO1xyXG4gICAgICAgIHRoaXMuYWRkQm94KCk7XHJcbiAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOeJqeS9k1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZEJveCgpe1xyXG4gICAgICAgIEJBQllMT04uTWVzaEJ1aWxkZXIuQ3JlYXRlQm94KCdib3gnLCB7fSwgdGhpcy5zY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDnga/lhYlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRMaWdodCgpe1xyXG4gICAgICAgIG5ldyBCQUJZTE9OLkhlbWlzcGhlcmljTGlnaHQoXCJsaWdodDFcIiwgbmV3IEJBQllMT04uVmVjdG9yMygxLCAxLCAwKSwgdGhpcy5zY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlnLrmma8g5re75Yqg55u45py6IOetiSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSgpOiBCQUJZTE9OLlNjZW5lIHtcclxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZW5kZXJDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7IC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQgXHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlKSBhcyBCQUJZTE9OLkVuZ2luZTsgLy8gR2VuZXJhdGUgdGhlIEJBQllMT04gM0QgZW5naW5lXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBzY2VuZSBzcGFjZVxyXG4gICAgICAgIGxldCBzY2VuZSA9IG5ldyBCQUJZTE9OLlNjZW5lKHRoaXMuZW5naW5lKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGEgY2FtZXJhIHRvIHRoZSBzY2VuZSBhbmQgYXR0YWNoIGl0IHRvIHRoZSBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBCQUJZTE9OLkFyY1JvdGF0ZUNhbWVyYShcIkNhbWVyYVwiLCBNYXRoLlBJIC8gMiwgTWF0aC5QSSAvIDIsIDIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgNSksIHNjZW5lKTtcclxuICAgICAgICB0aGlzLmNhbWVyYS5hdHRhY2hDb250cm9sKGNhbnZhcywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuXHJcbiAgICB9XHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7OztJQUdBO1FBU0k7WUFBQSxpQkFnQkM7WUFmRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7WUFHaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7Z0JBQ3RCLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDdkIsQ0FBQyxDQUFBOztZQUdGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7Z0JBQzlCLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDeEIsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUVqQjs7OztRQUtPLG9CQUFNLEdBQWQ7WUFDSSxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4RDs7OztRQUtPLHNCQUFRLEdBQWhCO1lBQ0ksSUFBSSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwRjs7OztRQUtPLHlCQUFXLEdBQW5CO1lBQ0ksSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQXNCLENBQUM7WUFDMUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBbUIsQ0FBQzs7WUFFakUsSUFBSSxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7WUFHM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0SCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFeEMsT0FBTyxLQUFLLENBQUM7U0FFaEI7UUFDTCxVQUFDO0lBQUQsQ0FBQyxJQUFBOzs7Ozs7OzsifQ==
