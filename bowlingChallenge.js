import BowlingGame from "./BowlingGame.js";
import { BowlingUtils } from "./BowlingUtils.js";
import Renderer from "./Renderer/Renderer.js";

const game = new BowlingGame();

game.setFrame([0, 0]);
game.setFrame([10]);
game.setFrame([2, 4]);

const renderer = new Renderer(game, 89, 47);
BowlingUtils.addGeneralRenderers(renderer, game);
renderer.renderBoard();
