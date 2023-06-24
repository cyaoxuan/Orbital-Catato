import { cleanup, render, fireEvent } from "@testing-library/react-native";
import Catalogue from "../../app/screens/main/catalogue/Catalogue";
import { cats } from "../../app/data/CatTempData";

afterEach(cleanup);

const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

describe("<Catalogue />", () => {
    it("renders catalogue successfully", () => {
        const { getByTestId } = render(<Catalogue />);
        const carousel = getByTestId("catalogue");
        expect(carousel).toBeDefined();
    });

    it("renders catalogue with cat cards correctly", () => {
        const tree = render(<Catalogue />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("navigates to correct cat profile when card is pressed", () => {
        const { getAllByTestId } = render(<Catalogue />);

        const catAvatars = getAllByTestId("cat-avatar");
        expect(catAvatars).toHaveLength(5);

        fireEvent.press(catAvatars[0]);

        expect(mockNavigate).toHaveBeenCalledWith("CatProfile", {
            catID: cats[0].catID,
        });
    });
});
