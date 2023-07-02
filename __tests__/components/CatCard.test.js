import { CatCard, CatCardSimple } from "../../app/components/CatCard";
import { cleanup, fireEvent, render } from "@testing-library/react-native";

afterEach(cleanup);

describe("<CatCard />", () => {
    it("renders successfully", () => {
        const catCard = render(<CatCard />);
        expect(catCard).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<CatCard />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders the cover image with the correct photoURL", () => {
        const photoURL = require("../../assets/cats/cat-2-1.jpg");
        const { getByTestId } = render(<CatCard photoURL={photoURL} />);
        const cover = getByTestId("cover-image");
        expect(cover.props.source.uri).toBe(photoURL);
    });

    it("calls onPress callback when card action is pressed", () => {
        const profileOnPressMock = jest.fn();
        const locationOnPressMock = jest.fn();
        const { getAllByTestId } = render(
            <CatCard
                profileOnPress={profileOnPressMock}
                locationOnPress={locationOnPressMock}
            />
        );
        const buttons = getAllByTestId("button");
        fireEvent.press(buttons[0]);
        fireEvent.press(buttons[1]);
        expect(profileOnPressMock).toHaveBeenCalled();
        expect(locationOnPressMock).toHaveBeenCalled();
    });

    it("displays the name prop", () => {
        const name = "Kitty";
        const { queryByText } = render(<CatCard name={name} />);
        expect(queryByText(name)).not.toBeNull();
    });
});

describe("<CatCardSimple />", () => {
    it("renders successfully", () => {
        const catCardSimple = render(<CatCardSimple />);
        expect(catCardSimple).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<CatCardSimple />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders the cover image with the correct photoURL", () => {
        const photoURL = "https://picsum.photos/id/237/400/400";
        const { getByTestId } = render(<CatCardSimple photoURL={photoURL} />);
        const cover = getByTestId("cover-image");
        expect(cover.props.source.uri).toBe(photoURL);
    });

    it("calls onPress callback when card is pressed", () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(<CatCardSimple onPress={onPressMock} />);
        const cardContainerOuterLayer = getByTestId(
            "card-container-outer-layer"
        );
        const cardContainer = cardContainerOuterLayer.findByProps({
            testID: "card-container",
        });
        const card = cardContainer.findByProps({ testID: "card" });
        fireEvent.press(card);
        expect(onPressMock).toHaveBeenCalled();
    });

    it("displays the name prop", () => {
        const name = "Kitty";
        const { queryByText } = render(<CatCardSimple name={name} />);
        expect(queryByText(name)).not.toBeNull();
    });
});
