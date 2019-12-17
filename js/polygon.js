import { toPixels } from "./scaleLogic.js"
import { randomInt, colorizeGradient } from "./utils.js";
import Vector from "./vector.js";
import PointRectangle from "./pointRectangle.js";
import Rectangle from "./rectangle.js";

export default class Polygon {
	constructor(pointsArray) {

		this.points = pointsArray;
		if (
			!(
				this.points[0].x == this.points[this.points.length-1].x
				&& this.points[0].y == this.points[this.points.length-1].y)
			) {
				this.points.push(new Vector(this.points[0].x, this.points[0].y))
		}
		this.edges = this.getEdges();
		this.type = "polygon";
		this.property = "solid";
		this.dead = false;
		this.boundingBox = this.getBoundingBox();
		this.pos = new Vector(this.boundingBox.x, this.boundingBox.y);
		this.width = this.boundingBox.width;
		this.height = this.boundingBox.height;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.points[0].x*toPixels, this.points[0].y*toPixels);
		for (let i = 1; i < this.points.length; i++) {
			ctx.lineTo(this.points[i].x*toPixels, this.points[i].y*toPixels);
		}
		/*
		let r = (Math.sin(this.pos.x)+1)*(255/2);
		let g = (Math.cos(this.pos.y)+1)*(255/2);
		let b = (Math.cos(2*r+14*this.pos.y)+1)*(255/4) + (Math.sin(g)+1)*(255/4);
		ctx.fillStyle = "rgb("+r+", "+g+", "+b+")"
		*/
		ctx.fillStyle = colorizeGradient(
			ctx,
			this.pos.x,
			this.pos.x + this.boundingBox.width,
			500, 90*0, 160*2.25, 80, 100, 40, 50
		);
		ctx.fill();
		//ctx.strokeRect(this.pos.x*toPixels, this.pos.y*toPixels, this.width*toPixels, this.height*toPixels)
	}
	update(dt) {
	}
	getEdges() {
		let edges = [];
		for (let i = 0; i < this.points.length-1; i++) {
			edges.push([this.points[i], this.points[i+1]]);
		}
		return edges;
	}
	getBoundingBox() {
		let top = this.points[0].y;
		let bottom = this.points[0].y;
		let left = this.points[0].x;
		let right = this.points[0].x;
		for (let i = 0; i < this.points.length; i++) {
			if (this.points[i].x > right) {
				right = this.points[i].x
			} else if (this.points[i].x < left) {
				left = this.points[i].x;
			}
			if (this.points[i].y > bottom) {
				bottom = this.points[i].y
			} else if (this.points[i].y < top) {
				top = this.points[i].y
			}
		}
		return new Rectangle(left, top, right-left, bottom-top);
	}
}
