import BowlingGame from "../BowlingGame.js";
import Renderer from "./Renderer.js";

export default class BorderRenderer {
    constructor() { }

    /**
     * Takes each of the border functions below and passes them to the Renderer. There's a lot of static things here
     *  so this is straightforward enough.
     *
     * @param {Renderer} renderer .
     */
    addRenderer(renderer) {
        renderer.addRenderer(this.topBorder, 0, 89, 0, 0) // Top border.
        renderer.addRenderer(this.bottomBorder, 0, 89, 47, 47); // Bottom border.
        renderer.addRenderer(this.rightBorder, 88, 89, 1, 46); // Right border.
        renderer.addRenderer(this.leftBorder, 0, 2, 1, 46); // Left border.
    }

    /**
     * Renders top border
     *
     * @param {BowlingGame} _game .
     * @param {number} _line .
     * @returns {string} the top border.
     */
    topBorder(_game, _line) {
        return `+---------------------------------------------------------------------------------------+`;
    }

    /**
     * Renders bottom border
     *
     * @param {BowlingGame} _game .
     * @param {number} _line .
     * @returns {string} the bottom border.
     */
    bottomBorder(_game, _line) {
        return `+---------------------------------------------------------------------------------------+`;
    }

    /**
     * Renders right border. This always returns the same thing.
     *
     * @param {BowlingGame} _game .
     * @param {number} _line .
     * @returns {string} the right border of a specific line.
     */
    rightBorder(_game, _line) {
        return ` |`;
    }

    /**
     * Renders left border. Note the special lines:
     *  - 0: Render '|ft' (for the number of feet that will be displayed on other indexes of this renderer).
     *  - 12: Render '|60'
     *  - 35: Render '|15'
     *  - 40: Render '| 5'
     *
     * @param {BowlingGame} _game .
     * @param {number} line Which line of the left border we're drawing.
     *
     * @returns {string} left border to render.
     */
    leftBorder(_game, line) {
        if (line === 0) {
            return "|ft";
        }

        if (line === 12) {
            return "|60";
        }

        if (line === 36) {
            return "|10";
        }

        if (line === 40) {
            return "| 5";
        }

        return "|  ";
    }
}
