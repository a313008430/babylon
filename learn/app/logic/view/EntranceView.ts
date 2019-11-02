import Game from "../Game";
import Core from "../../core/Core";
import EventMap from "../../core/EventMap";
import Node from "../../core/Node";

export default class EntranceView {
    constructor() {
        this.init();
    }

    async init() {
        let node = await Core.node.createImage('background', './res/fangjian028.png')
        Game.rootBox.addControl(node);
        // node = await Core.node.createImage('icon', './res/fish03.png');

        let img = new BABYLON.GUI.Image('icon', './res/fish03.png');
        // img.stretch = BABYLON.GUI.Image.STRETCH_NONE;//缩放容器以适应图像大小。
        img.onImageLoadedObservable.addOnce(() => {
            img.width = img.domImage.width + 'px';
            img.height = img.domImage.height + 'px';
        })
        node.addControl(img);
        // console.log(node.('icon'))
    }
}