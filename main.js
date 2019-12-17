import { toPixels } from "./js/scaleLogic.js"
import { randomInt, average } from "./js/utils.js";
import { roadCurrentX, addRoadSegment } from "./js/addRoadSegment.js";
import Vector from "./js/vector.js";
import player from "./js/player.js";
import Point from "./js/point.js";
import Polygon from "./js/polygon.js";
import FractalTree from "./js/fractalTree.js";
import FuelCan from "./js/fuelCan.js";

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var headerHeight = 2*document.getElementsByClassName('headerDiv')[0].clientHeight;

window.addEventListener("resize",resize);
function resize() {
	canvas.width = innerWidth-5;
	canvas.height = innerHeight-headerHeight*1.3;
}
resize();

var previousTime;
var dt;
var continueGame = true;
var entities = [];
var ticksSpent = 0;
var fps;

var playerSpeeds = [];
var playerSpeedAverages = [];

entities.push(player);

addRoadSegment(1, entities);

window.addEventListener("load", event => requestAnimationFrame(runGame));

function runGame(currentTime) {
	if (continueGame) {
		requestAnimationFrame(runGame);
	}
	// Update dt
	dt = (currentTime - previousTime)/1000 || 0.0167;
	dt = Math.round(dt*10000)/10000
	// If fps is below 30, lock fps to 30
	if (dt >= 0.0333) {
		dt = 0.0333
	}
	previousTime = currentTime;

	// Update fps
	if (Math.floor(ticksSpent) % 5 === 0) {
		fps = Math.round(1/dt);
	}
	ticksSpent += 1*(dt*60);

	// Update entities
	for (var i = 0; i < entities.length; i++) {
		entities[i].update(dt, entities);
		if (entities[i].dead == true) {
			entities.splice(i, 1);
		}
	}

	// End game when player runs out of fuel
	if (player.fuel <= 0 && player.speed <= 0) {
		continueGame = false;
	}

	// Add new road segment if player is near the edge
	if (player.pos.x + canvas.width/toPixels > roadCurrentX) {
		addRoadSegment(1, entities)
	}

	// Update average player speed
	if (Math.round(ticksSpent+30) % 60 === 0) {
		playerSpeeds.push(player.speed);
	}
	if (playerSpeeds.length > 15) {
		playerSpeedAverages.push(average(playerSpeeds));
		playerSpeeds = [];
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (player.pos.x*toPixels > canvas.width/2-player.rad*toPixels) {
		ctx.translate(
			canvas.width/2 - (player.pos.x+player.rad)*toPixels,
			canvas.height/2 - (player.pos.y+player.rad)*toPixels
		);
	}
	else {
		ctx.translate(0, canvas.height/2-(player.pos.y+player.rad)*toPixels);
	}

	// Draw relative things
	for (var i = 0; i < entities.length; i++) {
		if (
			entities[i].pos.x + entities[i].width > player.pos.x - (canvas.width)/toPixels
			&& entities[i].pos.x < player.pos.x + (canvas.width)/toPixels
		) {
			entities[i].draw(ctx);
		}
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	// Draw fixed things
	ctx.font = `bold 40px Impact, Helvetica`;
	ctx.fillStyle = "rgb(0, 0, 0)";
	let fpsText = fps+" fps";
	ctx.fillText(fpsText, canvas.width-ctx.measureText(fpsText).width, 40);
	let speedText = Math.round(player.speed)+" m/s";
	ctx.fillText(speedText, canvas.width-ctx.measureText(speedText).width - 4, 40*2);
	let timeText = Math.round(ticksSpent/60)  + " seconds";
	ctx.fillText(timeText, canvas.width-ctx.measureText(timeText).width - 4, 40*3);
	let distanceText = Math.round(player.pos.x)  + " meters";
	ctx.fillText(distanceText, canvas.width-ctx.measureText(distanceText).width - 4, 40*4);
	let fuelText = Math.round(player.fuel)  + " fuel left";
	ctx.fillStyle = "rgb("+(255-player.fuel*255/player.maxFuel)+", "+(player.fuel*255/player.maxFuel)+", 0)";
	ctx.fillText(fuelText, canvas.width-ctx.measureText(fuelText).width - 4, 40*5);
	ctx.strokeText(fuelText, canvas.width-ctx.measureText(fuelText).width - 4, 40*5);
	ctx.fillStyle = "rgb(0, 0, 0)";
	if (!continueGame) {
		if (playerSpeedAverages.length === 0) {
			var speedAverage = average(playerSpeeds);
		} else {
			var speedAverage = average(playerSpeedAverages);
		}
		let averageSpeedText = "Average speed: " + speedAverage.toFixed(2)  + " m/s"
		ctx.fillText(averageSpeedText, canvas.width-ctx.measureText(averageSpeedText).width - 4, 40*6);
	}
}

window.addEventListener('keydown', (event) => player.keys[event.code] = true);
window.addEventListener('keyup', (event) => player.keys[event.code] = false);

window.addEventListener('touchstart', (event) => {
	player.keys["KeyS"] = true;
	if (!continueGame) {
		window.location.reload();
	}
});
window.addEventListener('touchend', (event) => player.keys["KeyS"] = false);
document.body.addEventListener('touchmove', (event) => event.preventDefault(), {passive: false});
/*window.addEventListener('contextmenu', (event) =>
	e.preventDefault();
});
*/

export function debugDraw(point) {
	entities.push(new Point(point));
}
