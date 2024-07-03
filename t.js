const T_COLOR = [102, 7, 168];

class T extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(4, -2, size, T_COLOR));
        blocks.push(new Block(3, -1, size, T_COLOR));
        blocks.push(new Block(4, -1, size, T_COLOR));
        blocks.push(new Block(5, -1, size, T_COLOR));
        super(4.5, -0.5, blocks);
    }
}