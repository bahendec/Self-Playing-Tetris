const LINE_COLOR = [14, 166, 236];

class Line extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(3, -1, size, LINE_COLOR));
        blocks.push(new Block(4, -1, size, LINE_COLOR));
        blocks.push(new Block(5, -1, size, LINE_COLOR));
        blocks.push(new Block(6, -1, size, LINE_COLOR));
        super(5, 0, blocks);
    }
}