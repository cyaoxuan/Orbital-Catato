import {
    FilterButton,
    PillButton,
    TextButton,
} from "../../app/components/Button";
import { cleanup, fireEvent, render } from "@testing-library/react-native";

afterEach(cleanup);

describe("<PillButton />", () => {
    it("renders successfully", () => {
        const pillButton = render(<PillButton />);
        expect(pillButton).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<PillButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onPress callback when button is pressed", () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(<PillButton onPress={onPressMock} />);
        const buttonContainerOuterLayer = getByTestId(
            "button-container-outer-layer"
        );
        const buttonContainer = buttonContainerOuterLayer.findByProps({
            testID: "button-container",
        });
        const button = buttonContainer.findByProps({ testID: "button" });
        fireEvent.press(button);
        expect(onPressMock).toHaveBeenCalled();
    });

    it("renders disabled button correctly", () => {
        const { getByTestId } = render(<PillButton disabled={true} />);
        const buttonContainerOuterLayer = getByTestId(
            "button-container-outer-layer"
        );
        const buttonContainer = buttonContainerOuterLayer.findByProps({
            testID: "button-container",
        });
        const button = buttonContainer.findByProps({ testID: "button" });
        expect(button.props.disabled).toBe(true);
    });

    it("displays label prop", () => {
        const { queryByText } = render(<PillButton label="Meow!" />);
        expect(queryByText("Meow!")).not.toBeNull();
    });
});

describe("<TextButton />", () => {
    it("renders successfully", () => {
        const { getByText } = render(<TextButton />);
        expect(getByText("Button")).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<TextButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onPress callback when button is pressed", () => {
        const onPressMock = jest.fn();
        const { getByText } = render(<TextButton onPress={onPressMock} />);
        const button = getByText("Button");
        fireEvent.press(button);
        expect(onPressMock).toHaveBeenCalled();
    });

    it("renders disabled button correctly", () => {
        const { getByTestId } = render(<TextButton disabled={true} />);
        const buttonContainerOuterLayer = getByTestId(
            "button-container-outer-layer"
        );
        const buttonContainer = buttonContainerOuterLayer.findByProps({
            testID: "button-container",
        });
        const button = buttonContainer.findByProps({ testID: "button" });
        expect(button.props.disabled).toBe(true);
    });

    it("displays label prop", () => {
        const { queryByText } = render(<TextButton label="Click Me!" />);
        expect(queryByText("Click Me!")).not.toBeNull();
    });
});

describe("<FilterButton />", () => {
    it("renders successfully", () => {
        const { getByText } = render(<FilterButton />);
        expect(getByText("First")).toBeDefined();
        expect(getByText("Second")).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<FilterButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onValueChange callback when a button is pressed", () => {
        const onValueChangeMock = jest.fn();
        const { getByText } = render(
            <FilterButton onValueChange={onValueChangeMock} />
        );
        const firstButton = getByText("First");
        fireEvent.press(firstButton);
        expect(onValueChangeMock).toHaveBeenCalledWith("First");

        const secondButton = getByText("Second");
        fireEvent.press(secondButton);
        expect(onValueChangeMock).toHaveBeenCalledWith("Second");
    });

    it("renders disabled button correctly", () => {
        const { getByRole } = render(
            <FilterButton
                firstValue="First"
                secondValue="Second"
                disabled={true}
            />
        );

        const firstButton = getByRole("button", { name: "First" });
        const secondButton = getByRole("button", { name: "Second" });

        expect(firstButton.props.accessibilityState.disabled).toBe(true);
        expect(secondButton.props.accessibilityState.disabled).toBe(true);
    });

    it("displays custom values for buttons", () => {
        const { queryByText } = render(
            <FilterButton firstValue="Option 1" secondValue="Option 2" />
        );
        expect(queryByText("Option 1")).not.toBeNull();
        expect(queryByText("Option 2")).not.toBeNull();
    });
});
