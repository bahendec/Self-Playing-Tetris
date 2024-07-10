class Block {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.defaultX = x;
        this.defaultY = y;
        this.size = size;
        this.color = color;
        this.offset = 0;
    }

    draw() {
        fill(this.color);
        noStroke();
        rect((this.x * this.size) + this.offset + 1, (this.y * this.size) + 1, this.size - 2, this.size - 2);
    }

    setSize(size, offset) {
        this.size = size;
        this.offset = offset;
    }

    moveDown() {
        this.y += 1;
    }

    moveLeft() {
        this.x -= 1;
    }

    moveRight() {
        this.x += 1;
    }

    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    reset() {
        this.x = this.defaultX;
        this.y = this.defaultY;
    }
}