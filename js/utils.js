import { toPixels } from "./scaleLogic.js"

export function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
	return (Math.random() * (max - min)) + min;
}

export function colorizeGradient(ctx, from, to, colorScale, minHue, maxHue, minSaturation, maxSaturation, minLightnes, maxLightnes) {
	let fromColor = simplexColor(from/colorScale, minHue, maxHue, minSaturation, maxSaturation, minLightnes, maxLightnes);
	let toColor = simplexColor(to/colorScale, minHue, maxHue, minSaturation, maxSaturation, minLightnes, maxLightnes);

	let grad = ctx.createLinearGradient(from*toPixels, 0, to*toPixels, 0);
	grad.addColorStop(0, fromColor);
	grad.addColorStop(1, toColor);
	return grad;
}

function bitwiseColor(seed) {
	let fromColor = (Math.sin(seed/1000)+1)*(0xffffff/2);
	//11111111 11111111 11111111
	let red = fromColor & 0xff;
	let green = (fromColor & 0xff00) >> 8;
	let blue = (fromColor & 0xff0000) >> 16;

	red = red > 15 ? red.toString(16) : "0" + red.toString(16);
	green = green > 15 ? green.toString(16) : "0" + green.toString(16);
	blue = blue > 15 ? blue.toString(16) : "0" + blue.toString(16);

	return "#"+red+green+blue;
}

function simplexColor(val, minHue = 0, maxHue = 360, minSaturation = 100, maxSaturation = 100, minLightnes = 50, maxLightnes = 50) {

	let hue = minHue + Math.round((noise.simplex2(val, 0.5)+1)*((maxHue-minHue)/2));
	let saturation = minSaturation + Math.round((noise.simplex2(val, 100.5)+1)*((maxSaturation-minSaturation)/2));
	let lightnes = minLightnes + Math.round((noise.simplex2(val, 200.5)+1)*((maxLightnes-minLightnes)/2));

	return "hsl("+hue+", "+saturation+"%, "+lightnes+"%)";
}

export function average(numArray) {
	let num = 0;
	for (var i = 0; i < numArray.length; i++) {
		num += numArray[i];
	}
	return num/numArray.length;
}

export var treeColors = {
	bark: [],
	leaf: [],
}
