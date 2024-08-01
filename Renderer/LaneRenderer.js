import BowlingGame from "../BowlingGame.js";
import Renderer from "./Renderer.js";

export default class LaneRenderer {
    constructor() {}

    /**
     * Attaches the renderer to the LaneRenderer.
     *
     * @param {Renderer} renderer .
     */
    addRenderer(renderer) {
        renderer.addRenderer(this.renderer, 3, 44, 13, 46);
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
        switch (line) {
            case 20:
                return `|                   _                   |`;
            case 21:
                return `|              _   /_\\   _              |`;
            case 22:
                return `|         _   /_\\       /_\\   _         |`;
            case 23:
                return `|    _   /_\\                 /_\\   _    |`;
            case 24:
                return `|   /_\\                           /_\\   |`;
            case 28:
                return `|  *  *  *  *  *         *  *  *  *  *  |`;
        }

        return `|                                       |`;
    }
}
