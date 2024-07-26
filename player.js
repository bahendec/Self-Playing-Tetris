const HEIGHT_WEIGHT = 1;
const HOLE_WEIGHT = 1.25;
const HEIGHT_BASE = 1.3;
const EMPTY_STACK_WEIGHT = 0.75;
const EXTRA_COL_HEIGHT_WEIGHT = 2.25;

class Player {
    constructor () {
        this.matrix;
        this.active;
        this.hold;
        this.next;
        this.active_type;
        this.rotationState;
        this.canHold;
        this.hasHeld;
    }

    setGameState(matrix, active, active_type, hold, canHold, hasHeld, next) {
        this.matrix = matrix;
        this.active = active;
        this.active_type = active_type;
        this.hold = hold;
        this.canHold = canHold;
        this.hasHeld = hasHeld;
        this.next = next;
        this.rotationState = 0;
    }

    getInstructions() {
        return this.generateInstructions(false);
    }

    evaluate(matrix) {
        // cleared lines
        let clearedLines = [];
        // get height of matrix
        let height = 0;
        // true when height (without clears) is calculated
        let done = false;
        for (let i = 0; i < 20; i+=1) {
            let canBeClear = true;
            for (let square of matrix[i]) {
                if (square == 1) {
                    if (done == false) {
                        done = true;
                        height = 20 - i;
                    }
                } else if (canBeClear) {
                    canBeClear = false;
                }
            }
            // if line is clear subtract from height
            if (canBeClear) {
                height -= 1;
                clearedLines.push(i);
            }
        }
        // get number of holes
        let holeScore = 0;
        // number of empty pillars
        let pillarCount = 1;
        for (let i = 0; i < 10; i+=1) {
            let degree = 0;
            let onEmpty = false;
            let pillarSize = 1;
            for (let j = 19; j >= 0; j-=1) {
                if (clearedLines.includes(j)) {
                    // line is cleared skip it
                } else if (matrix[j][i] == 0) {
                    if (degree > 0) {
                        // if empty on top of closed hole reset degree
                        holeScore += degree * pillarSize * EMPTY_STACK_WEIGHT + (19-j)/4 + (pillarCount - 1);
                        degree = 0;
                        pillarSize = 1;
                        pillarCount += 1;
                    } else if (onEmpty) {
                        // if forming a pillar of empties 
                        pillarSize += 1;
                    } else {
                        // if empty is on top of nothing
                        onEmpty = true;
                    }
                } else {
                    if (onEmpty) {
                        degree += 1;
                    }
                }
            }
            if (matrix[0][i] == 1) {
                holeScore += degree * pillarSize * EMPTY_STACK_WEIGHT + 19/4 + (pillarCount - 1);
            }
        }
        // line columns
        // height of other cols besides largest
        let other_col_extra_height = 0;
        // highest col
        let max_col = 0;
        for (let i = 0; i < 10; i+=1) {
            let col_height = 0;
            let onCol = false;
            for (let j = 19; j >= 0; j-=1) {
                if (clearedLines.includes(j)) {
                    // skip cleared lines
                } else if (matrix[j][i] == 0) {
                    // if square is empty
                    // must be enclosed to count in col
                    if ((i == 0 || matrix[j][i-1] == 1) && (i == 9 || matrix[j][i+1] == 1)) {
                        col_height += 1;
                        onCol = true;
                    } else {
                        // col has ended or didnt exist
                        if (col_height > 2) {
                            if (col_height > max_col) {
                                other_col_extra_height += max_col;
                                max_col = col_height;
                            } else {
                                other_col_extra_height += col_height;
                            }
                        }
                        col_height = 0;
                        onCol = false;
                    }
                }
            }
        }
        let col_score = other_col_extra_height * EXTRA_COL_HEIGHT_WEIGHT;
        // average height
        let pos = this.active.getPositions();
        let height_sum = 0;
        let height_count = 0;
        for (let xy of pos) {
            if (clearedLines.includes(19 - xy[1])) {
                // do not count cleared blocks
            } else {
                height_sum += 19 - xy[1];
                height_count += 1;
            }
        }
        let avg_height = 0;
        if (height_count != 0) {
            avg_height = height_sum/height_count;
        }
        return (HEIGHT_BASE ** (height * HEIGHT_WEIGHT)) + (holeScore * HOLE_WEIGHT) + col_score + avg_height;
    }

    generateInstructions(forHold) {
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
        if (forHold) {
            return minScore;
        }
        return this.generateHoldInstructions(minScore);
    }

    generateHoldInstructions(minScore) {
        if (this.canHold) {
            this.doHold();

            let score = this.generateInstructions(true);
            if (score[0] < minScore[0]) {
                score[1].unshift('c');
                minScore = [score[0], score[1]];
            }

            // set shapes back to positions
            if (this.hasHeld) {
                this.active.setHold();
            } else {
                this.active.setNext();
            }
        }
        return minScore[1];
    }

    doHold() {
        if (this.hasHeld) {
            this.hold.reset();
            this.active = this.hold;
            this.rotationState = 0;
        } else {
            this.next.reset();
            this.active = this.next;
        }
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