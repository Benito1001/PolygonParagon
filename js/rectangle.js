export default class Rectangle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	draw(ctx, scale) {
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = "black";
		ctx.strokeRect(this.x*scale, this.y*scale, this.width*scale, this.height*scale);
	}
	set(x, y) {
		this.x = x;
		this.y = y;
	}
	collidesWidth(rectangle) {
		if (this.x + this.width > rectangle.x && this.x < rectangle.x + rectangle.width &&
				this.y + this.height > rectangle.y && this.y < rectangle.y + rectangle.height) {
			return true;
		}
		return false;
	}
}
