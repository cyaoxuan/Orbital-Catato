import { cleanup, fireEvent, render } from "@testing-library/react-native";
import PhotoGallery from "../../app/screens/main/catalogue/PhotoGallery";

afterEach(cleanup)

jest.mock("@react-navigation/native", () => ({
    useRoute: jest.fn(() => ({
      params: {
        name: "Kitty",
        photoURLs: [
            require("../../assets/cats/cat-1-1.jpg"), 
            require("../../assets/cats/cat-1-2.jpg"),
            require("../../assets/cats/cat-1-3.jpg"),
            require("../../assets/cats/cat-1-4.jpg"),
            require("../../assets/cats/cat-1-5.jpg"),
            require("../../assets/cats/cat-1-6.jpg"),
            require("../../assets/cats/cat-1-7.jpg"),
        ],
      },
    })),
}));

describe("<PhotoGallery />", () => {
    it("renders photo gallery successfully", () => {
        const photoGallery = render(<PhotoGallery />);
        expect(photoGallery).toBeDefined();
    });

    it("renders photo gallery correctly", () => {
        const tree = render(<PhotoGallery />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders correct number of photos in gallery", () => {
        const { getAllByTestId } = render(<PhotoGallery />);
        const photos = getAllByTestId("gallery-photo");
        expect(photos).toHaveLength(7);
    });

    it("renders FAB group successfully", () => {
        const { getByTestId } = render(<PhotoGallery />);
        const fabGroup = getByTestId("fab-group");
        expect(fabGroup).toBeDefined();
    });
});