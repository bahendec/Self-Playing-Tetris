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

    generateInstructions() {
        let rotations = [[], ['u'], ['u', 'u'], ['x']];
        let pos = this.active.getPositions();
        let minScore = [100000, []];
        for (let rot of rotations) {
            // make rotations
            // neutral drop
            // evaluate
            // while can move left iteratively move left and drop and evaluate
            // same with right
            // save min evaluation and instructions 
        }
    }
}