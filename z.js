Z_COLOR = [205, 19, 10];

class Z extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(3, -2, size, Z_COLOR));
        blocks.push(new Block(4, -2, size, Z_COLOR));
        blocks.push(new Block(4, -1, size, Z_COLOR));
        blocks.push(new Block(5, -1, size, Z_COLOR));
        super(4.5, -0.5, blocks);
        this.type = 'z';
    }
}