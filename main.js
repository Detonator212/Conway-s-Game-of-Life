// document.querySelector("#canvas");

var offsetX = 0;
var offsetY = 0;

var drag = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

var speedSlider = document.querySelector("#speed-slider")

var squareSize = 10;
var updatePeriod = 5000 / speedSlider.value;

var iterations = 0;

var liveSquares

function drawGrid() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ctx.fillStyle = "white";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    for (i = offsetY % squareSize; i <= canvas.height; i += squareSize) {
        ctx.moveTo(0,i);
        ctx.lineTo(canvas.width, i);
    }
    for (i = offsetX % squareSize; i <= canvas.width; i += squareSize) {
        ctx.moveTo(i,0);
        ctx.lineTo(i, canvas.height);
    }
    ctx.stroke();
    ctx.closePath();
}

function drawSquare(x,y) {
    ctx.fillStyle = "lightgreen";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "green";
    ctx.fillRect(x*squareSize + offsetX, y*squareSize + offsetY, squareSize, squareSize);
}

function reset() {
    liveSquares = new Set();
    liveSquares.add(stringify(10,10));
    liveSquares.add(stringify(11,10));
    liveSquares.add(stringify(12,10));
    liveSquares.add(stringify(10,9));
    iterations = 0;
    counter.innerHTML = iterations; 
    update();
}

reset();

function stringify(x,y) {
    return x.toString() + "," + y.toString();
}

function arrayify(string) {
    return new Array(parseInt(string.split(",")[0]), parseInt(string.split(",")[1]));
}

function getNumLiveNeighbours(x,y) {
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
    return liveNeighbours;
}

function checks() {
    var squaresToDie = new Set();
    var squaresToBeBorn = new Set();

    var checkedSquares = new Set();

    for (let square of liveSquares) {

        var x1 = arrayify(square)[0];
        var y1 = arrayify(square)[1];
        
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {

                var x2 = x1+i;
                var y2 = y1+j;

                if (!(checkedSquares.has(stringify(x2,y2)))) {
                    var liveNeighbours = getNumLiveNeighbours(x2, y2);

                    // If this square is live
                    if (liveSquares.has(stringify(x2,y2))) {
                        if (liveNeighbours < 2) {
                            squaresToDie.add(stringify(x2,y2));
                            // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so dies")
                        } else if (liveNeighbours > 3) {
                            squaresToDie.add(stringify(x2,y2));
                            // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so dies")
                        }
                    } else {
                        if (liveNeighbours == 3) {
                            squaresToBeBorn.add(stringify(x2,y2));
                            // console.log(x + "," + y + " has " + liveNeighbours + " live neighbours so is born")
                        }
                    }

                    checkedSquares.add(stringify(x2,y2));
                }
            }
        }
    }

    for (let item of squaresToDie) liveSquares.delete(item);
    for (let item of squaresToBeBorn) liveSquares.add(item);

    iterations++
    counter.innerHTML = iterations;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for (let item of liveSquares) drawSquare(arrayify(item)[0], arrayify(item)[1]);
}

window.onresize = update;

var oldOffsetX = 0;
var oldOffsetY = 0;

function onMouseMove(event) {
    drag = true;
    offsetX = oldOffsetX;
    offsetY = oldOffsetY;
    offsetX += event.pageX - mouseStartX;
    offsetY += event.pageY - mouseStartY;
    update();
    // console.log("offsetX: " + offsetX + " offsetY: " + offsetY);
}

var mouseStartX;
var mouseStartY;

canvas.onmousedown = function(event) {
    document.addEventListener("mousemove", onMouseMove)

    document.addEventListener("mouseup", onMouseUp)

    mouseStartX = event.pageX;
    mouseStartY = event.pageY;

    oldOffsetX = offsetX;
    oldOffsetY = offsetY;
};

function onMouseUp(event) {
    document.removeEventListener("mousemove", onMouseMove)
    document.removeEventListener("mouseup", onMouseUp)

    if (!drag) {
        var titleBar = document.querySelector("#title-bar");
        liveSquares.add(stringify(Math.floor((event.clientX - offsetX)/squareSize), Math.floor((event.clientY - offsetY)/squareSize)));
    } else {
        drag = false;
    }
    update();
}


var started = false;
var interval;

function togglePlay() {
    var startButtonIcon = document.querySelector("#start-button-icon")
    if (started) {
        clearInterval(interval);
        started = false;
        startButtonIcon.firstElementChild.setAttribute("href", "#play-icon")
    } else {
        interval = setInterval(function() {
            checks();
            update();
        }, updatePeriod);
        started = true;
        startButtonIcon.firstElementChild.setAttribute("href", "#pause-icon")
    }
}

document.querySelector("#start-button").onclick = togglePlay;

speedSlider.oninput = function() {
    updatePeriod = 5000 / this.value;
    console.log(updatePeriod)

    if (started) {
        clearInterval(interval);
        interval = setInterval(function() {
            checks();
            update();
        }, updatePeriod);
        started = true;
    }
}

document.querySelector("#size-slider").oninput = function() {
    squareSize = parseInt(this.value);
    update();
}

document.querySelector("#reset-button").onclick = reset;
document.querySelector("#next-button").onclick = function() {
    checks();
    update();
}

// Keyboard controls

document.addEventListener("keydown", function(event) {
    // space bar pressed
    if (event.keyCode == 32) {
        togglePlay();
    }
    // esc pressed
    if (event.keyCode == 27) {
        reset();
    }
    // right arrow pressed
    if (event.keyCode == 39) {
        checks();
        update();
    }
});

window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaY);
    console.log(squareSize)
    if (squareSize + delta*-1 <= 40 && squareSize + delta*-1 >= 5) {
        squareSize += delta*-1;
        update();
    }
});