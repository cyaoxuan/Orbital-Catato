import * as Location from "expo-location";
import {
    processLocation,
    isInZone,
    getNearestBuilding,
} from "../../app/utils/findLocation";

// Mocking the necessary dependencies
jest.mock("expo-location", () => ({
    Accuracy: { Low: 3 },
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
}));

// Tests
describe("processLocation", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("throws an error when location access is not given when 'Use Current Location' is selected", async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
            status: "denied",
        });

        await expect(
            processLocation("Use Current Location")
        ).rejects.toThrowError("Locations permissions denied");
    });

    it("throws an error when user's location is off when 'Use Current Location' is selected", async () => {
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

    it("returns the coordinates, locationName, and locationZone correctly when 'Use Current Location' is selected inside NUS", async () => {
        const locUtils = require("../../app/utils/findLocation");
        jest.spyOn(locUtils, "isInZone").mockReturnValue(true);
        jest.spyOn(locUtils, "getNearestBuilding").mockReturnValue({
            value: "Location Name",
            zone: "Location Zone",
        });
        // const isInZone = jest.fn().mockReturnValue(true);
        // const getNearestBuilding = jest
        //     .fn()
        //     .mockReturnValue({ value: "Location Name", zone: "Location Zone" });

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

    it("returns the coordinates, locationName, and locationZone correctly when 'Use Current Location' is selected outside NUS", async () => {
        const locUtils = require("../../app/utils/findLocation");
        jest.spyOn(locUtils, "isInZone").mockReturnValue(false);

        // const isInZone = jest.fn().mockReturnValue(false);

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

    it("returns the coordinates, locationName, and locationZone correctly when other locations are used", async () => {
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
