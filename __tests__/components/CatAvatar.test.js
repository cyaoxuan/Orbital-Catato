import { CatAvatar, TouchableCatAvatar } from "../../app/components/CatAvatar";
import { fireEvent, render } from "@testing-library/react-native";

describe("<CatAvatar />", () => {
    it("renders successfully", () => {
        const catAvatar = render(<CatAvatar />);
        expect(catAvatar).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<CatAvatar />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders avatar with correct photoURL", () => {
        const photoURL = require("../../assets/cats/cat-2-1.jpg");
        const { getByTestId } = render(<CatAvatar photoURL={photoURL} />);
        const avatar = getByTestId("avatar-image");
        expect(avatar.props.source.uri).toBe(photoURL);
    });

    it("displays name prop", () => {
        const name = "Kitty";
        const { queryByText } = render(<CatAvatar name={name} />);
        expect(queryByText(name)).not.toBeNull();
    });
});

describe("<TouchableCatAvatar />", () => {
    it("renders successfully", () => {
        const touchableCatAvatar = render(<TouchableCatAvatar />);
        expect(touchableCatAvatar).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<TouchableCatAvatar />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders TouchableOpacity with correct onPress callback", () => {
        const onPressMock = jest.fn();
        const { queryByText } = render(
            <TouchableCatAvatar name="Kitty" onPress={onPressMock} />
        );
        const touchableOpacity = queryByText("Kitty");
        fireEvent.press(touchableOpacity);
        expect(onPressMock).toHaveBeenCalled();
    });

    it("displays name prop", () => {
        const name = "Kitty";
        const { queryByText } = render(<TouchableCatAvatar name={name} />);
        expect(queryByText(name)).not.toBeNull();
    });
});
