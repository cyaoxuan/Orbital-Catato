import { PillButton } from "../app/components/Button";
import { fireEvent, render, shallow } from "@testing-library/react-native";

describe("<PillButton />", () => {
    it("renders correctly", () => {
        const tree = render(<PillButton />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onPress callback when button is pressed", () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(<PillButton onPress={onPressMock} />);
        const buttonContainerOuterLayer = getByTestId("button-container-outer-layer");
        const buttonContainer = buttonContainerOuterLayer.findByProps({ testID: "button-container" });
        const button = buttonContainer.findByProps({ testID: "button" });
        fireEvent.press(button);
        expect(onPressMock).toHaveBeenCalled();
    });

    it("renders disabled button correctly", () => {
        const { getByTestId } = render(<PillButton disabled={true} />);
        const buttonContainerOuterLayer = getByTestId("button-container-outer-layer");
        const buttonContainer = buttonContainerOuterLayer.findByProps({ testID: "button-container" });
        const button = buttonContainer.findByProps({ testID: "button" });
        expect(button.props.disabled).toBe(true);
    });

    it("displays the label prop", () => {
        const { queryByText } = render(<PillButton label="Meow!" />);
        expect(queryByText("Meow!")).not.toBeNull();
    });
});
