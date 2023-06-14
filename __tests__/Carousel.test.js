import { render, fireEvent } from "@testing-library/react-native";
import { getInfo1, CardCarousel } from "../app/components/Carousel";

const cats = [{
    catID: 1,
    name: "Kitty",
    photoURLs: [require("../assets/temp-cat.jpg"), require("../assets/catato-logo.png")],
    lastSeenLocation: "Engineering", 
    lastFedTime: new Date(2023, 4, 19, 12, 1, 0, 0), 
    concernStatus: ["Injured"], 
}, {
    catID: 2,
    name: "Skitty",
    photoURLs: [require("../assets/temp-cat.jpg")],
    lastSeenLocation: "Utown",
    lastSeenTime: new Date(2023, 4, 20, 10, 53, 0, 0),
    lastFedTime: null,
    concernStatus: ["New", "Injured"],
}, {
    catID: 3,
    name: "Mitty",
    photoURLs: [require("../assets/temp-cat.jpg")],
    lastSeenLocation: "Science",
    lastSeenTime: new Date(2023, 4, 15, 18, 34, 0, 0),
    lastFedTime: new Date(2023, 4, 15, 18, 34, 0, 0),
    concernStatus: ["Missing"],
},];

const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("getInfo1", () => {
    test("concern, cat concern array with one element", () => {
        expect(getInfo1("concern", {concernStatus: ["Injured"]})).toBe("Injured");
    });

    test("concern, cat concern array with more than one element", () => {
        expect(getInfo1("concern", {concernStatus: ["Injured", "Missing", "New"]})).toBe("Injured, Missing, New");
    });

    test("concern, cat concern array is empty", () => {
        expect(getInfo1("concern", {concernStatus: []})).toBe("");
    });

    test("concern, cat is null", () => {
        expect(getInfo1("concern", null)).toBe("Unknown");
    });

    test("carouselType is null, cat is present", () => {
        expect(getInfo1(null, {concernStatus: [], lastFedTime: new Date(2023, 4, 15, 18, 34, 0, 0)})).toBe("Unknown");
    });

    test("unfed, valid lastFedTime", () => {
        expect(getInfo1("unfed", {lastFedTime: new Date(2023, 4, 19, 12, 1, 0, 0)})).toBe("19/05, 12:01");
    });

    test("unfed, lastFedTime is null", () => {
        expect(getInfo1("unfed", {lastFedTime: null})).toBe("Unknown");
    });
})

describe("<CardCarousel />", () => {
  it("renders carousel successfully", () => {
    const { getByTestId } = render(
      <CardCarousel />
    );
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

  it("navigates to correct cat profile when card is pressed", () => {
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

    fireEvent.press(catCards[0]);

    expect(mockNavigate).toHaveBeenCalledWith("catalogue", {
      screen: "CatProfile",
      initial: false,
      params: { catID: cats[0].catID },
    });
  });
});