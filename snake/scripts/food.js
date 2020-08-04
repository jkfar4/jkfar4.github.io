class Food {

    constructor(x, y, radius) {
        this._x = x;
        this._y = y;
        this._colour = "white";
        this._outlineColour = "black";
        this._radius = radius;
        this._points = 25;
    }
    get x() {
        return this._x;
    }

    set x(newX) {
        this._x = newX;
    }

    get y(){
        return this._y;
    }

    set y(newY){
        this._y = newY;
    }

    get colour(){
        return this._colour;
    }

    set colour(newColour){
        this._colour = newColour;
    }

    get outlineColour(){
        return this._outlineColour;
    }
    set outlineColour(newColour){
        this._outlineColour = newColour;
    }

    get radius(){
        return this._radius;
    }

    set radius(newRadius){
        this._radius = newRadius;
    }

    get points(){
        return this._points;
    }
}