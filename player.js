class Player {
    constructor () {
        this.matrix;
        this.active;
        this.hold;
        this.next;
        this.active_type;
    }

    setGameState(matrix, active, active_type, hold, next) {
        this.matrix = matrix;
        this.active = active;
        this.active_type = active_type;
        this.hold = hold;
        this.next = next;
    }

    evaluate(matrix) {
        return 100000;
    }

    generateInstructions() {
        let rotations = [[], ['u'], ['u', 'u'], ['x']];
        let minScore = [100000, []];
        for (let rot of rotations) {
            let score;
            // make rotations
            this.makeRotations(rot);
            // neutral drop
            // drop
            let matrix_gameOver = this.drop();
            // evaluate
            // if the game is over give bad score, otherwise evaluate
            if (matrix_gameOver[1]) {
                score = [99999, rot]
            } else {
                score = this.evaluate(matrix_gameOver[0]);
            }
            if (score < minScore[0]) {
                minScore = [score, rot];
            }
            // while can move left iteratively move left and drop and evaluate
            // same with right
            // save min evaluation and instructions 

            this.active.setPositions(pos);
        }
    }

    makeRotations(rot) {
        // make rotations
        for (let turn of rot) {
            switch (turn) {
                case 'u':
                    this.rotate(true);
                    break;
                case 'x':
                    this.rotate(false);
                    break;
            }
        }
    }

    drop() {
        // drop active and return matrix
        let matrix = this.matrix;
        let isGameOver = false;
        // keep moving down until collision
        while (true) {
            if (this.dropCollisionCheck() == false) {
                this.active.moveDown(20);
            } else {
                break;
            }
        }
        // add active new position to matrix and return
        let pos = this.active.getPositions();
        for (let xy of pos) {
            if (xy[1] >= 0) {
                matrix[xy[1]][xy[0]] = 1;
            } else {
                isGameOver = true
            }
        }
        return [matrix, isGameOver];
    }

    dropCollisionCheck() {
        let pos = this.active.getPositions();
        for (let xy of pos) {
            if (xy[1] >= 19) {
                // collision with bottom of grid
                return true;
            } else if (xy[1] >= -1 && this.matrix[xy[1] + 1][xy[0]] == 1) {
                // collision with inactive piece
                return true;
            }
        }
        return false;
    }

    rotationCollisionCheck(pos) {
        for (let xy of pos) {
            // Check for oob collision
            if (xy[0] < 0 || xy[0] > 9 || xy[1] > 19 || xy[1] < -2) {
                return true
            }
            // Check block collisions
            if (xy[1] >= 0 && this.matrix[xy[1]][xy[0]] == 1) {
                return true;
            }
        }
        return false;
    }

    rotate(clockwise) {
        // Get new rotation state
        let temp_rotationState = 0;
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
        let test3 = this.active.rotateTestThree(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test3) == false) {
            this.active.setPositions(test3);
            return;
        }
        let test4 = this.active.rotateTestFour(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test4) == false) {
            this.active.setPositions(test4);
            return;
        }
        let test5 = this.active.rotateTestFive(this.rotationState, clockwise, test1);
        if (this.rotationCollisionCheck(test5) == false) {
            this.active.setPositions(test5);
            return;
        }
    }
}