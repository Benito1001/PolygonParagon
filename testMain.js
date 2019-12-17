import { getPixelRatio, randomInt } from "./js/utils.js";
import Player from "./js/player.js";
import Polygon from "./js/polygon.js";
import Vector from "./js/vector.js";
import Point from "./js/point.js";

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scaleFactor;

window.addEventListener("resize",resize);
function resize() {
	canvas.width = innerWidth-20;
	canvas.height = innerHeight-25; scaleFactor = innerHeight/891;
}
resize();

var toPixels = getPixelRatio();
var previousTime;
var dt;
var continueGame = true;
var entities = [];

var player = new Player(0, 8, false);
entities.push(player);
var polygonArray = [];
for (var i = 0; i < 20; i++) {
	if (i == 0) {
		polygonArray.push(new Vector(0, 13))
	} else if (i < 10) {
		polygonArray.push(new Vector(polygonArray[i-1].x+2, polygonArray[i-1].y+randomInt(0, 20)/10))
	} else {
		polygonArray.push(new Vector(polygonArray[i-1].x+2, polygonArray[i-1].y-randomInt(0, 10)/10))
	}
}
polygonArray.push(new Vector(polygonArray[polygonArray.length-1].x, canvas.height/toPixels))
polygonArray.push(new Vector(0, canvas.height/toPixels))

console.log(polygonArray);
entities.push(new Polygon([
	new Vector(6.5, 6),
	new Vector(8, 4),
	new Vector(Math.PI*4, 8),
	new Vector(2.718281828459045*1, 9),
	new Vector(2.718281828459045*1, 8.8),
	new Vector(Math.PI*3.9, 7.9),
	new Vector(8, 4.5),
	new Vector(7, 6),
	new Vector(6.5, 6),
]));
entities.push(new Polygon(polygonArray));

window.addEventListener("load", event => requestAnimationFrame(runGame));

function runGame(currentTime) {
	// dt
	dt = (currentTime - previousTime)/1000 || 0.0167;
	dt = Math.round(dt*10000)/10000
	if (dt >= 4) {
		dt = 4;
	}
	previousTime = currentTime;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < entities.length; i++) {
		entities[i].update(dt, entities);
	}
	for (var i = 0; i < entities.length; i++) {
		entities[i].draw(ctx);
	}

	if (continueGame) {
		requestAnimationFrame(runGame);
	}
}

window.addEventListener('keydown', function (e) {
	player.keys = (player.keys || {});
	player.keys[e.code] = true;
});
window.addEventListener('keyup', function (e) {
	player.keys[e.code] = false;
});

export function debugDraw(point) {
	entities.push(new Point(point));
}
