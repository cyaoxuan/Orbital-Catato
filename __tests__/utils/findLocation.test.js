import * as Location from "expo-location";
import {
    processPolygonCoordinates,
    processLocation,
    isInZone,
    getNearestBuilding,
    getRandomBuilding,
} from "../../app/utils/findLocation";

// For spying on functions
const locUtils = require("../../app/utils/findLocation");

// Mocking necessary dependencies
jest.mock("expo-location", () => ({
    Accuracy: { Low: 3 },
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
}));

// Mocking data
jest.mock("../../app/data/locationData", () => {
    const locations = [
        {
            key: "1",
            value: "Use Current Location",
        },
        {
            key: "2",
            value: "The Deck",
            location: {
                latitude: 1.2945075717691477,
                longitude: 103.77256063897944,
            },
            zone: "Arts",
        },
        {
            key: "3",
            value: "AS1",
            location: {
                latitude: 1.2951454107251619,
                longitude: 103.77213443414018,
            },
            zone: "Arts",
        },
    ];

    return {
        __esModule: true,
        locationjson: {
            "User Location": {
                key: "1",
                value: "Use Current Location",
            },
            "The Deck": {
                key: "2",
                value: "The Deck",
                location: {
                    latitude: 1.2945075717691477,
                    longitude: 103.77256063897944,
                },
                zone: "Arts",
            },
            AS1: {
                key: "3",
                value: "AS1",
                location: {
                    latitude: 1.2951454107251619,
                    longitude: 103.77213443414018,
                },
                zone: "Arts",
            },
        },
        locations,
        zonejson: {
            NUS: [
                103.7714373396691, 1.304922129248384, 11.87814699266378,
                103.7723678351256, 1.303230216014438, 6.901042849174135,
                103.7719728838784, 1.302599892479904, 12.38353650457693,
                103.7711884983648, 1.302772231999518, 13.38724659825944,
                103.7700542781815, 1.300095236335122, 28.48024194001673,
                103.7696746861296, 1.294921380682045, 8.529708957555123,
                103.7696062044599, 1.294675095760531, 11.45732318715921,
                103.7694108402042, 1.294213159899782, 9.670075839274702,
                103.769297594288, 1.293947315377458, 4.578268983366556,
                103.7691324616243, 1.293589205030886, 4.732210754714446,
                103.7700849139696, 1.292660847912006, 8.040040361146579,
                103.7704240470137, 1.292585004021794, 10.07688900948073,
                103.7704930753673, 1.292402944615975, 7.926921126924961,
                103.7727454149797, 1.29244912188725, 18.40663994955399,
                103.7735685366555, 1.292293576463821, 12.320239854349,
                103.7733987810474, 1.291839640038206, 9.949411282163357,
                103.77377289613, 1.291677381263468, 5.973810345488473,
                103.7760485109136, 1.290691600583399, 7.658329938622332,
                103.7763148695059, 1.290838305128488, 10.87407803239021,
                103.778054333502, 1.2901194477425, 9.792595685130983,
                103.7787495932817, 1.290433463278852, 9.84023813184348,
                103.779258695352, 1.289327165128971, 7.364571527207861,
                103.7819897049839, 1.289816449688616, 27.11966238231774,
                103.7825060741788, 1.290609552908459, 35.9478989865552,
                103.7857363133486, 1.293979073841685, 26.86358623331921,
                103.7830922072691, 1.29707504459118, 16.50125029050067,
                103.7771579256045, 1.300677795088443, 9.223748320975595,
                103.7744358962385, 1.3023007368525, 10.12198469721846,
                103.7735721578048, 1.303120847527408, 7.229314495565527,
                103.7756677109437, 1.303807221493284, 16.54258319174429,
                103.7746137451576, 1.304574527166445, 20.64418972027116,
                103.7743033485141, 1.30596850030766, 21.56481847830447,
                103.773666058666, 1.307298286299473, 22.40681372218174,
                103.7739279494454, 1.308617586277619, 24.99801589226071,
                103.7719386237476, 1.309336406518379, 20.78315116577074,
                103.7714373396691, 1.304922129248384, 11.87814699266378,
            ],
            Arts: [],
        },
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

// Tests
describe("processPolygonCoordinates", () => {
    test("throws error when polygon is null", () => {
        expect(() => {
            processPolygonCoordinates(null);
        }).toThrow("Missing polygon");
    });

    test("throws error when polygon length is less than 9", () => {
        expect(() => {
            processPolygonCoordinates([1, 2, 3, 4, 5, 6, 7, 8]);
        }).toThrow("Incomplete coordinates or less than two coordinates given");
    });

    test("returns correct array", () => {
        const polygon = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
        const expectedArray = [
            [
                { latitude: 2, longitude: 1 },
                { latitude: 2, longitude: 1 },
                { latitude: 2, longitude: 1 },
                { latitude: 2, longitude: 1 },
                { latitude: 2, longitude: 1 },
            ],
            [
                [2, 1],
                [2, 1],
                [2, 1],
                [2, 1],
                [2, 1],
            ],
            [
                [1, 1, 1, 1, 1],
                [2, 2, 2, 2, 2],
            ],
        ];
        expect(processPolygonCoordinates(polygon)).toEqual(expectedArray);
    });
});

describe("isInZone", () => {
    test("throws error when zoneName or currLocation is null", () => {
        expect(() => {
            isInZone(null, {});
        }).toThrow("Missing zoneName or currLocation");

        expect(() => {
            isInZone("NUS", null);
        }).toThrow("Missing zoneName or currLocation");
    });

    test("throws error when zoneName is not found in zonejson", () => {
        expect(() => {
            isInZone("nonexistentZone", { latitude: 1, longitude: 2 });
        }).toThrow("zoneName not in zonejson");
    });

    test("throws error when currLocation has no latitude or longitude property", () => {
        expect(() => {
            isInZone("NUS", {});
        }).toThrow("No latitude or longitude in currLocation");
    });

    test("returns true when currLocation is in zone", () => {
        jest.spyOn(locUtils, "processPolygonCoordinates").mockReturnValueOnce([
            [
                { latitude: 0, longitude: 0 },
                { latitude: 2, longitude: 1 },
                { latitude: 0, longitude: 2 },
            ],
            [],
            [],
        ]);

        const currLocation = { latitude: 1, longitude: 1 };
        expect(isInZone("NUS", currLocation)).toBe(true);
    });

    test("returns true when currLocation is on bounding line", () => {
        jest.spyOn(locUtils, "processPolygonCoordinates").mockReturnValueOnce([
            [
                { latitude: 0, longitude: 0 },
                { latitude: 2, longitude: 1 },
                { latitude: 0, longitude: 2 },
            ],
            [],
            [],
        ]);

        const currLocation = { latitude: 1, longitude: 0.5 };
        expect(isInZone("NUS", currLocation)).toBe(true);
    });

    test("returns false when currLocation is not in zone", () => {
        jest.spyOn(locUtils, "processPolygonCoordinates").mockReturnValueOnce([
            [
                { latitude: 0, longitude: 0 },
                { latitude: 2, longitude: 1 },
                { latitude: 0, longitude: 2 },
            ],
            [],
            [],
        ]);

        const currLocation = { latitude: 2, longitude: 2 };
        expect(isInZone("NUS", currLocation)).toBe(false);
    });
});

describe("getNearestBuilding", () => {
    test("throws error when currLocation is null", () => {
        expect(() => {
            getNearestBuilding(null);
        }).toThrow("Missing currLocation");
    });

    test("throws error when currLocation has no latitude or longitude property", () => {
        expect(() => {
            getNearestBuilding({});
        }).toThrow("No latitude or longitude in currLocation");
    });

    test("returns correct location object", () => {
        const currLocation = {
            latitude: 1.2947728510172478,
            longitude: 103.77281837376574,
        };
        const expectedLocation = {
            key: "2",
            value: "The Deck",
            location: {
                latitude: 1.2945075717691477,
                longitude: 103.77256063897944,
            },
            zone: "Arts",
        };
        expect(getNearestBuilding(currLocation)).toEqual(expectedLocation);
    });
});

describe("getRandomBuilding", () => {
    test("throws error when zoneName is null", () => {
        expect(() => {
            getRandomBuilding(null);
        }).toThrow("Missing zoneName");
    });

    test("throws error when zoneName is not found in zonejson", () => {
        expect(() => {
            getRandomBuilding("nonexistentZone");
        }).toThrow("zoneName not in zonejson");
    });

    // Mocked array seems to have errors, but otherwise this functions works fine
    // Will reattempt testing it
    test("returns name of a random location in zone", () => {
        jest.spyOn(Math, "random").mockReturnValue(0.5);
        const zoneName = "Arts";
        const randomBuilding = getRandomBuilding(zoneName);
        expect(randomBuilding.latitude).toBe(1.2951454107251619);
        expect(randomBuilding.longitude).toBe(103.77213443414018);
    });
});

describe("processLocation", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("throws error when location access is not given when 'Use Current Location' is selected", async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
            status: "denied",
        });

        await expect(
            processLocation("Use Current Location")
        ).rejects.toThrowError("Locations permissions denied");
    });

    it("throws error when user's location is off when 'Use Current Location' is selected", async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
            status: "granted",
        });
        Location.getCurrentPositionAsync.mockRejectedValueOnce(
            new Error("User location off")
        );

        await expect(
            processLocation("Use Current Location")
        ).rejects.toThrowError("User location off");
    });

    it("returns coordinates, locationName, and locationZone correctly when 'Use Current Location' is selected inside NUS", async () => {
        jest.spyOn(locUtils, "isInZone").mockReturnValue(true);
        jest.spyOn(locUtils, "getNearestBuilding").mockReturnValue({
            value: "Location Name",
            zone: "Location Zone",
        });

        Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
            status: "granted",
        });
        Location.getCurrentPositionAsync.mockResolvedValueOnce({
            coords: { latitude: 1, longitude: 103 },
        });

        const result = await processLocation("Use Current Location");

        expect(result).toEqual({
            coords: { latitude: 1, longitude: 103 },
            locationName: "Location Name",
            locationZone: "Location Zone",
        });
        expect(isInZone).toHaveBeenCalledWith("NUS", {
            latitude: 1,
            longitude: 103,
        });
        expect(getNearestBuilding).toHaveBeenCalledWith({
            latitude: 1,
            longitude: 103,
        });
    });

    it("returns coordinates, locationName, and locationZone correctly when 'Use Current Location' is selected outside NUS", async () => {
        jest.spyOn(locUtils, "isInZone").mockReturnValue(false);
        Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
            status: "granted",
        });
        Location.getCurrentPositionAsync.mockResolvedValueOnce({
            coords: { latitude: 1, longitude: 2 },
        });

        const result = await processLocation("Use Current Location");

        expect(result).toEqual({
            coords: { latitude: 1, longitude: 2 },
            locationName: "Outside NUS",
            locationZone: "Outside NUS",
        });
        expect(isInZone).toHaveBeenCalledWith("NUS", {
            latitude: 1,
            longitude: 2,
        });
    });

    it("returns coordinates, locationName, and locationZone correctly when other locations are used", async () => {
        const result = await processLocation("The Deck");

        expect(result).toEqual({
            coords: {
                latitude: 1.2945075717691477,
                longitude: 103.77256063897944,
            },
            locationName: "The Deck",
            locationZone: "Arts",
        });
    });
});
