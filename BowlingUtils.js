import BowlingFrame from "./BowlingFrame.js";
import BowlingGame from "./BowlingGame.js";
import LaneRenderer from "./Renderer/LaneRenderer.js";
import BorderRenderer from "./Renderer/BorderRenderer.js";
import ScoreRenderer from "./Renderer/ScoreRenderer.js";
import Renderer from "./Renderer/Renderer.js";

export const BowlingUtils = {
    /**
     * Generates basic bowling game instance.
     * Set to static as this is not class specific.
     * @returns {BowlingFrame[]} A bowling frame array for the game.
     */
    generateBowlingGame: () => {
        const frames = [];
        for (let i = 0; i < 10; i++) {
            frames[i] = new BowlingFrame(i);
        }

        return frames;
    },

    /**
     * Takes index of frame and confirms it is between 0 and 9.
     * @param {number} frame Frame index (ZERO BASED).
     * @returns {boolean} If frame is valid.
     */
    isValidFrameIndex: (frame) => {
        return frame >= 0 && frame <= 9;
    },

    /**
     * Adds all the basic renderes a person may need.
     *
     * @param {Renderer} renderer .
     * @param {BowlingGame} game .
     */
    addGeneralRenderers(renderer, game) {
        const borderRenderer = new BorderRenderer();
        const laneRenderer = new LaneRenderer(game);
        const scoreRenderer = new ScoreRenderer();

        borderRenderer.addRenderer(renderer);
        laneRenderer.addRenderer(renderer);
        scoreRenderer.addRenderer(renderer);
    },
};
