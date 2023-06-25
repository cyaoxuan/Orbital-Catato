import {
    getItemWidthCols,
    getItemWidthFrac,
} from "../../app/utils/calculateItemWidths";

afterEach(() => {
    jest.clearAllMocks();
});

// Mock the Dimensions module
jest.mock("react-native", () => ({
    Dimensions: {
        get: jest.fn().mockReturnValue({ height: 600, width: 800 }),
    },
}));

describe("getItemWidthCols", () => {
    it("throws an error when noOfColumns or margin is missing", () => {
        expect(() => getItemWidthCols()).toThrow(
            "Missing noOfColumns or margin"
        );
        expect(() => getItemWidthCols(2)).toThrow(
            "Missing noOfColumns or margin"
        );
        expect(() => getItemWidthCols(null, 4)).toThrow(
            "Missing noOfColumns or margin"
        );
    });

    it("throws an error when noOfColumns or margin is not a number", () => {
        expect(() => getItemWidthCols("a", "b")).toThrow(
            "Non-number noOfColumns or margin"
        );
        expect(() => getItemWidthCols(2, "c")).toThrow(
            "Non-number noOfColumns or margin"
        );
        expect(() => getItemWidthCols("hello", 4)).toThrow(
            "Non-number noOfColumns or margin"
        );
    });

    it("throws an error when noOfColumns is negative", () => {
        expect(() => getItemWidthCols(-1, 4)).toThrow("Negative noOfColumns");
    });

    it("returns 0 when noOfColumns is 0", () => {
        expect(getItemWidthCols(0, 4)).toBe(0);
    });

    it("returns the correct width when noOfColumns = 1 and margin = 4", () => {
        const itemWidth = getItemWidthCols(1, 4);
        expect(itemWidth).toBe(792); // (800 - 4 * 2) / 1 = 792
    });

    it("returns the correct width when noOfColumns = 2 and margin = 4", () => {
        const itemWidth = getItemWidthCols(2, 4);
        expect(itemWidth).toBe(392); // (800 - 4 * 2 * 2) / 2 = 392
    });

    it("returns the correct width when noOfColumns = 2 and margin = 0", () => {
        const itemWidth = getItemWidthCols(2, 0);
        expect(itemWidth).toBe(400); // (800 - 0 * 2 * 2) / 2 = 400
    });

    it("returns the correct width when noOfColumns = 2 and margin = -4", () => {
        const itemWidth = getItemWidthCols(2, -4);
        expect(itemWidth).toBe(408); // (800 - (-4) * 2 * 2) / 2 = 408
    });
});

describe("getItemWidthFrac", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("throws an error when frac is missing", () => {
        expect(() => getItemWidthFrac()).toThrow("Missing frac");
        expect(() => getItemWidthFrac(null)).toThrow("Missing frac");
    });

    it("throws an error when frac is not a number", () => {
        expect(() => getItemWidthFrac("a")).toThrow("Non-number frac");
    });

    it("throws an error when frac is negative", () => {
        expect(() => getItemWidthFrac(-0.5)).toThrow("Negative frac");
    });

    it("returns 0 when frac is 0", () => {
        expect(getItemWidthFrac(0)).toBe(0);
    });

    it("returns the correct width when frac = 3/4 (< 1)", () => {
        const itemWidth = getItemWidthFrac(3 / 4);
        expect(itemWidth).toBe(600); // 800 * 0.75 = 600
    });

    it("returns the correct width when frac = 5/4 (> 1)", () => {
        const itemWidth = getItemWidthFrac(5 / 4);
        expect(itemWidth).toBe(1000); // 800 * 5 / 4 = 1000
    });

    it("returns the original dimension width when frac = 1", () => {
        const itemWidth = getItemWidthFrac(1);
        expect(itemWidth).toBe(800); // 800 * 1 = 800
    });
});
