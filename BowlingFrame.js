import { BowlingUtils } from "./BowlingUtils.js";

export default class BowlingFrame {
    /**
     * Constructs a single bowling frame using the index of the frame.
     * @param {number} index Zero-based frame index between 0 and 9.
     */
    constructor(index) {
        if (!BowlingUtils.isValidFrameIndex(index)) {
            throw new Error(`Invalid index ${index}`);
        }

        this.frame = [];
        this.index = index;

        this.isTenthFrame = index === 9;
        // These change depending on tenth frame.
        this.maxLength = index === 9 ? 3 : 2;
        this.maxScore = index === 9 ? 30 : 10;
    }

    /**
     * Will update a specific part of this frame. This will first check for a few things:
     * - Ensure value input is valid.
     * - Ensure frame index is valid in two ways:
     *   - The index is within the maxLength parameter
     *   - The index is in a position where the previous indices in this frame are already set.
     *
     * @param {number} value .
     * @param {number} frameIndex 0-1 or 0-2 (depending on if this is the tenth frame).
     */
    setValueAtIndex(value, frameIndex) {
        if (!BowlingFrame.isValidValue(value)) {
            throw new Error(`Invalid value ${value} sent.`);
        }

        if (frameIndex < 0 || frameIndex >= this.maxLength) {
            throw new Error(`Invalid frame index ${frameIndex} sent.`);
        }

        // The best way to do this from here is copy our frame value, attempt the changes,
        //  and see if the frame comes back as valid with our validator.
        const copiedFrame = this.#copyFrame(this.frame);
        copiedFrame[frameIndex] = value;

        if (!BowlingFrame.isValid(copiedFrame)) {
            throw new Error(`Attempted frame change is invalid. Frame is set to ${JSON.stringify(copiedFrame)}`);
        }

        // If we get to here, we can go ahead and use the copied frame.
        this.frame = copiedFrame;
    }

    /**
     * Set this frames value. Completely replaces the current value in frame. We choose
     *  to loop through and pull only values so as to avoid weird reference issues.
     *
     * @param {number[]} frame .
     */
    setValue(frame) {
        if (!BowlingFrame.isValid(frame)) {
            throw new Error(`Invalid frame ${JSON.stringify(frame)} for frame ${this.index}.`);
        }

        this.frame = this.#copyFrame(frame);
    }

    /**
     * Returns the value of given frame index.
     *
     * @param {number} frameIndex 0-1 or 0-2 (depending on if this is the tenth frame).
     *
     * @returns {number | null} Either the value at the index or null (no value).
     */
    getValueAtIndex(frameIndex) {
        if (frameIndex < 0 || frameIndex >= this.maxLength) {
            throw new Error(`Invalid frame index ${frameIndex} sent.`);
        }

        return this.frame[frameIndex];
    }

    /**
     * Just returns the frame array.
     *
     * @returns {number[]} The array value of this frame.
     */
    getValueArray() {
        return this.frame;
    }

    /**
     * This version of getValue will actually return the value of the frame (a sum)
     * 
     * @param {boolean} [returnNoLength=true] Acts as a flag to return empty frames as zero instead of null.
     *
     * @returns {number | null} The value of this frame, null if the frame is empty.
     */
    getValue(returnNoLength = true) {
        if (!this.frame.length && !returnNoLength) {
            return null;
        }

        return this.frame.reduce((p, c) => p + c, 0);
    }

    /**
     * Returns a deep copy of a frame.
     * NOTE: this should not be used directly! It does not have the proper safety checks.
     *
     * @param {number[]} frame .
     *
     * @returns {number[]} a new, copied frame element.
     */
    #copyFrame(frame) {
        let copiedFrame = [];
        for (let frameIndex = 0; frameIndex < frame.length; frameIndex++) {
            copiedFrame[frameIndex] = frame[frameIndex];
        }

        return copiedFrame;
    }

    /**
     * Checks for a finished frame.
     *
     * @returns {boolean} If the frame is completed.
     */
    isFinished() {
        if (this.isTenth()) {
            if (this.hasSpare() || this.hasStrike()) {
                return this.frame.length === 3;
            }

            return this.frame.length === 2;
        }

        if (this.hasStrike()) {
            return this.frame.length === 1;
        }

        return this.frame.length === 2;
    }

    /**
     * Checks for if this is tenth frame.
     *
     * @returns {boolean} If this is the tenth frame.
     */
    isTenth() {
        return this.isTenthFrame;
    }

    /**
     * Check for if this given frame is a space.
     *
     * NOTE: this will return true for the tenth frame if there is a spare as well. Tenth frame logic needs to be
     *  separate.
     *
     * @returns {boolean} If there is a spare in this frame.
     */
    hasSpare() {
        let prevValue = undefined;
        for (let frameIndex = 0; frameIndex < this.maxLength; frameIndex++) {
            if (prevValue + this.frame[frameIndex] === 10) {
                return true;
            }

            if (this.frame[frameIndex] === 10) {
                prevValue = undefined;
                continue;
            }

            if (this.frame[frameIndex] === 0) {
                prevValue = 0;
                continue;
            }

            // Make sure we have a defined value. Otherwise, ignore.
            if (typeof this.frame[frameIndex] === 'number') {
                prevValue = this.frame[frameIndex];
            }
        }

        return false;
    }

    /**
     * Checks for if this given frame has a strike. This one is much simpler than a spare check :)
     *
     * @returns {boolean} If there's a strike in this frame.
     */
    hasStrike() {
        for (let frameIndex = 0; frameIndex < this.frame.length; frameIndex++) {
            if (this.frame[frameIndex] === 10) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks the validity of this frame. This has several steps:
     * - Ensure the length of the frame is greater than zero and does not exceed maxLength;
     * - Ensure the sum of the frame is greater than or equal to zero and does not exceed the maxScore;
     * - Ensure the value in each position is also valid
     * - If there are three values (tenth frame), ensure the first two values add up to ten or twenty.
     * 
     * @param {number[]} frame Array of bowling values.
     *
     * @returns {boolean} true if valid, false if invalid.
     */
    static isValid(frame) {
        if (frame.length < 0 || frame.length > this.maxLength) {
            return false;
        }

        const frameSum = frame.reduce((prev, curr) => prev + curr, 0);
        if (frameSum < 0 || frameSum > this.maxScore) {
            return false;
        }

        for (const frameValue of frame) {
            if (!BowlingFrame.isValidValue(frameValue)) {
                return false;
            }
        }

        // Simple modulus work with factors of ten to check for ten or twenty in first two frames.
        if (frame.length === 3 && (frame[0] + frame[1]) % 10 !== 0) {
            return false;
        }

        return true;
    }

    /**
     * Take value and confirms if it is a legal value. Fairly simple, just confirm it's a number
     *  from 0-10.
     *
     * @param {number} value The value to check.
     *
     * @returns {boolean} If this is a valid value.
     */
    static isValidValue(value) {
        return value >= 0 && value <= 10;
    }
}
