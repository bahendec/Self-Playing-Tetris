const FALL_SPEED = 1/20; // Grid/frame

class Grid {
    constructor() {
        this.matrix = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

        this.shapes = [];
        this.hasActivePiece = false;
        this.active = 0;
        this.hasNext = false;
        this.next;
        this.size = 0;
        this.rotationState = 0;
    }

    setShapes(shapes) {
        this.shapes = shapes;
    }

    setSize(size) {
        for (let shape of this.shapes) {
            shape.setSize(size);
        }
        if (this.hasActivePiece) {
            this.active.setSize(size);
        }
        this.size = size;
    }
    // Determine if a collision will occur if the active piece moves down one space
    fallingCollisionCheck(pos) {
        for (let xy of pos) {
            // Check for bottom collision
            if (xy[1] == 19) {
                return true;
            } else if (xy[1] + 1 > -1 && this.matrix[xy[1] + 1][xy[0]] == 1) {
                // Check for collision with a non-active piece
                return true;
            }
        }
        return false;
    }

    addToMatrix(pos) {
        for (let xy of pos) {
            this.matrix[xy[1]][xy[0]] = 1;
        }
    }

    clearedLines() {
        let rows = [];
        for (let row = 0; row < 20; row += 1) {
            let isClear = true;
            for (let col = 0; col < 10; col += 1) {
                if (this.matrix[row][col] == 0) {
                    isClear = false;
                    break;
                }
            }
            if (isClear) {
                rows.push(row);
            }
        }
        return rows;
    }

    clearLines(rows) {
        for (let row of rows) {
            // remove line from matrix
            this.matrix.splice(row, 1);
            this.matrix.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            // remove blocks from shapes
            let deleted_shapes = this.removeDeletedBlocks(row);
            // remove deleted shapes
            let count = 0;
            for (let shape of deleted_shapes) {
                this.shapes.splice(shape - count, 1);
                count += 1;
            }
            // Move blocks below (visually above) row down
            this.moveDown(row);
        }
    }

    // Remove blocks in given row from shapes. Return shapes with no more blocks.
    removeDeletedBlocks(row) {
        let deleted_shapes = [];
        // check every shape
        for (let i = 0; i < this.shapes.length; i += 1) {
            let deleted_block_pos = [];
            // check block positions
            let pos = this.shapes[i].getPositions();
            let j = 0;
            for (let xy of pos) {
                // if a block is on a deleted row add to array
                if (xy[1] == row) {
                    deleted_block_pos.push(j);
                }
                j += 1;
            }
            // give array to shape to delete blocks
            this.shapes[i].deleteBlocks(deleted_block_pos);
            // if shape has no more blocks then add its position into the return array
            if (this.shapes[i].getLength() == 0) {
                deleted_shapes.push(i);
            }
        }
        return deleted_shapes;
    }

    update() {
        // Create active piece if there is no active piece
        if (this.hasActivePiece == false) {
            if (this.hasNext == false) {
                this.active = this.getNextPiece();
                this.hasActivePiece = true
                this.next = this.getNextPiece();
                this.next.setNext();
                this.hasNext = true;
            } else {
                this.next.setGrid();
                this.active = this.next;
                this.hasActivePiece = true;
                this.next = this.getNextPiece();
                this.next.setNext();
            }
        }
        // Move active piece down
        if (this.active.fall(FALL_SPEED)) {
            // Make sure there is no falling collision
            let pos = this.active.getPositions();
            if (this.fallingCollisionCheck(pos) == false) {
                this.active.moveDown(20);
            } else {
                this.shapes.push(this.active);
                // Check if the game has ended before adding: Do later
                this.addToMatrix(pos);
                this.hasActivePiece = false;
                // Get cleared lines and remove them
                let clearedLines = this.clearedLines();
                this.clearLines(clearedLines);
            }
        }
    }

    draw() {
        if (this.hasActivePiece == true) {
            this.active.draw();
        }
        for (let shape of this.shapes) {
            shape.draw();
        }
    }

    checkLeftCollsion() {
        let pos = this.active.getPositions();
        for (let xy of pos) {
            // Check for wall collision
            if (xy[0] == 0) {
                return true;
            } else if (this.matrix[xy[1]][xy[0] - 1] == 1) {
                // Check block collsions
                return true;
            }
        }
        return false;
    }

    checkRightCollsion() {
        let pos = this.active.getPositions();
        for (let xy of pos) {
            // Check for wall collision
            if (xy[0] == 9) {
                return true;
            } else if (this.matrix[xy[1]][xy[0] + 1] == 1) {
                // Check block collisions
                return true;
            }
        }
        return false;
    }

    moveLeft() {
        if (this.checkLeftCollsion() == false) {
            this.active.moveLeft();
        }
    }

    moveRight() {
        if (this.checkRightCollsion() == false) {
            this.active.moveRight();
        }
    }

    // Move down blocks below (visually above) a certain row
    moveDown(below) {
        for (let shape of this.shapes) {
            shape.moveDown(below);
        }
    }

    getNextPiece() {
        let rand = floor(random()*7);
        let shape;
        switch(rand) {
            case 0:
                shape = new O(this.size);
                break;
            case 1:
                shape = new Line(this.size);
                break;
            case 2:
                shape = new J(this.size);
                break;
            case 3:
                shape = new L(this.size);
                break;
            case 4:
                shape = new S(this.size);
                break;
            case 5:
                shape = new Z(this.size);
                break;
            case 6:
                shape = new T(this.size);
                break;
        }
        this.rotationState = 0;
        return shape;
    }

    rotationCollisionCheck(pos) {
        for (let xy of pos) {
            // Check for oob collision
            if (xy[0] < 0 || xy[0] > 9 || xy[1] > 19) {
                return true
            }
            // Check block collisions
            if (this.matrix[xy[1]][xy[0]] == 1) {
                return true;
            }
        }
        return false;
    }

    rotate(clockwise) {
        // Get new rotation state
        let temp_rotationState = this.rotationState;
        if (clockwise) {
            temp_rotationState += 1;
        } else {
            temp_rotationState -= 1;
        }
        temp_rotationState = (temp_rotationState % 4);
        if (temp_rotationState == -1) {
            temp_rotationState = 3;
        }
        let test1 = this.active.rotateTestOne(clockwise);
        if (this.rotationCollisionCheck(test1) == false) {
            this.active.setPositions(test1);
            this.rotationState = temp_rotationState;
            return;
        } 
        // SRS begin
        let test2 = this.active.rotateTestTwo(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test2) == false) {
            this.active.setPositions(test2);
            this.rotationState = temp_rotationState;
            return;
        }
        let test3 = this.active.rotateTestThree(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test3) == false) {
            this.active.setPositions(test3);
            this.rotationState = temp_rotationState;
            return;
        }
        let test4 = this.active.rotateTestFour(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test4) == false) {
            this.active.setPositions(test4);
            this.rotationState = temp_rotationState;
            return;
        }
        let test5 = this.active.rotateTestFive(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test5) == false) {
            this.active.setPositions(test5);
            this.rotationState = temp_rotationState;
            return;
        }
    }

    hasNextPiece() {
        return this.hasNext;
    }
    getNext() {
        return this.next;
    }
    isActivePiece() {
        return this.hasActivePiece;
    }
}