class Player {
    constructor () {
        this.matrix;
        this.active;
        this.hold;
        this.next;
        this.active_type;
        this.rotationState;
    }

    setGameState(matrix, active, active_type, hold, next) {
        this.matrix = matrix;
        this.active = active;
        this.active_type = active_type;
        this.hold = hold;
        this.next = next;
        this.rotationState = 0;
    }

    evaluate(matrix) {
        let score = 0;
        // get height of matrix
        let height = 0;
        let done = false;
        // currently doesnt check cleared lines redo later
        for (let i = 0; i < 20; i+=1) {
            for (let square of matrix[i]) {
                if (square == 1) {
                    done = true;
                    height = 20 - i;
                    break;
                }
            }
            if (done) {
                break;
            }
        }
        // get number of holes
        return height;
    }

    generateInstructions() {
        let rotations = [[], ['u'], ['u', 'u'], ['x']];
        let minScore = [100000, []];
        for (let rot of rotations) {
            // neutral drop
            // make rotations
            this.makeRotations(rot);
            minScore = this.dropEval(minScore, rot);
            // while can move left iteratively move left and drop and evaluate
            let count = 1;
            let condition = true;
            while (condition) {
                let instructs = [...rot];
                if (this.canMove(true)) {
                    // make rotations
                    this.makeRotations(rot);
                }
                for (let i = 0; i < count; i+=1) {
                    if (this.canMove(true)) {
                        instructs.push('l');
                        this.active.moveLeft();
                    } else {
                        condition = false;
                    }
                }
                if (condition) {
                    minScore = this.dropEval(minScore, instructs);
                    count += 1;
                }
            }
            this.active.reset();
            // same with right
            count = 1;
            condition = true;
            while (condition) {
                let instructs = [...rot];
                if (this.canMove(false)) {
                    // make rotations
                    this.makeRotations(rot);
                }
                for (let i = 0; i < count; i+=1) {
                    if (this.canMove(false)) {
                        instructs.push('r');
                        this.active.moveRight();
                    } else {
                        condition = false;
                    }
                }
                if (condition) {
                    minScore = this.dropEval(minScore, instructs);
                    count += 1;
                }
            }
            this.active.reset();
        }
        return minScore[1];
    }

    makeRotations(rot) {
        // make rotations
        this.rotationState = 0;
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

    dropEval(minScore, instructs) {
        let score;
        // drop
        let matrix_gameOver = this.drop();
        // evaluate
        // if the game is over give bad score, otherwise evaluate
        if (matrix_gameOver[1]) {
            score = [99999, instructs]
        } else {
            score = this.evaluate(matrix_gameOver[0]);
        }
        if (score < minScore[0]) {
            minScore = [score, instructs];
        }
        this.active.reset();
        return minScore;
    }

    drop() {
        // drop active and return matrix
        let matrix = this.matrix.map(innerArray => [...innerArray]);
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

    canMove(left) {
        let pos = this.active.getPositions();
        for (let xy of pos) {
            if (left) {
                if (xy[0] == 0) {
                    return false;
                } else if (xy[1] >= 0 && this.matrix[xy[1]][xy[0] - 1] == 1) {
                    return false;
                }
            } else {
                if (xy[0] == 9) {
                    return false;
                } else if (xy[1] >= 0 && this.matrix[xy[1]][xy[0] + 1] == 1) {
                    return false;
                }
            }
        }
        return true;
    }
}