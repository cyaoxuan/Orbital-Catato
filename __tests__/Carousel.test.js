import { render, fireEvent } from "@testing-library/react-native";
import { CardCarousel } from "../app/components/Carousel";
import { cats } from "../app/data/CatTempData"

const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("CardCarousel", () => {
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