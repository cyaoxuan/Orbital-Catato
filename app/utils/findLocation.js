import { locationjson, locations, zonejson } from "../data/locationData";
import * as Location from "expo-location";

// proccesses long/lat/alt format from kml file to {lat: , long: }, [lat, long] or [[long], [lat]]
// @param polygon: (flat array of long, lat, alt, long, lat, alt, ...)
// @return array with processed polygon
// @throw Error if invalid params
export function processPolygonCoordinates(polygon) {
    if (!polygon) {
        throw new Error("Missing polygon");
    } else if (polygon.length < 9) {
        throw new Error(
            "Incomplete coordinates or less than two coordinates given"
        );
    }

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
// @param zoneName: string, keys in zonejson
// @param currLocation: {latitude: , longitude: }
// @return boolean for if in zone
// @throw Error if invalid params
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
        return count % 2 !== 0;
    }

    if (!zoneName || !currLocation) {
        throw new Error("Missing zoneName or currLocation");
    } else if (!Object.prototype.hasOwnProperty.call(zonejson, zoneName)) {
        throw new Error("zoneName not in zonejson");
    } else if (!currLocation.latitude || !currLocation.longitude) {
        throw new Error("No latitude or longitude in currLocation");
    }

    if (!currLocation) {
        throw new Error("Missing currLocation");
    } else if (!currLocation.latitude || !currLocation.longitude) {
        throw new Error("No latitude or longitude in currLocation");
    }

    // gets zone from zonejson
    const zone = exports.processPolygonCoordinates(zonejson[zoneName])[0];
    return checkInside(zone, currLocation);
}

// Returns the location of the nearest location to currLocation
// @param currLocation: {latitude: , longitude: }
// @return location object (key, value, location, zone)
// @throw Error if invalid params
export function getNearestBuilding(currLocation) {
    // Uses Haversine formula
    function calcGreatCircle(loc1, loc2) {
        const meanEarthRadius = 6371e3; // metres
        const latRadians1 = (loc1.latitude * Math.PI) / 180;
        const latRadians2 = (loc2.latitude * Math.PI) / 180;
        const latDiffRadians =
            ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
        const longDiffRadians =
            ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

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
    if (!currLocation) {
        throw new Error("Missing currLocation");
    } else if (!currLocation.latitude || !currLocation.longitude) {
        throw new Error("No latitude or longitude in currLocation");
    }

    const nearestLocations = [...locations].splice(1, locations.length);
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

// Returns the location of randomised location in a zone
// @param currLocation: {latitude: , longitude: }
// @return location object (key, value, location, zone)
// @throw Error if invalid params
export function getRandomBuilding(zoneName) {
    if (!zoneName) {
        throw new Error("Missing zoneName");
    } else if (!Object.prototype.hasOwnProperty.call(zonejson, zoneName)) {
        throw new Error("zoneName not in zonejson");
    }

    const locationsInZone = [
        ...locations.filter((loc) => loc.key !== "1" && loc.zone === zoneName),
    ];
    const randNum = Math.floor(Math.random() * locationsInZone.length);
    return locationsInZone[randNum].location;
}

// Given user input from form, return location
// @param locationStr: string from location dropdown list data
// @return location object { coords, locationName, locationZone }
export const processLocation = async (locationStr) => {
    try {
        let coords, locationName, locationZone;
        if (locationStr == "Use Current Location") {
            // Get permission for current location
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Locations permissions denied");
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Low,
            });
            coords = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            };

            // Check if user is in NUS
            if (exports.isInZone("NUS", coords)) {
                // Get nearest building and zone user is in
                const locationObj = exports.getNearestBuilding(coords);
                locationName = locationObj.value;
                locationZone = locationObj.zone;
            } else {
                locationName = "Outside NUS";
                locationZone = "Outside NUS";
            }
        } else {
            // get coords of building
            const locationObj = locationjson[locationStr];
            coords = locationObj.location;
            locationName = locationObj.value;
            locationZone = locationObj.zone;
        }

        return { coords, locationName, locationZone };
    } catch (error) {
        console.error("Error in processLocation:", error);
        throw error;
    }
};
