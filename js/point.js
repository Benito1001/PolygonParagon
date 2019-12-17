import Vector from "./vector.js";

export default class Point {
	constructor(point) {
		this.pos = point;
	}
	update() {

	}
	draw(ctx) {
		var canvasPos = this.pos.toPixels();
		ctx.fillStyle = "pink"
		ctx.fillRect(canvasPos.x-2.5, canvasPos.y-2.5, 5, 5);
	}
}
