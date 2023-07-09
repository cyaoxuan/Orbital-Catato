import { cleanup, render, fireEvent } from "@testing-library/react-native";
import { getInfo1, CardCarousel } from "../../app/components/Carousel";

afterEach(cleanup);

beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 5, 16, 13, 12, 0, 0));
});

afterAll(() => {
    jest.useRealTimers();
});

const cats = [
    {
        catID: 1,
        name: "Kitty",
        photoURLs: [
            require("../../assets/cats/cat-2-1.jpg"),
            require("../../assets/cats/cat-2-1.jpg"),
        ],
        lastSeenLocation: { latitude: 1, longitude: 1 },
        locationName: "E1",
        locationZone: "Engineering",
        lastSeenTime: {
            toDate() {
                return new Date(2023, 4, 20, 10, 53, 0, 0);
            },
        },
        lastFedTime: {
            toDate() {
                return new Date(2023, 4, 19, 12, 1, 0, 0);
            },
        },
        concernStatus: {
            injured: true,
            missing: false,
            new: false,
            unfed: false,
        },
    },
    {
        catID: 2,
        name: "Skitty",
        photoURLs: [require("../../assets/cats/cat-2-1.jpg")],
        locationName: "SRC",
        locationZone: "Utown",
        lastSeenTime: {
            toDate() {
                return new Date(2023, 4, 20, 10, 53, 0, 0);
            },
        },
        lastFedTime: {
            toDate() {
                return new Date(2023, 4, 20, 10, 53, 0, 0);
            },
        },
        concernStatus: {
            injured: true,
            missing: false,
            new: true,
            unfed: false,
        },
    },
    {
        catID: 3,
        name: "Mitty",
        photoURLs: [require("../../assets/cats/cat-2-1.jpg")],
        locationName: "S17",
        locationZone: "Science",
        lastSeenTime: {
            toDate() {
                new Date(2023, 4, 15, 18, 34, 0, 0);
            },
        },
        lastFedTime: {
            toDate() {
                new Date(2023, 4, 15, 18, 34, 0, 0);
            },
        },
        concernStatus: {
            injured: false,
            missing: true,
            new: false,
            unfed: false,
        },
    },
];

const userRole = {
    isGuest: true,
    isUser: true,
    isCaretaker: true,
    isAdmin: false,
};

const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

describe("getInfo1", () => {
    test("Return Unknown when carouselType and cat are null", () => {
        expect(getInfo1(null, null)).toBe("Unknown");
        expect(
            getInfo1(null, {
                concernStatus: [],
                lastFedTime: {
                    toDate() {
                        return new Date(2023, 4, 15, 18, 34, 0, 0);
                    },
                },
            })
        ).toBe("Unknown");
        expect(getInfo1("concern", null)).toBe("Unknown");
    });

    test("Return Unknown when carouselType is concern, concernStatus is null", () => {
        expect(getInfo1("concern", { concernStatus: null })).toBe("Unknown");
    });

    test("Return Unknown when carouselType is concern, concernStatus is empty object", () => {
        expect(getInfo1("concern", { concernStatus: {} })).toBe("Unknown");
    });

    test("Return Unknown when carouselType is unfed, lastFedTime is null", () => {
        expect(getInfo1("unfed", { lastFedTime: null })).toBe("Unknown");
    });

    test("Return correct string when carouselType is concern, concernStatus only has one true", () => {
        expect(
            getInfo1("concern", {
                concernStatus: {
                    injured: true,
                    missing: false,
                    new: false,
                    unfed: false,
                },
            })
        ).toBe("Injured");
    });

    test("Return correct string when carouselType is concern, concernStatus has more than one true", () => {
        expect(
            getInfo1("concern", {
                concernStatus: {
                    injured: true,
                    missing: true,
                    new: true,
                    unfed: false,
                },
            })
        ).toBe("Injured, Missing, New");
    });

    test("Return correct string when carouselType is unfed, valid lastFedTime", () => {
        expect(
            getInfo1("unfed", {
                lastFedTime: {
                    toDate() {
                        return new Date(2023, 4, 19, 12, 1, 0, 0);
                    },
                },
            })
        ).toBe("19/05, 20:01 (28d)");
    });
});

describe("<CardCarousel />", () => {
    it("renders carousel successfully", () => {
        const { getByTestId } = render(<CardCarousel />);
        const carousel = getByTestId("card-carousel");
        expect(carousel).toBeDefined();
    });

    it("renders carousel with cat cards correctly", () => {
        const cardWidth = 300;
        const carouselType = "concern";

        const tree = render(
            <CardCarousel
                cats={cats}
                cardWidth={cardWidth}
                carouselType={carouselType}
                userRole={userRole}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("renders correct number of cards", () => {
        const cardWidth = 200;
        const carouselType = "concern";

        const { getAllByTestId } = render(
            <CardCarousel
                cats={cats}
                cardWidth={cardWidth}
                carouselType={carouselType}
                userRole={userRole}
            />
        );

        const catCards = getAllByTestId("card");
        expect(catCards).toHaveLength(cats.length);
    });

    it("navigates to correct cat profile when profile button is pressed", () => {
        const cardWidth = 200;
        const carouselType = "concern";

        const { getAllByTestId } = render(
            <CardCarousel
                cats={cats}
                cardWidth={cardWidth}
                carouselType={carouselType}
                userRole={userRole}
            />
        );

        const catCards = getAllByTestId("card");
        const buttons = catCards[0].findAllByProps({ testID: "button" });

        fireEvent.press(buttons[0]);

        expect(mockNavigate).toHaveBeenCalledWith("catalogue", {
            screen: "CatProfile",
            initial: false,
            params: { catID: cats[0].catID },
        });
    });

    it("navigates to map when locate button is pressed", () => {
        const cardWidth = 200;
        const carouselType = "concern";

        const { getAllByTestId } = render(
            <CardCarousel
                cats={cats.splice(0, 1)}
                cardWidth={cardWidth}
                carouselType={carouselType}
                userRole={userRole}
            />
        );

        const catCards = getAllByTestId("card");
        const buttons = catCards[0].findAllByProps({ testID: "button" });

        fireEvent.press(buttons[6]);

        expect(mockNavigate).toHaveBeenCalledWith("Map", {
            catID: 1,
            location: { latitude: 1, longitude: 1 },
        });
    });
});
