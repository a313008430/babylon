(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Game = factory());
}(this, function () { 'use strict';

    /**
     * 游戏逻辑
     */
    var Game = /** @class */ (function () {
        function Game() {
        }
        return Game;
    }());
    //# sourceMappingURL=Game.js.map

    /**
     * 项目入口
     */
    var App = /** @class */ (function () {
        function App() {
            var _this = this;
            this.scene = this.createScene();
            console.log(Game.name);
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
                console.log(container);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2FwcC9sb2dpYy9HYW1lLnRzIiwiLi4vYXBwL0FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29yZSBmcm9tIFwiLi4vY29yZS9Db3JlXCI7XHJcbmltcG9ydCB7IEdhbWVDb25maWcgfSBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcblxyXG4vKipcclxuICog5ri45oiP6YC76L6RXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vbG9naWMvR2FtZVwiO1xyXG5pbXBvcnQgeyBHYW1lQ29uZmlnIH0gZnJvbSBcIi4vbG9naWMvR2FtZUNvbmZpZ1wiO1xyXG5cclxuLyoqXHJcbiAqIOmhueebruWFpeWPo1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIHtcclxuXHJcbiAgICAvKiog5Zy65pmvICovXHJcbiAgICBwcml2YXRlIHNjZW5lOiBCQUJZTE9OLlNjZW5lO1xyXG4gICAgLyoqIDNk5byV5pOOICovXHJcbiAgICBwcml2YXRlIGVuZ2luZTogQkFCWUxPTi5FbmdpbmU7XHJcbiAgICAvKiog55u45py6ICovXHJcbiAgICBwcml2YXRlIGNhbWVyYTogQkFCWUxPTi5BcmNSb3RhdGVDYW1lcmE7XHJcblxyXG4gICAgcHJpdmF0ZSBib3g6IEJBQllMT04uTWVzaDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnNjZW5lID0gdGhpcy5jcmVhdGVTY2VuZSgpO1xyXG4gICAgICAgIG5ldyBHYW1lO1xyXG4gICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKEdhbWUubmFtZSlcclxuXHJcbiAgICAgICAgLy8gIOa4suafk1xyXG4gICAgICAgIHRoaXMuZW5naW5lLnJ1blJlbmRlckxvb3AoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLnJlbmRlcigpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIFdhdGNoIGZvciBicm93c2VyL2NhbnZhcyByZXNpemUgZXZlbnRzXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZS5yZXNpemUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRMaWdodCgpO1xyXG4gICAgICAgIC8vIHRoaXMuYWRkQm94KCk7XHJcblxyXG5cclxuICAgICAgICBCQUJZTE9OLlNjZW5lTG9hZGVyLkFwcGVuZCgnLi9yZXMvJywgJ21hamlhbmdqaWFuZy5nbGInLCB0aGlzLnNjZW5lLCAoY29udGFpbmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWN0aXZlQ2FtZXJhID0gY29udGFpbmVyLmNhbWVyYXNbMV07XHJcbiAgICAgICAgICAgIGxldCBkZXNrID0gdGhpcy5zY2VuZS5nZXROb2RlQnlOYW1lKCdkZXNrJykgYXMgQkFCWUxPTi5NZXNoO1xyXG5cclxuICAgICAgICAgICAgbGV0IGEgPSBkZXNrLm1hdGVyaWFsIGFzIEJBQllMT04uUEJSTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgICAgICBhLnNwZWN1bGFySW50ZW5zaXR5ID0gMTsvL+mVnOmdolxyXG5cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg54mp5L2TXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkQm94KCkge1xyXG4gICAgICAgIHRoaXMuYm94ID0gQkFCWUxPTi5NZXNoQnVpbGRlci5DcmVhdGVCb3goJ2JveCcsIHt9LCB0aGlzLnNjZW5lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOeBr+WFiVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZExpZ2h0KCkge1xyXG4gICAgICAgIGxldCBsaWdodCA9IG5ldyBCQUJZTE9OLkhlbWlzcGhlcmljTGlnaHQoXCJsaWdodDFcIiwgbmV3IEJBQllMT04uVmVjdG9yMygwLCAxLCAtMiksIHRoaXMuc2NlbmUpO1xyXG4gICAgICAgIGxpZ2h0LmRpZmZ1c2UgPSBuZXcgQkFCWUxPTi5Db2xvcjMoMSwgMSwgMSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cobGlnaHQpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlnLrmma8g5re75Yqg55u45py6IOetiSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSgpOiBCQUJZTE9OLlNjZW5lIHtcclxuICAgICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZW5kZXJDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7IC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQgXHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSBuZXcgQkFCWUxPTi5FbmdpbmUoY2FudmFzLCB0cnVlKSBhcyBCQUJZTE9OLkVuZ2luZTsgLy8gR2VuZXJhdGUgdGhlIEJBQllMT04gM0QgZW5naW5lXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBzY2VuZSBzcGFjZVxyXG4gICAgICAgIGxldCBzY2VuZSA9IG5ldyBCQUJZTE9OLlNjZW5lKHRoaXMuZW5naW5lKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGEgY2FtZXJhIHRvIHRoZSBzY2VuZSBhbmQgYXR0YWNoIGl0IHRvIHRoZSBjYW52YXNcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBCQUJZTE9OLkFyY1JvdGF0ZUNhbWVyYShcIkNhbWVyYVwiLCBNYXRoLlBJIC8gMiwgTWF0aC5QSSAvIDIsIDIsIG5ldyBCQUJZTE9OLlZlY3RvcjMoMCwgMSwgMyksIHNjZW5lKTtcclxuICAgICAgICB0aGlzLmNhbWVyYS5hdHRhY2hDb250cm9sKGNhbnZhcywgdHJ1ZSwgdHJ1ZSk7Ly/orr7nva7nm7jmnLrmmK/lkKblj6/np7vliqhcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNhbWVyYSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHNjZW5lO1xyXG5cclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBR0E7OztJQUdBO1FBRUk7U0FFQztRQUNMLFdBQUM7SUFBRCxDQUFDLElBQUE7OztJQ1JEOzs7SUFHQTtRQVdJO1lBQUEsaUJBOEJDO1lBN0JHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBR2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBOztZQUd0QixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFDdEIsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN2QixDQUFDLENBQUE7O1lBR0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtnQkFDOUIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN4QixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O1lBSWhCLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQUMsU0FBUztnQkFDM0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdkIsS0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFpQixDQUFDO2dCQUU1RCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBK0IsQ0FBQztnQkFFN0MsQ0FBQyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQzthQUUzQixDQUFDLENBQUE7U0FDTDs7OztRQUtPLG9CQUFNLEdBQWQ7WUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25FOzs7O1FBS08sc0JBQVEsR0FBaEI7WUFDSSxJQUFJLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUYsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7U0FFL0M7Ozs7UUFLTyx5QkFBVyxHQUFuQjtZQUNJLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFzQixDQUFDO1lBQzFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQW1CLENBQUM7O1lBRWpFLElBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O1lBRzNDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7WUFHOUMsT0FBTyxLQUFLLENBQUM7U0FFaEI7UUFDTCxVQUFDO0lBQUQsQ0FBQyxJQUFBOzs7Ozs7Ozs7In0=
