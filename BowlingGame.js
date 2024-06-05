import { BowlingUtils } from "./BowlingUtils.js";
import BowlingFrame from "./BowlingFrame.js";

export default class BowlingGame {
    /**
     * Constructs a simple Bowling Game.
     * @param {BowlingFrame[]} copyData Used for copying in previous frames to add into the new game.
     */
    constructor(copyData = []) {
        this.game = BowlingUtils.generateBowlingGame();

        this.currentFrame = 0;

        for (let setCopyData = 0; setCopyData < copyData.length; setCopyData++) {
            // Check if there are no values in this specific frame. We should go ahead and avoid looking passed to avoid any trouble.
            if (!copyData[setCopyData].frame.length) {
                break;
            }

            this.setFrame(copyData[setCopyData].frame);
        }
    }

    /**
     * Gets the specified frame based on index.
     *
     * @param {number} index The specific index to check.
     *
     * @returns {BowlingFrame} The bowling frame.
     */
    getFrame(index) {
        if (!BowlingUtils.isValidFrameIndex(index)) {
            throw new Error(`Invalid index ${index}`);
        }

        return this.game[index];
    }

    /**
     * Takes in a value and will set the next frame based on the current frame.
     *
     * @param {number[]} value A specific frame value to set.
     */
    setFrame(value) {
        if (!BowlingUtils.isValidFrameIndex(this.currentFrame)) {
            throw new Error(`Invalid set next frame index ${this.currentFrame}`);
        }

        this.game[this.currentFrame].setValue(value);

        this.currentFrame++;
    }

    /**
     * Takes a given frame index and will calculate the full value (including look aheads for that position).
     *
     * @param {number} index The specific frame index to calculate.
     * @param {boolean} useIncompleteness Set to true if this function should return incomplete results (i.e. a strike but there is only one result after).
     *  Defaults to true.
     *
     * @returns {number | null} The frame value or null (if not possible and no useIncompleteness flage).
     */
    calculateFrame(index, useIncompleteness = false) {
        const frame = this.game[index];

        // Handle separately.
        if (frame.isTenth()) {
            return frame.getValue(!useIncompleteness);
        }

        if (frame.hasStrike()) {
            // Add next two values to this frame.
            // If there are not two values to add, return null to avoid weirdness in our score renderer.
            let nextFrame = this.game[index + 1];

            const valueOne = nextFrame?.getValueAtIndex(0);
            let valueTwo = nextFrame?.getValueAtIndex(1);

            if (typeof valueOne !== 'number') {
                return useIncompleteness ? 10 : null;
            }

            // If they strike in the nextFrame, go for the frame after.
            if (!valueTwo && valueOne === 10) {
                nextFrame = this.game[index + 2];
                valueTwo = nextFrame?.getValueAtIndex(0) ?? (useIncompleteness ? 0 : null);
            }

            if (typeof valueTwo !== 'number') {
                return null;
            }

            return 10 + valueOne + valueTwo;
        }

        if (frame.hasSpare()) {
            // Add next single value to this frame.
            const nextFrame = this.game[index + 1];
            const valueOne = nextFrame?.getValueAtIndex(0);

            if (!valueOne) {
                return null;
            }

            return 10 + valueOne;
        }

        return frame.getValue(!useIncompleteness);
    }

    /**
     * Computes up the point it can. This assumes the rest of the game is zeros if there are open frames.
     *
     * @returns {number} The current displayed score.
     */
    getCurrentScore() {
        let rollingFrameValue = 0;

        for (let frameIndex = 0; frameIndex < this.currentFrame; frameIndex++) {
            rollingFrameValue += this.calculateFrame(frameIndex, true);
        }

        return rollingFrameValue;
    }

    /**
     * Returns the maximum possible score for this game. We do this in the simplest possible way by making
     *  a new duplicate game and filling in the empty frame.
     *
     * @returns {number} The max score possible.
     */
    getMaxScore() {
        const bowlingGameToFill = new BowlingGame(this.game);

        // Loop til we hit tenth frame.
        while (bowlingGameToFill.currentFrame < 10) {
            const currentFrame = bowlingGameToFill.getFrame(bowlingGameToFill.currentFrame);
            const bowlingFrameArray = currentFrame.getValueArray();

            // Empty, fill completely.
            if (bowlingFrameArray.length === 0) {
                if (currentFrame.isTenth()) {
                    bowlingGameToFill.setFrame([10, 10, 10]);
                    break;
                } else {
                    bowlingGameToFill.setFrame([10]);
                    continue;
                }
            }

            if (currentFrame.isTenth()) {
                // If there's two and this is still the current frame, it means they got a spare or two strikes. Fill final position with strike.
                if (bowlingFrameArray.length === 2) {
                    bowlingGameToFill.setFrame([...bowlingFrameArray, 10]);
                    break;
                }

                // If they've only thrown once and they got a strike, fill the rest of the frame with strikes.
                if (bowlingFrameArray[0] === 10) {
                    bowlingGameToFill.setFrame([10, 10, 10]);
                    break;
                }

                // If the first ball was anything else, finish a spare and add one strike.
                bowlingGameToFill.setFrame([bowlingFrameArray[0], 10 - bowlingFrameArray[0], 10]);
                break;
            }

            // The only case left for non-tenth frames is if they have thrown one ball and it was not a strike. Use the same logic
            //  as was used for a single non-strike ball thrown in the tenth.
            bowlingGameToFill.setFrame([bowlingFrameArray[0], 10 - bowlingFrameArray[0]]);
        }

        // Finally just get score of the bowling game.
        return bowlingGameToFill.getCurrentScore();
    }
}
