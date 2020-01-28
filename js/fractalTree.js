import { toPixels } from "./scaleLogic.js"
import { randomInt, randomFloat } from "./utils.js";
import Vector from "./vector.js";
import Rectangle from "./rectangle.js";

export default class FractalTree {
	constructor(x, y, size, rotation = 0) {
		this.rotation = rotation;
		this.pos = new Vector(x, y);
		// Fake canvas is used to prevent having to redraw the entire tree each frame
		this.fakeCanvas = document.createElement("canvas");
		this.fakeCtx = this.fakeCanvas.getContext("2d");

		this.startSize = size;
		this.drawTree(this.startSize);

		this.width = this.fakeCanvas.width/toPixels;
		this.height = this.fakeCanvas.height/toPixels;
		this.type = "fractalTree";
		this.property = "solid";
		this.dead = false;
		this.boundingBox = new Rectangle(this.pos.x, this.pos.y, this.width, this.height);
	}

	draw(ctx) {
		let canvasPos = this.pos.toPixels();
		// Tree is drawn upside down on the fake canvas, so it must be rotated. Therefore Math.PI;
		ctx.save();
		ctx.translate(canvasPos.x, canvasPos.y);
		ctx.rotate(Math.PI - this.rotation*(Math.PI/180));
		ctx.drawImage(this.fakeCanvas, -(this.width*toPixels)/2, 0, this.width*toPixels, this.height*toPixels);
		ctx.restore();
	}

	update() {
	}

	drawTree(size) {
		// Variable declaration
		this.startSize = randomInt(size/2, size);
		this.angle = randomInt(10, 100);
		this.minSize = this.startSize/20;
		this.sizeReductor = randomFloat(1.5, 1.7);
		this.angleReductor = randomFloat(1, 1.2);
		this.hue = randomInt(0, 255);

		// Finds the branch count with math (size(branch) = start/reductor^branch, solve size(branch) = minSize for branch)
		this.branchCount = Math.ceil((-Math.log(this.minSize) + Math.log(this.startSize))/Math.log(this.sizeReductor))+1;

		// Sum of branch sizes, not including the fist branch
		var halfWidth = 0;
		for (var i = 1; i < this.branchCount; i++) {
			// size(branch) = start/reductor^branch
			halfWidth += this.startSize/Math.pow(this.sizeReductor, i);
		}
		// Width and height will be slightly biger than the actual size, but it is close enough
		// The first branch will always point up, so it is not part of the width
		this.fakeCanvas.width = (halfWidth*2)*toPixels;
		this.fakeCanvas.height = (halfWidth + this.startSize)*toPixels;
		this.drawTreeBranch(this.angle, this.startSize);
	}

	drawTreeBranch(angle, size, startPos = new Vector(0, 0), lineVector = new Vector(0, 1)) {
		// Same math as used to find total branch count, but using current size to find current branch
		let currentBranch = Math.ceil((-Math.log(size) + Math.log(this.startSize))/Math.log(this.sizeReductor))+1

		lineVector.setLength(size);

		// Draws branch
		this.fakeCtx.beginPath();
		this.fakeCtx.moveTo(
			startPos.x*toPixels + this.fakeCanvas.width/2,
			startPos.y*toPixels
		);
		this.fakeCtx.lineTo(
			(startPos.x + lineVector.x)*toPixels + this.fakeCanvas.width/2,
			(startPos.y + lineVector.y)*toPixels
		);
		this.fakeCtx.lineWidth = this.linearLine(this.startSize*toPixels/10, 0, this.branchCount, currentBranch);
		//this.fakeCtx.lineWidth = this.squaredLineWidth(this.startSize*toPixels/10, this.branchCount, currentBranch);
		this.fakeCtx.strokeStyle = this.linearColor("#7f4005",  "#00a020", this.branchCount-1, currentBranch-1);

		this.fakeCtx.stroke();

		// Escape condition: stop recursion if size is less than minimun size
		if (size > this.minSize) {
			// Makes the new start position the old end position
			startPos.add(lineVector);

			lineVector.rotate(angle);
			this.drawTreeBranch(angle/this.angleReductor, size/this.sizeReductor, startPos.clone(), lineVector.clone());

			lineVector.rotate(-angle*2);
			this.drawTreeBranch(angle/this.angleReductor, size/this.sizeReductor, startPos, lineVector);
		}
	}

	linearLine(from, to, length, pos) {
		let fullLine = from - to;
		if (fullLine > 0) {
			let fraction = fullLine/length;
			var portion = fraction * (length-pos);
		} else {
			let fullLine = to - from;
			let fraction = fullLine/length;
			var portion = from + fraction * pos;
		}
		return portion;
	}

	squaredLineWidth(start, end, pos) {
		// f(x) = ax^2 + b
		// 0.9 to make f(end) != 0
		let a = -0.9*start/Math.pow(end, 2);
		let b = start;
		// pos-1 to start at 0;
		let f = a*Math.pow(pos, 2) + b;
		return f;
	}

	linearColor(fromColorHex, toColorHex, length, pos) {
		let fromR = parseInt(fromColorHex[1]+fromColorHex[2], 16);
		let fromG = parseInt(fromColorHex[3]+fromColorHex[4], 16);
		let fromB = parseInt(fromColorHex[5]+fromColorHex[6], 16);

		let toR = parseInt(toColorHex[1]+toColorHex[2], 16);
		let toG = parseInt(toColorHex[3]+toColorHex[4], 16);
		let toB = parseInt(toColorHex[5]+toColorHex[6], 16);

		let currentR = this.linearLine(fromR, toR, length, pos);
		let currentG = this.linearLine(fromG, toG, length, pos);
		let currentB = this.linearLine(fromB, toB, length, pos);

		let hexR = Math.round(currentR).toString(16);
		hexR = parseInt(hexR, 16) < 15 ? "0"+hexR : hexR;
		let hexG = Math.round(currentG).toString(16);
		hexG = parseInt(hexG, 16) < 15 ? "0"+hexG : hexG;
		let hexB = Math.round(currentB).toString(16);
		hexB = parseInt(hexB, 16) < 15 ? "0"+hexB : hexB;


		let color = "#"+hexR+hexG+hexB;
		return color;
	}
}
