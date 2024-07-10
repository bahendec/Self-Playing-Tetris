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

    setSize(size, offset) {
        for (let block of this.blocks) {
            block.setSize(size, offset);
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

    getLength() {
        return this.blocks.length;
    }

    moveDown(below) {
        for (let block of this.blocks) {
            if (block.getY() < below) {
                block.moveDown();
            }
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

    // Delete blocks in given spots in blocks array
    deleteBlocks(spots) {
        let count = 0;
        for (let loc of spots) {
            this.blocks.splice(loc - count, 1);
            count += 1;
        }
    }

    setPositions(pos) {
        for (let i = 0; i < this.blocks.length; i += 1) {
            this.blocks[i].setX(pos[i][0]);
            this.blocks[i].setY(pos[i][1]);
        }
    }

    shift(pos, right, up) {
        let ret = [];
        for (let xy of pos) {
            let temp = [];
            temp.push(xy[0] + right);
            temp.push(xy[1] + up);
            ret.push(temp);
        }
        return ret;
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

    rotateTestTwo(state, clockwise, pos) {
        if (state == 0) {
            if (clockwise) {
                // left one
                return this.shift(pos, -1, 0);
            } else {
                // right one
                return this.shift(pos, 1, 0);
            }
        } else if (state == 1) {
            // right one
            return this.shift(pos, 1, 0);
        } else if (state == 2) {
            if (clockwise) {
                // right one
                return this.shift(pos, 1, 0);
            } else {
                // left one
                return this.shift(pos, -1, 0);
            }
        } else {
            // left one
            return this.shift(pos, -1, 0);
        }
    }

    rotateTestThree(state, clockwise, pos) {
        if (state == 0) {
            if (clockwise) {
                // left one up one
                return this.shift(pos, -1, 1);
            } else {
                // right one up one
                return this.shift(pos, 1, 1);
            }
        } else if (state == 1) {
            // right one down one
            return this.shift(pos, 1, -1);
        } else if (state == 2) {
            if (clockwise) {
                // right one up one
                return this.shift(pos, 1, 1);
            } else {
                // left one up one
                return this.shift(pos, -1, 1);
            }
        } else {
            // left one down one
            return this.shift(pos, -1, -1);
        }
    }

    rotateTestFour(state, clockwise, pos) {
        switch(state) {
            case 0:
                // down two
                return this.shift(pos, 0, -2);
            case 1:
                // up two
                return this.shift(pos, 0, 2);
            case 2:
                // down two
                return this.shift(pos, 0, -2);
            case 3:
                // up two
                return this.shift(pos, 0, 2);
        }
    }

    rotateTestFive(state, clockwise, pos) {
        switch(state) {
            case 0:
                if (clockwise) {
                    // left one down 2
                    return this.shift(pos, -1, -2);
                } else {
                    // right one down 2
                    return this.shift(pos, 1, -2);
                }
            case 1:
                // right one up two
                return this.shift(pos, 1, 2);
            case 2:
                if (clockwise) {
                    // right one down two
                    return this.shift(pos, 1, -2);
                } else {
                    // left one down two
                    return this.shift(pos, -1, -2);
                }
            case 3:
                // left one down two
                return this.shift(pos, -1, -2);
        }
    }

    setNext() {
        for (let block of this.blocks) {
            block.setX(block.getX() + 8);
            block.setY(block.getY() + 3.5);
        }
    }

    setGrid() {
        for (let block of this.blocks) {
            block.setX(block.getX() - 8);
            block.setY(block.getY() - 3.5);
        }
    }
}