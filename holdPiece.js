class HoldPiece {
    constructor() {
        this.hasShape = false;
        this.shape;
    }

    reset() {
        this.hasShape = false;
    }

    setShape(shape) {
        this.shape = shape;
        this.hasShape = true;
    }

    draw() {
        if (this.hasShape) {
            this.shape.draw();
        }
    }
}