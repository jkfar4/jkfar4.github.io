class Segments {
    constructor(canvasX,canvasY,width,height){
        this._canvasX = canvasX;
        this._canvasY = canvasY;
        this._width = width;
        this._height = height;
    }
    get canvasX(){
        return this._canvasX;
    }
    set canvasX(x){
        this._canvasX = x;
    }

    get canvasY(){
        return this._canvasY;
    }
    set canvasY(y){
        this._canvasY = y;
    }
    get width(){
        return this._width;
    }
    set width(newWidth){
        this._width = newWidth;
    }

    set height(newHeight){
        this._height = newHeight;
    }
    get height(){
        return this._height;
    }
}

