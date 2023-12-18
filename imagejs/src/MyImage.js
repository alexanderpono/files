const { loadImage } = require('canvas');
const { Image } = require('image-js');

const defaultImage = new Image(1, 1, [0, 0, 0], { kind: 'RGB' });

class MyImage {
    image = defaultImage;

    setImage = (image) => {
        this.image = image;
        return this;
    };
    getImage = () => this.image;

    static createOfSize(size) {
        const data = new Uint8Array(size.x * size.y * 3);
        data.fill(0);

        const image = new Image(size.x, size.y, data, { kind: 'RGB' });
        return new MyImage().setImage(image);
    }

    static async createFromFile(fileName) {
        const pic = await loadImage(fileName);

        const myImage = MyImage.createOfSize({ x: pic.width, y: pic.height });
        const myCanvas = myImage.getImage().getCanvas();
        const context = myCanvas.getContext('2d');
        context.drawImage(pic, 0, 0, pic.width, pic.height, 0, 0, pic.width, pic.height);

        myImage.setImage(Image.fromCanvas(myCanvas));
        return myImage;
    }

    copyArea = (src, from, to, size) => {
        const myCanvas = this.image.getCanvas();
        const context = myCanvas.getContext('2d');
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

    save = (fileName) => {
        return this.image.save(fileName).then(() => {
            return this;
        });
    };

    createCropped = (pos, size) => {
        let cropped = this.image
            .clone()
            .crop({ x: pos.x, y: pos.y, width: size.x, height: size.y });
        return MyImage.createOfSize({ x: this.image.width, y: this.image.height }).setImage(
            cropped
        );
    };
}

module.exports = {
    MyImage
};
