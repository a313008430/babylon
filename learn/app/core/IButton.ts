import { IImage } from "./Core";

export default class IButton extends BABYLON.GUI.Button {

    /**
     * 初始化
     */
    static init(btn:BABYLON.GUI.Button) {
        let btnImage = btn.image as IImage;
        btnImage.onImageLoadedObservable.addOnce(() => {
            btnImage.width = btnImage.domImage.width + 'px';
            btnImage.height = btnImage.domImage.height + 'px';
            btn.width = btnImage.width;
            btn.height = btnImage.height;
        })
    }

    /**
     * Creates a new button made with an image and a text
     * @param name defines the name of the button
     * @param text defines the text of the button
     * @param imageUrl defines the url of the image
     * @returns a new Button
     */
    static CreateImageButton(name: string, text: string, imageUrl: string): BABYLON.GUI.Button {
        let btn = super.CreateImageButton(name, text, imageUrl);
        this.init(btn);
        return btn;
    };
    /**
     * Creates a new button made with an image
     * @param name defines the name of the button
     * @param imageUrl defines the url of the image
     * @returns a new Button
     */
    static CreateImageOnlyButton(name: string, imageUrl: string): BABYLON.GUI.Button {
        let btn = super.CreateImageOnlyButton(name, imageUrl);
        this.init(btn);
        return btn;
    };
    /**
     * Creates a new button made with a text
     * @param name defines the name of the button
     * @param text defines the text of the button
     * @returns a new Button
     */
    static CreateSimpleButton(name: string, text: string): BABYLON.GUI.Button {
        let btn = super.CreateImageOnlyButton(name, text);
        this.init(btn);
        return btn
    };
    /**
     * Creates a new button made with an image and a centered text
     * @param name defines the name of the button
     * @param text defines the text of the button
     * @param imageUrl defines the url of the image
     * @returns a new Button
     */
    static CreateImageWithCenterTextButton(name: string, text: string, imageUrl: string): BABYLON.GUI.Button {
        let btn = super.CreateImageWithCenterTextButton(name, text, imageUrl);
        this.init(btn);
        return btn
    };
}