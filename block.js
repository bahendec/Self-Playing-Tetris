class Block {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw() {
        fill(this.color);
        noStroke();
        rect((this.x * this.size) + 1, (this.y * this.size) + 1, this.size - 2, this.size - 2);
    }

    setSize(size) {
        this.size = size;
    }

    moveDown() {
        this.y += 1;
    }
}