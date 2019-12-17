import Rectangle from "./rectangle.js";

export default class PointRectangle {
	constructor(point1, point2, point3, point4) {
		this.points = [
			point1,
			point2,
			point3,
			point4,
		]
		this.point1 = this.points[0];
		this.point2 = this.points[1];
		this.point3 = this.points[2];
		this.point4 = this.points[3];
		this.faces = [
			[point1, point2],
			[point2, point3],
			[point3, point4],
			[point4, point1],
		];
		this.boundingBox = this.getBoundingBox();
	}
	draw(ctx, converter = 1) {
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#000000"

		for (let i = 0; i < this.faces.length; i++) {
			ctx.beginPath();
			ctx.moveTo(this.faces[i][0].x*converter, this.faces[i][0].y*converter);
			ctx.lineTo(this.faces[i][1].x*converter, this.faces[i][1].y*converter);
			ctx.stroke();
		}
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
