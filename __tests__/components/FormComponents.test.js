import { FormInput } from "../../app/components/FormComponents";
import { cleanup, render } from "@testing-library/react-native";

afterEach(cleanup)

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
});