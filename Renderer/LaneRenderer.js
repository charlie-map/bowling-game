import BowlingGame from "../BowlingGame.js";
import Renderer from "./Renderer.js";

export default class LaneRenderer {
    constructor(game) {
        this.pinRenderer = new Renderer(game, 39, 45);
    }

    /**
     * Attaches the renderer to the LaneRenderer.
     *
     * @param {Renderer} renderer .
     */
    addRenderer(renderer) {
        renderer.addRenderer(this.renderer, 3, 44, 1, 46);
    }

    /**
     * Renders the lanes based on the bowling game thus far.
     *
     * @param {BowlingGame} _game .
     * @param {number} line .
     *
     * @returns {string} Lane renderer response.
     */
    renderer(_game, line) {
        if (line < 13) {
            this.pinRenderer.renderRow(line - 1);
        }

        switch (line) {
            case 32:
                return `|                   _                   |`;
            case 33:
                return `|              _   /_\\   _              |`;
            case 34:
                return `|         _   /_\\       /_\\   _         |`;
            case 35:
                return `|    _   /_\\                 /_\\   _    |`;
            case 36:
                return `|   /_\\                           /_\\   |`;
            case 40:
                return `|  *  *  *  *  *         *  *  *  *  *  |`;
        }

        return `|                                       |`;
    }
}
