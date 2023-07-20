import {
    IconTextField,
    IconTextFieldRow,
    KeyTextField,
} from "../../app/components/InfoText";
import { cleanup, render } from "@testing-library/react-native";

afterEach(cleanup);

describe("<IconTextField />", () => {
    it("renders successfully", () => {
        const iconTextField = render(<IconTextField />);
        expect(iconTextField).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<IconTextField />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders icon", () => {
        const { getByTestId } = render(<IconTextField />);
        const icon = getByTestId("icon");
        expect(icon).toBeDefined();
    });

    it("displays field and info prop", () => {
        const { queryByText } = render(
            <IconTextField field="Hello" info="World!" />
        );
        expect(queryByText("Hello")).not.toBeNull();
        expect(queryByText("World!")).not.toBeNull();
    });
});

describe("<IconTextFieldRow />", () => {
    it("renders successfully", () => {
        const iconTextField = render(<IconTextFieldRow />);
        expect(iconTextField).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<IconTextFieldRow />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders icon", () => {
        const { getByTestId } = render(<IconTextFieldRow />);
        const icon = getByTestId("icon");
        expect(icon).toBeDefined();
    });

    it("displays field and info prop", () => {
        const { queryByText } = render(
            <IconTextFieldRow field="Hello: " info="World!" />
        );
        expect(queryByText("Hello: World!")).not.toBeNull();
    });
});

describe("<KeyTextField />", () => {
    it("renders successfully", () => {
        const keyTextField = render(<KeyTextField />);
        expect(keyTextField).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<KeyTextField />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("displays field prop", () => {
        const { queryByText } = render(<KeyTextField field="Hello" />);
        expect(queryByText("Hello")).not.toBeNull();
    });

    it("displays info prop", () => {
        const { queryByText } = render(<KeyTextField info="World" />);
        expect(queryByText("World")).not.toBeNull();
    });
});
