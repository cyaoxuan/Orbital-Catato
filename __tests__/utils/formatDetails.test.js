import {
    formatAge,
    formatLastSeen,
    formatLastSeenSimple,
    formatLastFed,
    formatLastFedSimple,
} from "../../app/utils/formatDetails";

// Set time
beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 5, 11, 12, 0, 0));
});

afterAll(() => {
    jest.useRealTimers();
});

afterEach(() => {
    jest.clearAllMocks();
});

const mockTimestamp12h = {
    toDate() {
        return new Date(2023, 5, 11, 0, 0, 0); // June 11, 2023 08:00
    },
};

const mockTimestamp2d = {
    toDate() {
        return new Date(2023, 5, 9, 12, 0, 0); // June 9, 2023 20:00
    },
};

describe("formatAge", () => {
    it("throws error when birthYear is invalid", () => {
        expect(() => formatAge()).toThrow("Invalid birthYear");
        expect(() => formatAge(null)).toThrow("Invalid birthYear");
        expect(() => formatAge("abc")).toThrow("Invalid birthYear");
        expect(() => formatAge(-2000)).toThrow("Invalid birthYear");
        expect(() => formatAge(3000)).toThrow("Invalid birthYear");
    });

    it("returns correct formatted age when birthYear is currentYear", () => {
        const age = formatAge(2023);
        expect(age).toBe("0y");
    });

    it("returns correct formatted age when birthYear is 2020", () => {
        const age = formatAge(2020);
        expect(age).toBe("3y");
    });
});

describe("formatLastSeen", () => {
    it("throws error when locationName or lastSeenTime is missing", () => {
        expect(() => formatLastSeen()).toThrow(
            "Missing locationName or lastSeenTime"
        );
        expect(() => formatLastSeen("Location")).toThrow(
            "Missing locationName or lastSeenTime"
        );
        expect(() => formatLastSeen(null, mockTimestamp12h)).toThrow(
            "Missing locationName or lastSeenTime"
        );
    });

    it("throws error when locationName is not string", () => {
        expect(() => formatLastSeen(123, mockTimestamp12h)).toThrow(
            "locationName is not String"
        );
    });

    it("returns correct formatted string with lastSeenTime 12h ago", () => {
        const formattedString = formatLastSeen("Location", mockTimestamp12h);
        expect(formattedString).toBe("Location, 11/06, 08:00 (12h ago)");
    });

    it("returns correct formatted string with lastSeenTime 2d ago", () => {
        const formattedString = formatLastSeen("Location", mockTimestamp2d);
        expect(formattedString).toBe("Location, 09/06, 20:00 (2d ago)");
    });
});

describe("formatLastSeenSimple", () => {
    it("throws error when locationName or lastSeenTime is missing", () => {
        expect(() => formatLastSeenSimple()).toThrow(
            "Missing locationName or lastSeenTime"
        );
        expect(() => formatLastSeenSimple("Location")).toThrow(
            "Missing locationName or lastSeenTime"
        );
        expect(() => formatLastSeenSimple(null, mockTimestamp12h)).toThrow(
            "Missing locationName or lastSeenTime"
        );
    });

    it("throws error when locationName is not string or lastSeenTime is not Timestamp", () => {
        expect(() => formatLastSeenSimple(123, mockTimestamp12h)).toThrow(
            "locationName is not String"
        );
    });

    it("returns correct formatted string with lastSeenTime 12h ago", () => {
        const formattedString = formatLastSeenSimple(
            "Location",
            mockTimestamp12h
        );
        expect(formattedString).toBe("Location (12h)");
    });

    it("returns correct formatted string with lastSeenTime 2d ago", () => {
        const formattedString = formatLastSeenSimple(
            "Location",
            mockTimestamp2d
        );
        expect(formattedString).toBe("Location (2d)");
    });
});

describe("formatLastFed", () => {
    it("throws error when lastFedTime is missing", () => {
        expect(() => formatLastFed()).toThrow("Missing lastFedTime");
        expect(() => formatLastFed(null)).toThrow("Missing lastFedTime");
    });

    it("returns correct formatted string with lastFedTime 12h ago", () => {
        const formattedString = formatLastFed(mockTimestamp12h);
        expect(formattedString).toBe("11/06, 08:00 (12h ago)");
    });

    it("returns correct formatted string with lastFedTime 2d ago", () => {
        const formattedString = formatLastFed(mockTimestamp2d);
        expect(formattedString).toBe("09/06, 20:00 (2d ago)");
    });
});

describe("formatLastFedSimple", () => {
    it("throws error when lastFedTime is missing", () => {
        expect(() => formatLastFedSimple()).toThrow("Missing lastFedTime");
        expect(() => formatLastFedSimple(null)).toThrow("Missing lastFedTime");
    });

    it("returns correct formatted string with lastFednTime 12h ago", () => {
        const formattedString = formatLastFedSimple(mockTimestamp12h);
        expect(formattedString).toBe("11/06, 08:00 (12h)");
    });

    it("returns correct formatted string with lastFedTime 2d ago", () => {
        const formattedString = formatLastFedSimple(mockTimestamp2d);
        expect(formattedString).toBe("09/06, 20:00 (2d)");
    });
});
