import { CatAvatar, TouchableCatAvatar } from "../app/components/CatAvatar";
import { fireEvent, render } from "@testing-library/react-native";

describe("<CatAvatar />", () => {
    it("renders correctly", () => {
        const tree = render(<CatAvatar />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders the avatar with the correct photoURL", () => {
        const photoURL = require("../assets/temp-cat.jpg");
        const { getByTestId } = render(<CatAvatar photoURL={photoURL} />);
        const avatar = getByTestId("avatar-image");
        expect(avatar.props.source).toBe(photoURL);
    });

    it("displays the name prop", () => {
        const name = "Kitty";
        const { queryByText } = render(<CatAvatar name={name} />);
        const text = queryByText("Kitty");
        expect(text).not.toBeNull();
    });
});

describe("<TouchableCatAvatar />", () => {
    it("renders correctly", () => {
        const tree = render(<TouchableCatAvatar />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders TouchableOpacity with the correct onPress callback", () => {
        const onPressMock = jest.fn();
        const { queryByText } = render(<TouchableCatAvatar name="Kitty" onPress={onPressMock} />);
        const touchableOpacity = queryByText("Kitty");
        fireEvent.press(touchableOpacity);
        expect(onPressMock).toHaveBeenCalled();
    });

    it("displays the name prop", () => {
        const { queryByText } = render(<TouchableCatAvatar name="Meow!" />);
        expect(queryByText("Meow!")).not.toBeNull();
    });
});
