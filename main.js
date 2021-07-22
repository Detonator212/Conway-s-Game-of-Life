document.querySelector("#canvas");

canvas.width = window.innerWidth;
canvas.height = 400;

var ctx = canvas.getContext("2d");

var squareSize = 20;

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

liveSquares.add(stringify(5,6));
liveSquares.add(stringify(6,7));
liveSquares.add(stringify(7,7));
liveSquares.add(stringify(8,7));


function stringify(x,y) {
    return x.toString() + "," + y.toString();
}

function checks() {
    var squaresToDie = new Set();
    var squaresToBeBorn = new Set();

    for (var x = 0; x < canvas.width / squareSize; x++) {
        for (var y = 0; y < canvas.height / squareSize; y++) {

            var liveNeighbours = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (!(i == 0 && j == 0)) {
                        if (liveSquares.has(stringify(x+i,y+j))) {
                            liveNeighbours++;
                        }
                    }
                }
            }
            
            // If this square is live
            if (liveSquares.has(stringify(x,y))) {
                if (liveNeighbours < 2) {
                    squaresToDie.add(stringify(x,y));
                    // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so dies")
                } else if (liveNeighbours > 3) {
                    squaresToDie.add(stringify(x,y));
                    // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so dies")
                }
            } else {
                if (liveNeighbours == 3) {
                    squaresToBeBorn.add(stringify(x,y));
                    // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so is born")
                }
            }
        }
    }

    for (let item of squaresToDie) liveSquares.delete(item);
    for (let item of squaresToBeBorn) liveSquares.add(item);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    checks();
    for (let item of liveSquares) drawSquare(parseInt(item.split(",")[0]), parseInt(item.split(",")[1]));
}

drawGrid();
for (let item of liveSquares) drawSquare(parseInt(item.split(",")[0]), parseInt(item.split(",")[1]));
setInterval(update, 1000);
