/**
 * @fileOverview Main functionality of a Game of Life implementation.
 * @author Antti Rantaeskola
 * @version 1.0
 */

/** Canvas component for drawing */
var canvas = document.getElementById("canvas");
/** This variable is used to stop game iteration and to check if game is on */
var intervalID = -1;
/** The grid containing all the cells */
var grid = resetGrid();
/** Cell rectangle size used in drawing */ 
var cellSize = 10;

// Setting the event handling
canvas.onclick = function() {flipCell(canvas, event)};
startButton.onclick = function() {start()};
stopButton.onclick = function() {stop()};
clearButton.onclick = function() {clear()};

drawGrid();

/**
 * Function flips a clicked cell in the grid into opposite value (either kills 
 * a cell that is alive or brings a dead cell alive). If game is on function
 * does not do anything.
 */
function flipCell(canvas, event) {
    // Check if game is on
    if (intervalID !== -1) {
        return;
    }
    
    // Then figure out correct coordinates
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor((event.clientX - rect.left) / cellSize);
    var y = Math.floor((event.clientY - rect.top) / cellSize);
    
    grid[x + Grid.BOUNDARY][y + Grid.BOUNDARY].flip();
    drawGrid();
}

/**
 * Draws the grid. 
 *
 * NOTE: only a certain part of the actual grid is visible! Invisible boundary
 * section is defined by the Grid constant set. This boundary is there to 
 * provide some sort of illusion about infinite grid (moving things may move  
 * beyond visible scope and thus the boundary areas seem to work correctly).
 */
function drawGrid() {
    var ctx = canvas.getContext("2d");
    var cell;

    // Grid color
    ctx.strokeStyle = "#afafaf";
    

    for (i = 0; i < Grid.WIDTH - Grid.BOUNDARY * 2; i++) {
        for (j = 0; j < Grid.HEIGHT - Grid.BOUNDARY * 2; j++) {
            cell = grid[i + Grid.BOUNDARY][j + Grid.BOUNDARY];
            if (cell.state === State.ALIVE) {
                // Color of alive cells
                ctx.fillStyle = "#000000";
                ctx.fillRect(i * (cellSize), j * (cellSize), 
                             cellSize, cellSize);
            } else {
                // Color of dead cells
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(i * (cellSize), j * (cellSize), 
                             cellSize, cellSize);
                ctx.strokeRect(i * (cellSize), j * (cellSize), 
                               cellSize, cellSize);
            }
        }
    }
}

/**
 * Starts the game. Sets global variable intervalID to hold a value that can
 * be used to stop the game iteration. Iteration speed or "tick length" depends 
 * on the slider value from html.
 */
function start() {
    var slider = document.getElementById("interval");
    intervalID = setInterval(iteration, slider.value);
}

/**
 * Stops the game.
 */
function stop() {
    clearInterval(intervalID);
    intervalID = -1;
}

/**
 * Stops the game (just to be sure) and resets grid with dead cells.
 */
function clear() {
    stop();
    grid = resetGrid();
    drawGrid();
}

/**
 * Goes through a single game iteration.
 *
 * Checks (almost) each cell in the grid and applies the rules of the game
 * (https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
 * to every one of them simultaneously.
 *
 * NOTE: boundary cells are left outside the check to simplify the procedure.
 * Rules cannot be applied to them in a meaningfull way anyway.
 * 
 * Once the game iteration is finished function also redraws the grid.
 */
function iteration() {
    var changes = [];
    var count;
    var cell;
    var i;
    var j;
    var len;
    var x;
    var y;

    // First goes through all the cells and checks if any needs to be 
    // changed (flipped). Does not flip them yet. Note the boundary values
    // of i and j.
    for (i = 1; i < Grid.WIDTH - 1; i++) {
        for (j = 1; j < Grid.HEIGHT - 1; j++) {
            cell = grid[i][j];
            count = countAliveCells(i, j);

            if (cell.state === State.ALIVE) {
                if (count < 2 || count > 3) {
                    changes.push([i, j]);                  
                }
            } else if (cell.state === State.DEAD) {
                if (count === 3) {
                    changes.push([i, j]);
                }
            }
        }
    }
    
    // Then the flipping if necessary
    len = changes.length;
    for (i = 0; i < len; i++) {
        x = changes[i][0];
        y = changes[i][1]; 
        grid[x][y].flip();
    }

    drawGrid();
}

/**
 * Counts the amount of cells that are alive around a cell.
 *
 * @param {number} x Cell's x coordinate
 * @param {number} y Cell's y coordinate
 * @returns {number} Count of living cells around the cell 
 */
function countAliveCells(x, y) {
    var count = 0;
    
    // This array contains all eigth neighbouring cells
    var cells = [
        grid[x - 1][y - 1], grid[x][y - 1], grid[x + 1][y - 1],
        grid[x - 1][y], grid[x + 1][y],
        grid[x - 1][y + 1], grid[x][y + 1], grid[x + 1][y + 1]
    ];
    var i;
    var len = cells.length;
                        
    for (i = 0; i < len; i++) {
        if (cells[i].state === State.ALIVE) {
            count++;
        }
    }
    
    return count;
}
