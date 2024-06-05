import BowlingGame from "../BowlingGame.js";

export default class Renderer {ß
    /**
     * Builds full renderer system. Handles all rendering.
     *
     * @param {BowlingGame} game The bowling game to render when asked.
     * @param {number} boardWidth The width of this Renderer.
     * @param {number} boardHeight The height of this Renderer.
     */
    constructor(game, boardWidth, boardHeight) {
        // Static board numbers. The player will have to resize their terminal as needed.
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;

        if (!game) {
            throw new Error("No game passed to Renderer");
        }
        this.game = game;

        // Renderer grid will be an array of arrays so when the Renderer is running, it will pull for startRow and startColumn
        //  ask for the rendering for that position.
        this.rendererGrid = [];
        // Stores important renderer positions.
        this.rendererPositions = {};
    }

    /**
     * Adds a new render function.
     *
     * @param {(game: BowlingGame, row: number) => string} render The function that will return the string of what to render on the board.
     *
     * NOTE: starte and end columns are INCLUSIVE of the end value. This is for simpler drawing logic.
     * @param {number} startColumn Which column to start rendering this function.
     * @param {number} endColumn Which column to end rendering this function.
     * @param {number} startRow Which row to start rendering this function.
     * @param {number} endRow WhichÍÍÍÍ row to end rendering this function.
     */
    addRenderer(render, startColumn, endColumn, startRow, endRow) {
        this.checkColumnRowIndex(startColumn, endColumn, startRow, endRow);

        if (!this.rendererGrid[startColumn]) {
            this.rendererGrid[startColumn] = [];
        }

        // Go ahead and search through the grid from startColumn, startRow to endColumn, endRow and make sure this
        //  renderer does not conflict with other renderers.
        for (
            let columnIndex = startColumn;
            columnIndex <= endColumn;
            columnIndex++
        ) {
            for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                if (!this.rendererGrid[columnIndex]) {
                    this.rendererGrid[columnIndex] = [];
                }

                if (this.rendererGrid[columnIndex][rowIndex]) {
                    throw new Error(
                        `A renderer already exists at ${columnIndex}, ${rowIndex}`
                    );
                }

                this.rendererGrid[columnIndex][rowIndex] = render;

                this.rendererPositions[columnIndex] = {
                    ...this.rendererPositions[columnIndex],
                    [rowIndex]: {
                        startColumn,
                        startRow,
                        endColumn,
                        endRow,
                    },
                };
            }
        }
    }

    /**
     * Does single border restriction checking.
     *
     * @param {number} startColumn Which column to start rendering this function.
     * @param {number} endColumn Which column to end rendering this function.
     * @param {number} startRow Which row to start rendering this function.
     * @param {number} endRow Which row to end rendering this function.
     */
    checkColumnRowIndex(startColumn, endColumn, startRow, endRow) {
        // Check if it will intersect with the board.
        if (startColumn < 0) {
            throw new Error("Start column cannot start before zero");
        }

        if (startRow < 0) {
            throw new Error("Start row cannot start before zero");
        }

        if (endColumn > this.boardWidth) {
            throw new Error("End column cannot end after board width");
        }

        if (endRow > this.boardHeight) {
            throw new Error("End row cannot end after board height");
        }
    }

    /**
     * Renders full board.
     */
    renderBoard() {
        for (let rowIndex = 0; rowIndex <= this.boardHeight; rowIndex++) {
            this.renderRow(rowIndex);

            // Print the new line here.
            console.log("");
        }
    }

    /**
     * Renders a specific row.
     *
     * @param {number} rowIndex The row to render.
     */
    renderRow(rowIndex) {
        // Check if we should ignore this command.
        if (rowIndex < 0 || rowIndex > this.boardHeight) {
            return;
        }

        for (let columnIndex = 0; columnIndex <= this.boardWidth; columnIndex++) {
            if (!this.rendererGrid[columnIndex]?.[rowIndex]) {
                // If process is not defined, we can just have this fail since something larger is wrong.
                // eslint-disable-next-line no-undef
                process.stdout.write(" ");
                continue;
            }

            const stringToRender = this.rendererGrid[columnIndex][rowIndex](
                this.game,
                rowIndex - this.rendererPositions[columnIndex][rowIndex].startRow
            );

            // eslint-disable-next-line no-undef
            process.stdout.write(stringToRender);

            columnIndex = this.rendererPositions[columnIndex][rowIndex].endColumn + 1;
        }
    }
}
