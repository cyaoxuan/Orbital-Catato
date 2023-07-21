import { cleanup, render, fireEvent } from "@testing-library/react-native";
import {
    DropdownList,
    FormInput,
    NumberSpinner,
    TimeInput,
    TwoRadioInput,
    UploadPhotos,
} from "../../app/components/FormComponents";

// Set time
beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 5, 11, 12, 0, 0));
});

afterAll(() => {
    jest.useRealTimers();
});

afterEach(cleanup);

describe("<DropdownList />", () => {
    it("renders successfully", () => {
        const dropdownList = render(<DropdownList />);
        expect(dropdownList).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<DropdownList />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("does not display menu by default", () => {
        const options = [{ key: "1", value: "Option 1" }];
        const { queryByText } = render(
            <DropdownList titleText="Select an option" data={options} />
        );
        expect(queryByText("Option 1")).toBeNull();
    });

    it("opens menu when clicking on bar", () => {
        const options = [{ key: "1", value: "Option 1" }];
        const { getByText } = render(
            <DropdownList titleText="Select an option" data={options} />
        );

        const openMenu = getByText("Select option");
        fireEvent.press(openMenu);
        expect(getByText("Option 1")).not.toBeNull();
    });
});

describe("<FormInput />", () => {
    it("renders successfully", () => {
        const formInput = render(<FormInput />);
        expect(formInput).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<FormInput />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("displays label prop", () => {
        const { queryAllByText } = render(<FormInput label="Meow!" />);
        expect(queryAllByText("Meow!")).not.toBeNull();
    });

    it("applies value when changing text", () => {
        const { getByTestId } = render(<FormInput />);
        const formInput = getByTestId("form-input");

        fireEvent.changeText(formInput, "hello");

        expect(formInput.props.value).toBe("hello");
    });

    it("displays error when value is empty", () => {
        const { getByText } = render(<FormInput />);

        const errorText = getByText("Error: Error");
        expect(errorText).not.toBeNull();
    });
});

describe("<NumberSpinner />", () => {
    it("renders successfully", () => {
        const numberSpinner = render(<NumberSpinner />);
        expect(numberSpinner).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<NumberSpinner />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<TimeInput />", () => {
    it("renders successfully", () => {
        const timeInput = render(
            <TimeInput
                displayTime={new Date(23, 6, 2)}
                today={new Date(23, 6, 3)}
            />
        );
        expect(timeInput).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(
            <TimeInput
                displayTime={new Date(23, 6, 2)}
                today={new Date(23, 6, 3)}
            />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<TwoRadioInput />", () => {
    it("renders successfully", () => {
        const twoRadioInput = render(<TwoRadioInput />);
        expect(twoRadioInput).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<TwoRadioInput />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<UploadPhotos />", () => {
    it("renders successfully", () => {
        const uploadPhotos = render(<UploadPhotos />);
        expect(uploadPhotos).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<UploadPhotos />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
