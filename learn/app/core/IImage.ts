
export default class IImage extends BABYLON.GUI.Image {

    /** 加载完成 */

    constructor(name?: string | undefined, url?: BABYLON.Nullable<string>) {
        super(name, url);

        //加载完成
        this.onImageLoadedObservable.addOnce(() => {
            this.width = this.domImage.width + 'px';
            this.height = this.domImage.height + 'px';
        })
    }

    /**
     * 图片加载
     */
    onLoad(): Promise<IImage> {
        return new Promise((resolve) => {
            //加载完成
            this.onImageLoadedObservable.addOnce(() => {
                resolve(this);
            })
        })
    }

}