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
        locationName: "Engineering",
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
        concernStatus: ["Injured"],
    },
    {
        catID: 2,
        name: "Skitty",
        photoURLs: [require("../../assets/cats/cat-2-1.jpg")],
        locationName: "Utown",
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
        concernStatus: ["New", "Injured"],
    },
    {
        catID: 3,
        name: "Mitty",
        photoURLs: [require("../../assets/cats/cat-2-1.jpg")],
        locationName: "Science",
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
        concernStatus: ["Missing"],
    },
];

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

    test("Return empty string when carouselType is concern, concernStatus is empty", () => {
        expect(getInfo1("concern", { concernStatus: [] })).toBe("");
    });

    test("Return Unknown when carouselType is unfed, lastFedTime is null", () => {
        expect(getInfo1("unfed", { lastFedTime: null })).toBe("Unknown");
    });

    test("Return correct string when carouselType is concern, concernStatus array with one element", () => {
        expect(getInfo1("concern", { concernStatus: ["Injured"] })).toBe(
            "Injured"
        );
    });

    test("Return correct string when carouselType is concern, concernStatus array with more than one element", () => {
        expect(
            getInfo1("concern", {
                concernStatus: ["Injured", "Missing", "New"],
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
            />
        );

        const catCards = getAllByTestId("card");
        const buttons = catCards[0].findAllByProps({ testID: "button" });

        fireEvent.press(buttons[6]);

        expect(mockNavigate).toHaveBeenCalledWith("Map", {
            location: { latitude: 1, longitude: 1 },
        });
    });
});
