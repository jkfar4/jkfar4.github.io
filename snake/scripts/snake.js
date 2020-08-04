class Snake {
    constructor(startX, startY, width, height) {
        this._body = [new Segments(startX, startY, width, height)];
        this._dx = 0;
        this._dy = 0;
        this._colour = "black";
    }

    move() {
        let head = this.head;
        this._body.pop();
        this._body.unshift(new Segments(
            (head.canvasX + this._dx),
            (head.canvasY + this._dy),
            head.width,
            head.height));
    }

    grow() {
        let tail = this.tail;
        this.body.push(new Segments(
            tail.canvasX + (this._dx * -1),
            tail.canvasY + (this._dy * -1),
            tail.width,
            tail.height
        ));
    }
    movingLeft() {
        return (this._dx < 0 && this._dy === 0);
    }
    movingRight() {
        return (this._dx > 0 && this._dy === 0);
    }
    movingUp() {
        return (this._dx === 0 && this._dy < 0);
    }
    movingDown() {
        return (this._dx === 0 && this._dy > 0);
    }

    get head() {
        return this._body[0];
    }

    get tail() {
        return this._body[this.body.length - 1];
    }

    get body(){
        return this._body;
    }

    get dx() {
        return this._dx;
    }

    set dx(newChangeInX) {
        this._dx = newChangeInX;
    }

    get dy() {
        return this._dy;
    }

    set dy(newChangeInY) {
        this._dy = newChangeInY;
    }

    get colour(){
        return this._colour;
    }
}
