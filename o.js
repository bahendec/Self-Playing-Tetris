const O_COLOR = [255, 255, 0];

class O extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(4, -2, size, O_COLOR));
        blocks.push(new Block(4, -1, size, O_COLOR));
        blocks.push(new Block(5, -2, size, O_COLOR));
        blocks.push(new Block(5, -1, size, O_COLOR));

        super(5, -1, blocks);
    }

    setNext() {
        for (let block of this.blocks) {
            block.setX(block.getX() + 7.5);
            block.setY(block.getY() + 3.5);
        }
    }
}