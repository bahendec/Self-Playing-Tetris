class NextPiece {
    constructor() {
        this.hasShape = false;
        this.shape;
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