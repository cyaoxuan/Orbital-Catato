import {
    BodyText,
    ErrorText,
    RequiredFormText,
    TitleText,
} from "../../app/components/TextComponents";
import { cleanup, render } from "@testing-library/react-native";

afterEach(cleanup);

describe("<BodyText />", () => {
    it("renders successfully", () => {
        const { getByText } = render(<BodyText text="Hello" />);
        const bodyText = getByText("Hello");
        expect(bodyText).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<BodyText />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<ErrorText />", () => {
    it("renders successfully", () => {
        const { getByText } = render(<ErrorText text="Error" />);
        const errorText = getByText("Error");
        expect(errorText).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<ErrorText />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<RequiredFormText />", () => {
    it("renders successfully", () => {
        const { getByText } = render(<RequiredFormText text="Required" />);
        const requiredFormText = getByText("*Required");
        expect(requiredFormText).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<RequiredFormText />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<TitleText />", () => {
    it("renders successfully", () => {
        const { getByText } = render(<TitleText text="Title" />);
        const titleText = getByText("Title");
        expect(titleText).toBeDefined();
    });

    it("renders correctly", () => {
        const tree = render(<TitleText />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
