const LINE_COLOR = [14, 166, 236];

class Line extends Shape {
    constructor(size) {
        let blocks = [];
        blocks.push(new Block(3, -1, size, LINE_COLOR));
        blocks.push(new Block(4, -1, size, LINE_COLOR));
        blocks.push(new Block(5, -1, size, LINE_COLOR));
        blocks.push(new Block(6, -1, size, LINE_COLOR));
        super(5, 0, blocks);
    }

    rotateTestTwo(state, clockwise, pos) {
        if (state == 0) {
            if (clockwise) {
                // left two
                return this.shift(pos, -2, 0);
            } else {
                // left one
                return this.shift(pos, -1, 0);
            }
        } else if (state == 1) {
            if (clockwise) {
                // left one
                return this.shift(pos, -1, 0);
            } else {
                // right two
                return this.shift(pos, 2, 0);
            }
        } else if (state == 2) {
            if (clockwise) {
                // right two
                return this.shift(pos, 2, 0);
            } else {
                // right one
                return this.shift(pos, 1, 0);
            }
        } else {
            if (clockwise) {
                // right one
                return this.shift(pos, 1, 0);
            } else {
                // left two
                return this.shift(pos, -2, 0);
            }
        }
    }

    rotateTestThree(state, clockwise, pos) {
        if (state == 0) {
            if (clockwise) {
                // right one
                return this.shift(pos, 1, 0);
            } else {
                // right two
                return this.shift(pos, 2, 0);
            }
        } else if (state == 1) {
            if (clockwise) {
                // right two
                return this.shift(pos, 2, 0);
            } else {
                // left one
                return this.shift(pos, -1, 0);
            }
        } else if (state == 2) {
            if (clockwise) {
                // left one
                return this.shift(pos, -1, 0);
            } else {
                // left two
                return this.shift(pos, -2, 0);
            }
        } else {
            if (clockwise) {
                // left two
                return this.shift(pos, -2, 0);
            } else {
                // right one
                return this.shift(pos, 1, 0);
            }
        }
    }

    rotateTestFour(state, clockwise, pos) {
        switch(state) {
            case 0:
                if (clockwise) {
                    // left two down one
                    return this.shift(pos, -2, -1);
                } else {
                    // left one up two
                    return this.shift(pos, -1, 2);
                }
            case 1:
                if (clockwise) {
                    // left one up two
                    return this.shift(pos, -1, 2);
                } else {
                    // right two up one
                    return this.shift(pos, 2, 1);
                }
            case 2:
                if (clockwise) {
                    // right two up one
                    return this.shift(pos, 2, 1);
                } else {
                    // right one down two
                    return this.shift(pos, 1, -2);
                }
            case 3:
                if (clockwise) {
                    // right one down two
                    return this.shift(pos, 1, -2);
                } else {
                    // left two down one
                    return this.shift(pos, -2, -1);
                }
        }
    }

    rotateTestFive(state, clockwise, pos) {
        switch(state) {
            case 0:
                if (clockwise) {
                    // right one up two
                    return this.shift(pos, 1, 2);
                } else {
                    // right two down one
                    return this.shift(pos, 2, -1);
                }
            case 1:
                if (clockwise) {
                    // right two down one
                    return this.shift(pos, 2, -1);
                } else {
                    // left one down two
                    return this.shift(pos, -1, -2);
                }
            case 2:
                if (clockwise) {
                    // left one down two
                    return this.shift(pos, -1, -2);
                } else {
                    // left two up one
                    return this.shift(pos, -2, 1);
                }
            case 3:
                if (clockwise) {
                    // left two up one
                    return this.shift(pos, -2, 1);
                } else {
                    // right one up two
                    return this.shift(pos, 1, 2);
                }
        }
    }
}