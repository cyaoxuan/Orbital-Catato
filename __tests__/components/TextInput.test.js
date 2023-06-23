import { AuthInput, PasswordInput } from "../../app/components/TextInput";
import { cleanup, fireEvent, render } from "@testing-library/react-native";

afterEach(cleanup);

describe("<AuthInput />", () => {
    it("renders successfully", () => {
        const authInput = render(<AuthInput />);
        expect(authInput).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<AuthInput />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders icon", () => {
        const { getByTestId } = render(<AuthInput />);
        const icon = getByTestId("icon");
        expect(icon).toBeDefined();
    });

    it("apply value when changing text", () => {
        const { getByTestId } = render(<AuthInput />);
        const authInput = getByTestId("input");
        fireEvent.changeText(authInput, "hello");
        expect(authInput.props.value).toBe("hello");
    });

    it("displays label prop", () => {
        const { queryAllByText } = render(<AuthInput label="Meow!" />);
        expect(queryAllByText("Meow!")).not.toBeNull();
    });
});

describe("<PasswordInput />", () => {
    it("renders successfully", () => {
        const keyTextField = render(<PasswordInput />);
        expect(keyTextField).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<PasswordInput />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders the icon", () => {
        const { getByTestId } = render(<AuthInput />);
        const icon = getByTestId("icon");
        expect(icon).toBeDefined();
    });

    it("apply value when changing text", () => {
        const { getByTestId } = render(<PasswordInput />);
        const passwordInput = getByTestId("input");
        fireEvent.changeText(passwordInput, "hello");
        expect(passwordInput.props.value).toBe("hello");
    });

    it("reveal hidden text when click eye icon", () => {
        const { getByTestId } = render(<PasswordInput />);
        const passwordInput = getByTestId("input");
        const hideIcon = getByTestId("hide-icon");

        fireEvent.press(hideIcon);
        expect(passwordInput.props.secureTextEntry).toBe(false);

        fireEvent.press(hideIcon);
        expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it("displays label prop", () => {
        const { queryAllByText } = render(<PasswordInput label="Meow!" />);
        expect(queryAllByText("Meow!")).not.toBeNull();
    });
});
