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

function drawSquare(x,y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x*squareSize, y*squareSize, squareSize, squareSize);
}

var liveSquares = new Set();

liveSquares.add([5,6]);
liveSquares.add([7,6]);


function update() {
    for (let item of liveSquares) {
        drawSquare(item[0], item[1]);
    }
}

drawGrid();

update();