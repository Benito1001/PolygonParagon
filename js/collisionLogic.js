import Vector from "./vector.js";

export default function entitiesCollide(entity1, entity2) {
	if (entity1 == entity2) {
		return {state: false};
	}
	if (!entity1.boundingBox.collidesWidth(entity2.boundingBox)) {
		return {state: false};
	}
	if (entity1.type == "circle" && entity2.type == "polygon") {
		var collisions = [];
		var circleMid = new Vector(entity1.pos.x, entity1.pos.y).add(entity1.rad, entity1.rad);
		for (let i = 0; i < entity2.edges.length; i++) {
			var collisionData = circleIsOnLine(circleMid, entity1.rad, entity2.edges[i][0], entity2.edges[i][1]);
			if (collisionData.state == true) {
				var collisionVector = new Vector().fromPoints(circleMid, collisionData.collisionPoint);
				collisionVector.normalize().multiply(-collisionData.depth);
				collisions.push({state: true, collisionVector: collisionVector});
			}
		}
		if (collisions.length == 0) {
			return {state: false};
		}
		if (collisions.length == 1) {
			return collisions[0];
		}
		if (collisions.length > 1) {
			var combinedCollisionVector = new Vector();
			for (var i = 0; i < collisions.length; i++) {
				combinedCollisionVector.add(collisions[i].collisionVector)
			}
			return {state: true, collisionVector: combinedCollisionVector};
		}
	}
	else if (entity1.type == "circle" && entity2.type == "fuelCan") {
		entity2.dead = true;
		entity1.fuel += 5;
		return {state: false};
	}
	return {state: false};
}

function circleIsOnLine(circleMid, circleRad, point1, point2) {
	var lengthToLine = lengthFromPointToLine(circleMid, point1, point2);
	if (lengthToLine.toLine < circleRad) {
		// Points to the left
		if (point1.x >= point2.x) {
			if (lengthToLine.collisionPoint.x > point2.x && lengthToLine.collisionPoint.x < point1.x) {
				return {state: true, collisionPoint: lengthToLine.collisionPoint, depth: circleRad-lengthToLine.toLine};
			} else {
				return cornerIsOnLine(circleMid, circleRad, point1, point2);
			}
		} else {
			if (lengthToLine.collisionPoint.x > point1.x && lengthToLine.collisionPoint.x < point2.x) {
				return {state: true, collisionPoint: lengthToLine.collisionPoint, depth: circleRad-lengthToLine.toLine};
			} else {
				return cornerIsOnLine(circleMid, circleRad, point1, point2);
			}
		}
	} else {
		return {state: false};
	}
}

function cornerIsOnLine(circleMid, circleRad, point1, point2) {
	var point1ToCircle = new Vector().fromPoints(circleMid, point1).absolute();
	var point2ToCircle = new Vector().fromPoints(circleMid, point2).absolute();
	if (point1ToCircle < point2ToCircle) {
		if (point1ToCircle < circleRad) {
			return {state: true, collisionPoint: point1, depth: circleRad-point1ToCircle}
		} else {
			return {state: false};
		}
	} else {
		if (point2ToCircle < circleRad) {
			return {state: true, collisionPoint: point2, depth: circleRad-point2ToCircle}
		} else {
			return {state: false};
		}
	}
	return {state: false};
}

function lengthFromPointToLine(point, linePoint1, linePoint2) {
	var lineStart = new Vector(linePoint1.x, linePoint1.y);
	var lineEnd = new Vector(linePoint2.x, linePoint2.y);

	var linePoint = new Vector(lineStart.x, lineStart.y);
	var lineVector = new Vector().fromPoints(lineStart, lineEnd);
	/*
	Math:
	Q=(x, y)
	l={x:n+at, y:m+bt}

	P=(n+at, m+bt)
	r=[a, b]

	QP*r=0
	[(n+at)-x, (m+bt)-y]*[a, b]=0
	a(n+at-x)+b(m+bt-y)=0
	an+(a^2)t-ax+bm+(b^2)t-by=0
	t=(-an+ax-bm+by)/(a^2+b^2)

	|QP| = |[(n+at)-x, (m+bt)-y]| = distance from point to line

	point = (x, y), linePoint = (n, m), lineVector = [a, b]
	*/
	var t = (-(lineVector.x*linePoint.x)+(lineVector.x*point.x)-(lineVector.y*linePoint.y)+(lineVector.y*point.y))/(Math.pow(lineVector.x, 2)+Math.pow(lineVector.y, 2));
	// (-an+ax-bm+by)/(a^2+b^2)

	var collisionPoint = new Vector(linePoint.x+(lineVector.x*t), linePoint.y+(lineVector.y*t))
	var toLineVector = new Vector(collisionPoint.x-point.x, collisionPoint.y-point.y);
	var toLine = toLineVector.absolute();
	// |[(n+at)-x, (m+bt)-y]|

	return {toLine: toLine, collisionPoint: collisionPoint};
}
