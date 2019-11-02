import Component from "./Component";
import ImageT from "./Image";

export default class Node extends Component {
    /**  */
    constructor() {
        super();

        // 容器适应其子代的大小：
        this.adaptHeightToChildren = true;
        this.adaptWidthToChildren = true;
        
        console.log(ImageT)
    }

    /**
     * 创建图片节点
     */
    createImage(name?: string | undefined, url?: BABYLON.Nullable<string>): Promise<Node> {
        let img = new BABYLON.GUI.Image(name, url);
        this.name = name;
        // img.stretch = BABYLON.GUI.Image.STRETCH_NONE;//缩放容器以适应图像大小。
        this.addControl(img);
        return new Promise((resolve) => {
            img.onImageLoadedObservable.addOnce(() => {
                img.width = img.domImage.width + 'px';
                img.height = img.domImage.height + 'px';
                resolve(this);
            })
        });
    }

    static  createImage(name?: string | undefined, url?: BABYLON.Nullable<string>): Promise<Node> {
        let node = new Node();
        return node.createImage(name, url);
    }
}