function rotateControlFlow() { // handles rotation of shape -- we could use this method to update our ship design
    if (!this.dragging) return;
    if (input.mouseWheelButton === input.MOUSE.MOUSE_MIDDLE_UP) {
        this.shape.rotateRight();
        this.reEvaluateShape();
    } else if (input.mouseWheelButton === input.MOUSE.MOUSE_MIDDLE_DOWN) {
        this.shape.rotateLeft();
        this.reEvaluateShape();
    }
}