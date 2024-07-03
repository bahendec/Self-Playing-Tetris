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
        this.oldy += 1;
    }

    moveLeft() {
        for (let block of this.blocks) {
            block.moveLeft();
        }
        this.x -= 1;
    }

    moveRight() {
        for (let block of this.blocks) {
            block.moveRight();
        }
        this.x += 1;
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

    setPositions(pos) {
        for (let i = 0; i < this.blocks.length; i += 1) {
            this.blocks[i].setX(pos[i][0]);
            this.blocks[i].setY(pos[i][1]);
        }
    }

    rotateTestOne(clockwise) {
        // Get position of the blocks with pure rotation
        let newpos = [];
        for (let i = 0; i < this.blocks.length; i += 1) {
            let xy = [];
            let x0 = this.blocks[i].getX();
            let y0 = this.blocks[i].getY();
            if (clockwise) {
                let x1 = (-1 * (y0 - this.oldy)) + this.x;
                let y1 = x0 - this.x + this.oldy;
                xy.push(x1 - 1);
                xy.push(y1);
            } else {
                let x1 = y0 - this.oldy + this.x;
                let y1 = (-1 * (x0 - this.x)) + this.oldy;
                xy.push(x1);
                xy.push(y1 - 1);
            }
            newpos.push(xy);
        }
        return newpos;
    }
}