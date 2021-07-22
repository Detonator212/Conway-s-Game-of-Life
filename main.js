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

drawGrid();

// ctx.fillStyle = "green";
// ctx.fillRect(10,10,150,100);