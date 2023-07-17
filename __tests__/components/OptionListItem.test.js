import {
    OptionListItem,
    OptionListItemIcon,
    SwitchListItem,
} from "../../app/components/OptionListItem";
import { cleanup, fireEvent, render } from "@testing-library/react-native";

afterEach(cleanup);

describe("<OptionListItem />", () => {
    it("renders successfully", () => {
        const { getByText } = render(<OptionListItem title="Option" />);
        const listItem = getByText("Option");
        expect(listItem).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<OptionListItem />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onPress callback when item is pressed", () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <OptionListItem title="Option" onPress={onPressMock} />
        );
        const listItem = getByText("Option");
        fireEvent.press(listItem);
        expect(onPressMock).toHaveBeenCalled();
    });
});

describe("<OptionListItemIcon />", () => {
    it("renders successfully", () => {
        const { getByText } = render(
            <OptionListItemIcon title="Option" iconName="checkmark" />
        );
        const listItem = getByText("Option");
        expect(listItem).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<OptionListItemIcon />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onPress callback when item is pressed", () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <OptionListItemIcon
                title="Option"
                iconName="checkmark"
                onPress={onPressMock}
            />
        );
        const listItem = getByText("Option");
        fireEvent.press(listItem);
        expect(onPressMock).toHaveBeenCalled();
    });
});

describe("<SwitchListItem />", () => {
    it("renders successfully", () => {
        const { getByText } = render(
            <SwitchListItem title="Option" value={true} />
        );
        const listItem = getByText("Option");
        expect(listItem).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<SwitchListItem />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onValueChange callback when switch value is changed", () => {
        const onValueChangeMock = jest.fn();
        const { getByRole } = render(
            <SwitchListItem
                title="Option"
                value={true}
                onValueChange={onValueChangeMock}
            />
        );
        const switchInput = getByRole("switch");
        fireEvent(switchInput, "valueChange", false);
        expect(onValueChangeMock).toHaveBeenCalledWith(false);
    });
});
