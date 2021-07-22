document.querySelector("#canvas");

canvas.width = window.innerWidth;
canvas.height = 400;

var ctx = canvas.getContext("2d");

var squareSize = 10;

function drawGrid() {
    for (i = 0; i <= canvas.height; i += squareSize) {
        ctx.moveTo(0,i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    for (i = 0; i <= canvas.width; i += squareSize) {
        ctx.moveTo(i,0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
}

function Square(x,y) {
    this.x = x;
    this.y = y;

    this.draw = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(x*squareSize, y*squareSize, squareSize, squareSize);
    }
}

new Square(5,5).draw();

drawGrid();