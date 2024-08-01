import BowlingFrame from "../BowlingFrame.js";
import BowlingGame from "../BowlingGame.js";
import Renderer from "./Renderer.js";

export default class ScoreRenderer {
    constructor() { }

    /**
     * Adds the score renderer to the global renderer.
     *
     * @param {Renderer} renderer .
     */
    addRenderer(renderer) {
        // Must do the inline arrow function to correctly scope "this".
        renderer.addRenderer((game, line) => { return this.frameLine(game, line) }, 47, 87, 1, 6);
    }

    /**
     * Renders the basic 10-frame view.
     * @param {BowlingGame} game The game to render.
     * @param {number} line The row of the 10-frame view to create.
     *
     * @returns {string} The specific frame line string to print.
     */
    frameLine(game, line) {
        // Top-most and bottom-most lines are simple.
        if (line === 0 || line === 3) {
            return '+---+---+---+---+---+---+---+---+---+---+';
        }

        // Also fairly simple, use any data in the game frames. Otherwise,
        //  fill with spaces.
        if (line === 1) {
            let render = '|';

            for (const frame of game.game) {
                render += this.renderFrame(frame) + '|';
            }

            return render;
        }

        // This is the challenging one..
        if (line === 2) {
            let rollingFrameValue = 0;
            let render = '|';

            for (let frameIndex = 0; frameIndex < 10; frameIndex++) {
                if (!game.getFrame(frameIndex).isFinished()) {
                    render += '   |';
                    continue;
                }

                let frameValue = game.calculateFrame(frameIndex);

                if (frameIndex === 9) {
                    const tenthFrame = game.getFrame(frameIndex);
                    if (!tenthFrame.isFinished()) {
                        rollingFrameValue += frameValue;
                        render += '   |';
                        continue;
                    }
                }

                if (typeof frameValue !== 'number') {
                    render += '   |';
                    continue;
                }

                rollingFrameValue += frameValue;

                // Handle each length of digits (1-3 digits, i.e. 5, 68, 150).
                if (rollingFrameValue > 99) {
                    render += rollingFrameValue + '|'
                } else if (rollingFrameValue > 9) {
                    render += ` ${rollingFrameValue}|`;
                } else {
                    render += `  ${rollingFrameValue}|`;
                }

                rollingFrameValue = frameValue;
            }

            return render;
        }

        if (line === 4) {
            const maxScore = game.getMaxScore();
            let maxScoreString = '   ';
            if (maxScore > 99) {
                maxScoreString = `${maxScore}`;
            } else if (maxScore > 9) {
                maxScoreString = ` ${maxScore}`;
            } else {
                maxScoreString = `  ${maxScore}`;
            }

            return `|Max score: ${maxScoreString} |                        `;
        }

        return `+---------------+                        `;
    }

    /**
     * Converts a bowling frame to the string representation. Primary examples:
     * [1, 2] => '1|2'
     * [0, 3] => '-|3'
     * [7] => '7| ' (NOTE THE SPACE HERE)
     * [10] => ' |X' (NOTE THE SPACE HERE)
     * [2, 8] => '2|/'
     *
     * @param {BowlingFrame} frame A full frame to render.
     *
     * @returns {string} Renderered frame line.
     */
    renderFrame(frame) {
        // We will split into tenth frame versus normal frames to simplify logic.
        if (frame.index === 9) {
            // We use a character array here to be able to quickly replace the values (unlike immutable strings).
            const stringVal = [' ', '|', '_'];
            /**
             * Tenth frame cases:
             *
             * [] => '   '
             * [2] => '2  '
             * [0, 0] => '-|-'
             * [3, 6] => '3|6'
             * [10, 3, 2] => 'X32'
             * [10, 4, 6] => 'X4/'
             * [3, 7, 2] => '3/2' (tenth frame is weird...)
             * [10, 10, 3] => 'XX3'
             */

            // We handle the zeroes case separately because it's kinda goofy

            // We make use of some disgusting JavaScript NaN behavior here :).
            let prevValue = undefined;
            for (let frameIndex = 0; frameIndex < 3; frameIndex++) {
                if (prevValue + frame.frame[frameIndex] === 10) {
                    stringVal[frameIndex] = '/';

                    prevValue = undefined;
                    continue;
                }

                if (frame.frame[frameIndex] === 10) {
                    if (frameIndex === 1) {
                        stringVal[2] = ' ';
                    }

                    stringVal[frameIndex] = 'X';

                    prevValue = undefined;
                    continue;
                }

                // Make sure we have a defined value. Otherwise, ignore.
                if (typeof frame.frame[frameIndex] === 'number') {
                    const framePositionValue = frame.frame[frameIndex];
                    stringVal[frameIndex + (typeof prevValue === 'number' ? 1 : 0)] = String(framePositionValue === 0 ? '-' : framePositionValue);
                    prevValue = frame.frame[frameIndex];
                }
            }

            return stringVal.join('');
        } else {
            const stringVal = [' ', '|', '_'];

            // Cover a strie.
            if (frame.frame[0] === 10) {
                stringVal[1] = ' ';
                stringVal[2] = 'X';
                return stringVal.join('');
            }

            if (typeof frame.frame[0] !== 'number') {
                return stringVal.join('');
            }

            stringVal[0] = frame.frame[0] === 0 ? '-' : frame.frame[0];

            if (typeof frame.frame[1] !== 'number') {
                return stringVal.join('');
            }

            if (frame.frame[0] + frame.frame[1] === 10) {
                stringVal[2] = '/';
            } else {
                stringVal[2] = frame.frame[1] === 0 ? '-' : frame.frame[1];
            }

            return stringVal.join('');
        }
    }
}
