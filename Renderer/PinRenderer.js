import BowlingGame from "../BowlingGame.js";
import { BowlingUtils } from "../BowlingUtils.js";
import Renderer from "./Renderer.js";

export default class PinRenderer {
    constructor() {
        this.pinSystem = [
            [
                6,
                7,
                8,
                9,
            ],
            [
                3,
                4,
                5,
            ],
            [
                1,
                2,
            ],
            [0]
        ]
    }

    /**
     * Attaches the renderer to the LaneRenderer.
     *
     * @param {Renderer} renderer .
     */
    addRenderer(renderer) {
        renderer.addRenderer((game, line) => { return this.renderer(game, line) }, 3, 44, 1, 12);
    }

    /**
     * Convert a number between 1-12 to the correct line row for the pinSystem.
     * So:
     * - 0-2 is 0
     * - 3-5 is 1
     * - 6-8 is 2
     * - 9-11 is 3
     *
     * @param {number} line The given line number (between 0 and 11).
     *
     * @returns {number} A number between 0 and 3.
     */
    getPinRow(line) {
        return (line - (line % 3)) / 3;
    }

    /**
     * Just returns the line remainder. Useful for knowing which part of the pin we're drawing.
     *
     * @param {number} line The given line number (between 0 and 11).
     *
     * @returns {number} A number between 0 and 2.
     */
    getPinRowRemainder(line) {
        return line % 3;
    }

    /**
     * Computes the spacing needed for a given row of the pins (based on the number of 
     *  pins in that row).
     * @param {number} pinRow Which row of the bowling pins we're on.
     *
     * @returns {number[]} The spacing for a given row around each pin.
     */
    getRowSpacing(pinRow) {
        // Calculate how to appropriately space pins. We know the lane width is 39.
        const pinSystemLength = this.pinSystem[pinRow].length; // Get the number of pins
        const pinDisplacement = pinSystemLength * 5; // The amount of our lane width that is taken up by pins.
        const innerPinDisplacement = (pinSystemLength - 1) * 5; // The amount of our lane width that is taken up by space between the pins.
        const outerPinDisplacement = (BowlingUtils.LANE_WIDTH - pinDisplacement - innerPinDisplacement) / 2; // The space on one side of the pins.
        // We will add outerPinDisplacement on each side of the spacing array.

        const spacing = [];
        for (let setInnerPinSpacingIndex = 0; setInnerPinSpacingIndex < pinSystemLength - 1; setInnerPinSpacingIndex++) {
            spacing[setInnerPinSpacingIndex + 1] = 5;
        }

        spacing[0] = outerPinDisplacement;
        spacing[pinSystemLength] = outerPinDisplacement;

        return spacing;
    }

    renderPinTop() {
        return ' ___ ';
    }

    renderPinBottom() {
        return '\\___/';
    }

    renderPinCenter(pinNumber) {
        if (pinNumber < 10) {
            return `/ ${pinNumber} \\`;
        }

        return `/ ${pinNumber}\\`;
    }

    /**
     * Renders the pins based on the bowling frame thus far.
     *
     * @param {BowlingGame} game .
     * @param {number} line .
     *
     * @returns {string} Lane renderer response.
     */
    renderer(game, line) {
        const currentFrame = game.getFrame(game.currentFrame);
        const pinRow = this.getPinRow(line);
        const rowSpacing = this.getRowSpacing(pinRow);

        // Confirm which part of the pin we're on.
        const pinRowRow = this.getPinRowRemainder(line);

        let lineData = '|'

        rowSpacing.forEach((rowSpace, index) => {
            const renderedRowSpace = BowlingUtils.renderRowSpace(rowSpace);

            lineData += renderedRowSpace;

            // Only render next pin if we are in range (avoid extra pind additions on end of lane).
            if (index >= this.pinSystem[pinRow].length) {
                return;
            }

            // Check if the current pin is standing in the frame.
            const currentPin = this.pinSystem[pinRow][index];

            if (!currentFrame.pins[currentPin]) {
                // We should not render anything.
                lineData += '     ';
                return;
            }

            if (pinRowRow === 0) {
                lineData += this.renderPinTop();
            } else if (pinRowRow === 2) {
                lineData += this.renderPinBottom();
            } else {
                lineData += this.renderPinCenter(this.pinSystem[pinRow][index] + 1);
            }
        })

        return lineData + '|';
    }
}
