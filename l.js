const L_COLOR = [229, 156, 22];

class L extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(5, -2, size, L_COLOR));
        blocks.push(new Block(5, -1, size, L_COLOR));
        blocks.push(new Block(4, -1, size, L_COLOR));
        blocks.push(new Block(3, -1, size, L_COLOR));
        super(4.5, -0.5, blocks);
        this.type = 'l';
    }
}