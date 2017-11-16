/**
 * @fileOverview Cell definitions for a Game of Life implementation.
 * @author Antti Rantaeskola
 * @version 1.0
 */

/**
 * Enum for cell state.
 * @readonly
 * @enum {number}
 */
var State = {
    DEAD: 0,
    ALIVE: 1
};

/**
 * Creates a new Cell object that is dead by default.
 * @constructor
 */
function Cell() {
    this.state = State.DEAD;

    /**
     * Flips cell state to the opposite value: a living cell becomes dead and
     * a dead becomes alive.
     */
    this.flip = function() {
        if (this.state === State.DEAD) {
            this.state = State.ALIVE;
        } else {
            this.state = State.DEAD;
        }
    };
}
