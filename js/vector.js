import { toPixels } from "./scaleLogic.js";

export default class Vector {
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}
	normalize() {
		let newX = this.x/this.absolute();
		this.y = this.y/this.absolute();
		this.x = newX;
		return this;
	}
	multiply(num) {
		this.x *= num;
		this.y *= num;
		return this;
	}
	add(x, y = x) {
		if (typeof x === 'object') {
			this.x += x.x;
			this.y += x.y;
		} else {
			this.x += x;
			this.y += y;
		}
		return this;
	}
	sub(x, y = x) {
		if (typeof x === 'object') {
			this.x -= x.x;
			this.y -= x.y;
		} else {
			this.x -= x;
			this.y -= y;
		}
		return this;
	}
	absolute() {
		return (Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2)));
	}
	set(x, y = x) {
		if (typeof x === 'object') {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
		return this;
	}
	setLength(length) {
		this.normalize().multiply(length);
		return this;
	}
	rotate(α) {
		let newX = Math.cos(α*(Math.PI/180))*this.x-Math.sin(α*(Math.PI/180))*this.y;
		this.y = Math.cos(α*(Math.PI/180))*this.y+Math.sin(α*(Math.PI/180))*this.x;
		this.x = newX;
		return this;
	}
	fromPoints(point1, point2) {
		this.x = point2.x-point1.x;
		this.y = point2.y-point1.y;
		return this;
	}
	shorten(reductor) {
		let tempVector = this.clone();
		tempVector.setLength(reductor);
		this.sub(tempVector.x, tempVector.y);
		return this;
	}
	lengthen(increasor) {
		let tempVector = this.clone();
		tempVector.setLength(increasor);
		this.add(tempVector.x, tempVector.y);
		return this;
	}
	getAngle() {
		return Math.atan2(this.x, this.y)*(180/Math.PI);
	}
	angleDiff(vector) {
		var angle1 = this.getAngle()-90;
		angle1 = (360+angle1)%360;
		var angle2 = vector.getAngle()-90;
		angle2 = (360+angle2)%360;
		var angle = angle1 - angle2;
		if (angle < 0) {
			angle += 360;
		}
		return angle;
	}
	toPixels() {
		return new Vector(this.x*toPixels, this.y*toPixels)
	}
	clone() {
		return new Vector(this.x, this.y);
	}
	draw(ctx, originX, originY, color) {
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(originX, originY);
		ctx.lineTo(originX+this.x*toPixels, originY+this.y*toPixels);
		ctx.stroke();
	}
}
