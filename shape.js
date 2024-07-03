class Shape {
    constructor(x, y, blocks) {
        this.x = x;
        this.y = y;
        this.oldy = y;
        this.blocks = blocks;
    }

    draw() {
        for (let block of this.blocks) {
            block.draw();
        }
    }

    setSize(size) {
        for (let block of this.blocks) {
            block.setSize(size);
        }
    }
    // Check if it's time for a fall
    fall(speed) {
        this.y += speed;
        if (this.y - this.oldy >= 1) {
            return true;
        }
        return false;
    }

    moveDown() {
        for (let block of this.blocks) {
            block.moveDown();
        }
        this.oldy = this.y;
    }

    moveLeft() {
        for (let block of this.blocks) {
            block.moveLeft();
        }
    }

    moveRight() {
        for (let block of this.blocks) {
            block.moveRight();
        }
    }

    // return a list of block positions in the shape
    getPositions() {
        let pos = [];
        for (let block of this.blocks) {
            let xy = [];
            xy.push(block.getX());
            xy.push(block.getY());
            pos.push(xy);
        }
        return pos;
    }
}