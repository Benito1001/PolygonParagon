import { toPixels } from "./scaleLogic.js"
import { randomInt } from "./utils.js";
import entitiesCollide from "./collisionLogic.js";
import Vector from "./vector.js";
import Rectangle from "./rectangle.js";

class Player {
	constructor(x, y, isTest = false) {
		this.pos = new Vector(x, y);
		this.vel = new Vector(0, 0);
		this.acc = new Vector();
		this.speed = 0;
		this.rad = 1;
		this.width = this.rad*2;
		if (isTest) {
			this.moveRate = 8;
			this.gravity = 0;
			this.friction = 1.5;
		} else {
			this.moveRate = 5;
			this.gravity = 9.81;
			this.friction = 0.1;
		}
		this.maxFuel = 100;
		this.fuel = this.maxFuel;
		this.keys = {};
		this.onGround = false;
		this.texture = document.getElementById('playerWheel');
		this.type = "circle";
		this.property = "solid";
		this.dead = false;
		this.boundingBox = new Rectangle(this.pos.x, this.pos.y, this.rad*2, this.rad*2);
	}
	draw(ctx) {
		let canvasPos = this.pos.toPixels();
		let canvasRad = this.rad*toPixels

		// Draw front wheel
		ctx.save();
		ctx.translate(canvasPos.x+canvasRad, canvasPos.y+canvasRad);
		ctx.rotate(this.pos.x);
		ctx.drawImage(this.texture, -canvasRad, -canvasRad, canvasRad*2, canvasRad*2);
		ctx.restore();

		//ctx.strokeRect(this.boundingBox.x*toPixels, this.boundingBox.y*toPixels, this.boundingBox.width*toPixels, this.boundingBox.height*toPixels)
		//this.vel.draw(ctx, canvasPos.x+this.rad*toPixels, canvasPos.y+this.rad*toPixels, "blue");
	}
	update(dt, entities) {
		if (this.fuel > 0) {
			this.move(dt);
		} else {
			this.acc.x -= 1;
		}
		this.acc.add(0, this.gravity);

		this.vel.add(this.acc.x*dt, this.acc.y*dt);
		for (var i = 0; i < entities.length; i++) {
			var collisionData = entitiesCollide(this, entities[i]);
			if (collisionData.state == true) {
				this.pos.add(collisionData.collisionVector);

				var collisionVector = collisionData.collisionVector.rotate(-90);
				var collisionAngle = this.vel.angleDiff(collisionVector);

				if (collisionAngle > 90) {
					collisionAngle = collisionAngle - 180;
				}

				this.vel.rotate(collisionAngle);
				this.vel.multiply(Math.round(Math.abs(Math.sin((90-collisionAngle)*(Math.PI/180)))*100)/100)
			}
		}

		this.pos.add(this.vel.x*dt, this.vel.y*dt);
		this.acc.set(0);

		if (this.pos.x < 0) {
			this.pos.x = 0;
			this.vel.x = 0;
		}
		this.speed = Math.sign(this.vel.x)*this.vel.absolute();
		this.updateBoundingBox();
	}

	move(dt) {
		this.fuel -= 1*dt;
		this.acc.x += this.moveRate;
		if (this.keys.KeyD) {
		}
		if (this.keys.KeyA) {
			this.acc.x -= this.moveRate*2;
		}
		if (this.keys.KeyW) {
			this.acc.y -= this.moveRate;
			this.fuel -= 1*dt
		}
		if (this.keys.KeyS) {
			this.acc.y += this.moveRate*6;
			this.acc.x -= this.moveRate/2;
			this.fuel -= 2*dt
		}
		this.acc.sub(this.friction*this.vel.x, this.friction*this.vel.y);
	}

	updateBoundingBox() {
		this.boundingBox.set(this.pos.x, this.pos.y)
	}
}

export default new Player(0, -2)
