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
}