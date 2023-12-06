import { loadImage } from 'canvas';
import { Image, ImageKind } from 'image-js';

const defaultImage = new Image(1, 1, [0, 0, 0], { kind: 'RGB' as ImageKind });

export interface Point2D {
    x: number;
    y: number;
}
export const defaultPoint2D: Point2D = {
    x: 0,
    y: 0
};

export class MyImage {
    private image: Image = defaultImage;

    setImage = (image: Image) => {
        this.image = image;
        return this;
    };
    getImage = () => this.image;

    static createOfSize(size: Point2D): MyImage {
        const data = new Uint8Array(size.x * size.y * 3);
        data.fill(0);

        const image = new Image(size.x, size.y, data, { kind: 'RGB' as ImageKind });
        return new MyImage().setImage(image);
    }

    static async createFromFile(fileName: string): Promise<MyImage> {
        const pic = await loadImage(fileName);

        const myImage = MyImage.createOfSize({ x: pic.width, y: pic.height });
        const myCanvas = myImage.getImage().getCanvas();
        const context = myCanvas.getContext('2d') as unknown as CanvasRenderingContext2D;
        context.drawImage(
            pic as unknown as CanvasImageSource,
            0,
            0,
            pic.width,
            pic.height,
            0,
            0,
            pic.width,
            pic.height
        );

        myImage.setImage(Image.fromCanvas(myCanvas));
        return myImage;
    }

    copyArea = (src: MyImage, from: Point2D, to: Point2D, size: Point2D) => {
        const myCanvas = this.image.getCanvas();
        const context = myCanvas.getContext('2d') as unknown as CanvasRenderingContext2D;
        context.drawImage(
            src.getImage().getCanvas(),
            from.x,
            from.y,
            size.x,
            size.y,
            to.x,
            to.y,
            size.x,
            size.y
        );

        this.setImage(Image.fromCanvas(myCanvas));

        return this;
    };

    save = (fileName: string): Promise<MyImage> => {
        return this.image.save(fileName).then(() => {
            return this;
        });
    };

    createCropped = (pos: Point2D, size: Point2D): MyImage => {
        let cropped = this.image
            .clone()
            .crop({ x: pos.x, y: pos.y, width: size.x, height: size.y });
        return MyImage.createOfSize({ x: this.image.width, y: this.image.height }).setImage(
            cropped
        );
    };
}
