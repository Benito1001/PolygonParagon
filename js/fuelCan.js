import { toPixels } from "./scaleLogic.js"
import Vector from "./vector.js";
import Rectangle from "./rectangle.js";

export default class PlayerWheel {
	constructor(x, y, rotation) {
		this.pos = new Vector(x, y);
		this.rotation = -rotation;
		this.texture = document.getElementById('fuelCan');
		this.sizeRatio = this.texture.width/this.texture.height;
		this.width = 2;
		this.height = this.width/this.sizeRatio;
		this.pos.sub(this.width/2, this.height);
		this.type = "fuelCan";
		this.property = "solid";
		this.dead = false;
		this.boundingBox = new Rectangle(this.pos.x, this.pos.y, this.width, this.height);
	}

	draw(ctx) {
		let canvasPos = this.pos.toPixels();
		let canvasWidth = this.width*toPixels;
		let canvasHeight = this.height*toPixels
		ctx.fillStyle = "red";
		ctx.save();
		ctx.translate(canvasPos.x + canvasWidth/2, canvasPos.y + canvasHeight/2);
		ctx.rotate(this.rotation*(Math.PI/180))
		ctx.drawImage(this.texture, -canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
		ctx.restore();
	}

	update() {
	}
}
