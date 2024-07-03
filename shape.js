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

    fall(speed) {
        this.y += speed;
        if (this.y - this.oldy >= 1) {
            this.oldy = this.y;
            return true;
        }
        return false;
    }

    moveDown() {
        for (let block of this.blocks) {
            block.moveDown();
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