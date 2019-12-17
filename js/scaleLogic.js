import player from "./player.js";

var pixelRatio = 1/50;

export var toPixels = innerHeight*pixelRatio;
setInterval(updateToPixels, 16.667)
function updateToPixels() {
	toPixels = innerHeight*pixelRatio - player.speed/10;
}
