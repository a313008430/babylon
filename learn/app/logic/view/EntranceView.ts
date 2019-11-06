import { INode, Event, IImage, IButton } from "../../core/Core";
import Game from "../Game";

export default class EntranceView {
    constructor() {
        this.init();
    }

    async init() {
        let node = new INode(),
            img = new IImage('background', './res/fangjian028.png');
        node.addControl(img);
        Game.rootBox.addControl(node);

        let btn = IButton.CreateImageOnlyButton('btn', './res/fish03.png');

        node.addControl(btn);
    }
}