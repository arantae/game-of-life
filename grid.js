/**
 * @fileOverview Grid definitions for a Game of Life implementation.
 * @author Antti Rantaeskola
 * @version 1.0
 */

/**
 * Collection for grid size values.
 *
 * @readonly
 * @enum {number}
 */
var Grid = {
    WIDTH: 120,
    HEIGHT: 120,
    /** Width of boundary area, that is ignored when drawing the grid */
    BOUNDARY: 20
}

/**
 * Creates a new grid with dead cells.
 *
 * @returns new grid
 */
function resetGrid() {
    var column;
    var i = 0;
    var j = 0;
    var grid = [];

    for (i = 0; i < Grid.WIDTH; i++) {
       column = [];
       for (j = 0; j < Grid.HEIGHT; j++) {
           column.push(new Cell());
       }
       grid.push(column);
    }
    
    return grid;
}
