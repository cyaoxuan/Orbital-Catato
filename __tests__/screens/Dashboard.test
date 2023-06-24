import { cleanup, render } from "@testing-library/react-native";
import Dashboard, { CarouselContainer } from "../../app/screens/main/Dashboard";
import { cats } from "../../app/data/CatTempData";

afterEach(cleanup);

// Set time
beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 5, 20, 13, 12, 0, 0));
});

afterAll(() => {
    jest.useRealTimers();
});

// Eventual Call from DB
function getConcernCats() {
    const concernCats = cats.filter(
        (cat) => cat.concernStatus && cat.concernStatus.length != 0
    );
    return concernCats;
}

// Eventual Call from DB
function getUnfedCats() {
    const unfedCats = cats.filter((cat) => {
        let today = new Date(2023, 5, 20, 13, 12, 0, 0);
        return cat.lastFedTime && (today - cat.lastFedTime) / 3600000 > 12;
    });
    return unfedCats;
}

jest.mock("../../app/utils/context/auth", () => ({
    useAuth: jest.fn().mockReturnValue({
        user: {
            /* mocked user object */
        },
    }),
}));

jest.mock("expo-router", () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

describe("<Dashboard />", () => {
    it("renders dashboard successfully", () => {
        const dashboard = render(<Dashboard />);
        expect(dashboard).toBeDefined();
    });

    it("renders concern and unfed carousel successfully", () => {
        const { getAllByTestId } = render(<Dashboard />);
        const carousels = getAllByTestId("card-carousel");
        expect(carousels).toHaveLength(2);
    });

    it("renders concern carousel with cat cards correctly", () => {
        const tree = render(
            <CarouselContainer
                titleText="Cats of Concern"
                subtitleText="New, Injured, Missing for 3 Days"
                carouselType="concern"
                cats={getConcernCats()}
                cardWidth={300}
                iconName1="alert-circle-outline"
                field1="Status: "
                iconName2="location"
                field2="Last Seen: "
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("renders unfed carousel with cat cards correctly", () => {
        const tree = render(
            <CarouselContainer
                titleText="Unfed Cats"
                subtitleText="Not Fed in 12 Hours"
                carouselType="unfed "
                cats={getUnfedCats()}
                cardWidth={300}
                iconName1="time-outline"
                field1="Last Fed: "
                iconName2="location"
                field2="Last Seen: "
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it("displays title prop", () => {
        const title = "Kitty";
        const { queryByText } = render(<CarouselContainer titleText={title} />);
        expect(queryByText(title)).not.toBeNull();
    });

    it("displays subtitle prop", () => {
        const subtitle = "Skitty";
        const { queryByText } = render(
            <CarouselContainer subtitleText={subtitle} />
        );
        expect(queryByText(subtitle)).not.toBeNull();
    });
});
