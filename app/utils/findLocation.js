import { locations, zonejson } from "../data/locationData";

// proccesses long/lat/alt format from kml file to {lat: , long: }, [lat, long] or [[long], [lat]]
function processPolygonCoordinates(polygon) {
    var i = polygon.length;
    while (i--) {
        (i + 1) % 3 === 0 && polygon.splice(i, 1);
    }
    const polygonArr = [];
    const polygonObj = [];
    const latArr = [];
    const longArr = [];

    for (let i = 0; i < polygon.length; i += 2) {
        polygonObj.push({ latitude: polygon[i + 1], longitude: polygon[i] });
        polygonArr.push([polygon[i + 1], polygon[i]]);
        latArr.push(polygon[i + 1]);
        longArr.push(polygon[i]);
    }

    return [polygonObj, polygonArr, [longArr, latArr]];
}

// Checks if point is in a polygon
// Checks intersection with bounding lines (odd/even), referenced from G4G
export function isInZone(zoneName, currLocation) {
    function onLine(line, loc) {
        if (
            loc.longitude <= Math.max(line.p1.longitude, line.p2.longitude) &&
            loc.longitude >= Math.min(line.p1.longitude, line.p2.longitude) &&
            loc.latitude <= Math.max(line.p1.latitude, line.p2.latitude) &&
            loc.latitude >= Math.min(line.p1.latitude, line.p2.latitude)
        ) {
            return true;
        }
        return false;
    }
    function direction(a, b, c) {
        let val =
            (b.latitude - a.latitude) * (c.longitude - b.longitude) -
            (b.longitude - a.longitude) * (c.latitude - b.latitude);
        if (val === 0) {
            return 0;
        } else if (val < 0) {
            return 2;
        } else {
            return 1;
        }
    }
    function isIntersect(l1, l2) {
        let dir1 = direction(l1.p1, l1.p2, l2.p1);
        let dir2 = direction(l1.p1, l1.p2, l2.p2);
        let dir3 = direction(l2.p1, l2.p2, l1.p1);
        let dir4 = direction(l2.p1, l2.p2, l1.p2);

        if (dir1 != dir2 && dir3 != dir4) return true;

        if (dir1 == 0 && onLine(l1, l2.p1)) return true;

        if (dir2 == 0 && onLine(l1, l2.p2)) return true;

        if (dir3 == 0 && onLine(l2, l1.p1)) return true;

        if (dir4 == 0 && onLine(l2, l1.p2)) return true;

        return false;
    }
    function checkInside(polygon, loc) {
        const n = polygon.length;

        if (n < 3) return false;

        let temp = { longitude: 9999, latitude: loc.latitude };
        let exline = { p1: loc, p2: temp };
        let count = 0;
        let i = 0;
        do {
            let side = { p1: polygon[i], p2: polygon[(i + 1) % n] };
            if (isIntersect(side, exline)) {
                if (direction(side.p1, loc, side.p2) == 0) {
                    return onLine(side, loc);
                }
                count++;
            }
            i = (i + 1) % n;
        } while (i != 0);

        // When count is odd
        return count & 1;
    }

    // gets zone from zonejson
    const zone = processPolygonCoordinates(zonejson[zoneName]);
    return checkInside(zone, currLocation);
}

// Uses Haversine formula
function calcGreatCircle(loc1, loc2) {
    const meanEarthRadius = 6371e3; // metres
    const latRadians1 = (loc1.latitude * Math.PI) / 180;
    const latRadians2 = (loc2.latitude * Math.PI) / 180;
    const latDiffRadians = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const longDiffRadians = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a =
        Math.sin(latDiffRadians / 2) * Math.sin(latDiffRadians / 2) +
        Math.cos(latRadians1) *
            Math.cos(latRadians2) *
            Math.sin(longDiffRadians / 2) *
            Math.sin(longDiffRadians / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = meanEarthRadius * c; // in metres

    return d;
}

// Returns the location object (key, value, location, zone) of the nearest location to currLocation
export function getNearestBuilding(currLocation) {
    const nearestLocations = [...locations.splice(1, locations.length)];
    let minDistance = Infinity;
    let minLoc = 0;
    let currDistance;

    for (var i = 0; i < nearestLocations.length; i++) {
        currDistance = calcGreatCircle(
            currLocation,
            nearestLocations[i].location
        );
        if (currDistance < minDistance) {
            minDistance = currDistance;
            minLoc = i;
        }
    }
    return nearestLocations[minLoc];
}

// Return name of randomised location in a zone
export function getRandomBuilding(zone) {
    const locationsInZone = [
        ...locations
            .splice(1, locations.length)
            .filter((loc) => loc.zone === zone),
    ];
    const randNum = Math.floor(Math.random() * locationsInZone.length);
    return locationsInZone[randNum].value;
}
