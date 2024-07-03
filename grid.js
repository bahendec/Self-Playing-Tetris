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
        this.next = 0;
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

    update() {
        // Create active piece if there is no active piece
        if (this.hasActivePiece == false) {
            if (this.hasNext == false) {
                this.active = this.getNextPiece();
                this.hasActivePiece = true
                this.next = this.getNextPiece();
                this.hasNext = true;
            } else {
                this.active = this.next;
                this.hasActivePiece = true;
                this.next = this.getNextPiece();
            }
        }
        // Move active piece down
        if (this.active.fall(FALL_SPEED)) {
            // Make sure there is no falling collision
            let pos = this.active.getPositions();
            if (this.fallingCollisionCheck(pos) == false) {
                this.active.moveDown();
            } else {
                this.shapes.push(this.active);
                // Check if the game has ended before adding: Do later
                this.addToMatrix(pos);
                this.hasActivePiece = false;
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

    moveDown() {
        for (let shape of this.shapes) {
            shape.moveDown();
        }
    }

    getNextPiece() {
        let rand = floor(random()*7);
        let shape = 0;
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
            return;
        } 
        // SRS begin
        let test2 = this.active.rotateTestTwo(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test2) == false) {
            this.active.setPositions(test2);
            return;
        }
    }
}