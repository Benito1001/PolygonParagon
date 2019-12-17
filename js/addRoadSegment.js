import { toPixels } from "./scaleLogic.js"
import { randomInt } from "./utils.js";
import Vector from "./vector.js";
import Polygon from "./polygon.js";
import FractalTree from "./fractalTree.js";
import FuelCan from "./fuelCan.js";

noise.seed(Math.random());

export var roadCurrentX = 0;
var roadCurrentY = 0;
var noiceCurrentX = 0;
var placeFuel = false;
var fuelPlaced = 0;
var fuelSpace = 0;

export function addRoadSegment(segmentCount, entities) {
	let roadPointsArray = [];
	let roadHeightScaleFactor = Math.pow(roadCurrentX/1000, 1.5)/10;
	let roadPointCount = 30;
	let roadLineSize = 1;
	let roadCurveLength = 50 * (1+roadHeightScaleFactor/2);
	let roadLineHeightVariation = 10 * (1+roadHeightScaleFactor);
	let treeProbability = 2;
	let fuelSpacer = 3;

	while (noise.simplex2(0.1, 0) < 0) {
		noise.seed(Math.random());
	}

	for (let i = 0; i <= segmentCount; i++) {
		let offsetY = 0;
		for (let j = 0; j < roadPointCount+2; j++) {
			if (j == 0) {
				roadPointsArray.push(new Vector(roadCurrentX, roadCurrentY));
			} else {
				let prevPoint = roadPointsArray[j-1];

				if (j == 1) {
					let currentPreviousY = noise.simplex2(noiceCurrentX, 0)*roadLineHeightVariation;
					if (currentPreviousY != roadCurrentY) {
						offsetY = roadCurrentY - currentPreviousY;
					}
				}

				noiceCurrentX += roadLineSize/roadCurveLength;
				// Get x & y coordinates
				let x = prevPoint.x + roadLineSize;
				let y = noise.simplex2(noiceCurrentX, 0)*roadLineHeightVariation;
				y += offsetY;

				// Create a new road point
				roadPointsArray.push(new Vector(x, y));

				// Add fractal trees
				if (j == Math.round((roadPointCount+2)/2)) {
					if (randomInt(1, treeProbability) == treeProbability) {
						entities.push(new FractalTree(x, y, 8*(1+roadHeightScaleFactor),
							new Vector().fromPoints(roadPointsArray[j-1], roadPointsArray[j]).getAngle()-90
						));
					}
				}

				// Add fuel
				fuelSpace += roadLineSize;
				if (fuelSpace >= fuelSpacer) {
					if (!placeFuel && randomInt(0, Math.round(300/fuelSpacer)) == 0) {
						placeFuel = true;
					}
					if (placeFuel) {
						entities.push(new FuelCan(x, y,
							new Vector().fromPoints(roadPointsArray[j-1], roadPointsArray[j]).getAngle()-90
						));
						fuelPlaced += 1;
					}
					if (placeFuel && randomInt(0, 5-fuelPlaced) == 0) {
						placeFuel = false;
						fuelPlaced = 0;
					}
					fuelSpace = 0;
				}
			}
		}
		let endPointX = roadPointsArray[roadPointsArray.length-1].x;
		let endPointY = roadPointsArray[roadPointsArray.length-1].y

		// Add points to loop back to start
		let downY = Math.abs(endPointY-roadCurrentY) + canvas.height/toPixels;
		roadPointsArray.push(new Vector(endPointX, endPointY + downY));
		roadPointsArray.push(new Vector(roadCurrentX, endPointY + downY));
		roadPointsArray.push(new Vector(roadCurrentX, roadCurrentY));

		// Create a polygon with roadPoints and reset variables
		entities.push(new Polygon(roadPointsArray));
		roadCurrentX = endPointX-1/toPixels;
		roadCurrentY = endPointY;
		roadPointsArray = [];
	}
}
