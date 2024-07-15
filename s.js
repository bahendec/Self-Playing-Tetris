const S_COLOR = [48, 223, 2];

class S extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(4, -2, size, S_COLOR));
        blocks.push(new Block(5, -2, size, S_COLOR));
        blocks.push(new Block(4, -1, size, S_COLOR));
        blocks.push(new Block(3, -1, size, S_COLOR));
        super(4.5, -0.5, blocks);
        this.type = 's';
    }
}