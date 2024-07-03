const J_COLOR = [7, 3, 108];

class J extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(3, -2, size, J_COLOR));
        blocks.push(new Block(3, -1, size, J_COLOR));
        blocks.push(new Block(4, -1, size, J_COLOR));
        blocks.push(new Block(5, -1, size, J_COLOR));
        super(4.5, -0.5, blocks);
    }
}