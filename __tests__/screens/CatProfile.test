import { cleanup, fireEvent, render } from "@testing-library/react-native";
import {
    CatProfile,
    CatProfileScreen,
} from "../../app/screens/main/catalogue/CatProfile";

afterEach(cleanup);

// Set time
beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 5, 20, 13, 12, 0, 0));
});

afterAll(() => {
    jest.useRealTimers();
});

// Mock getCat(catID)
jest.mock("../../app/screens/main/catalogue/CatProfile", () => {
    const originalModule = jest.requireActual(
        "../../app/screens/main/catalogue/CatProfile"
    );

    const cats = [
        {
            catID: 1,
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
            gender: "M",
            birthYear: 2019,
            sterilised: true,
            keyFeatures: "Grey tabby and loves to sleep on his back",
            lastSeenLocation: "Engineering", // Will eventually be a geohash
            lastSeenTime: new Date(2023, 4, 19, 14, 21, 0, 0), // Will be converted from firebase timestamp
            lastFedTime: new Date(2023, 4, 19, 12, 1, 0, 0),
            concernStatus: ["Injured"],
            concernDesc: "Seen limping, possibly right front leg injured",
        },
    ];

    const mockGetCat = jest.fn((catID) =>
        cats.find((cat) => cat.catID === catID)
    );
    return {
        ...originalModule,
        getCat: mockGetCat,
    };
});

// Mock useNavigation.navigate
const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

// Clearing all mocks because navigate is called twice
afterEach(() => {
    jest.clearAllMocks();
});

// Mock useRoute
jest.mock("@react-navigation/native", () => ({
    useRoute: jest.fn(() => ({
        params: {
            catID: 1,
        },
    })),
}));

describe("<CatProfileScreen />", () => {
    it("renders CatProfileScreen successfully", () => {
        const profileContainer = render(<CatProfileScreen />);
        expect(profileContainer).toBeDefined();
    });

    it("renders 'Cat not found' message if cat is not found", () => {
        const { getByText } = render(<CatProfileScreen catID={6} />);
        const notFoundMessage = getByText("Cat not found: 6");
        expect(notFoundMessage).toBeDefined();
    });

    it("renders CatProfileScreen with cat correctly", () => {
        const tree = render(<CatProfileScreen catID={1} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("navigates to PhotoGallery when 'PhotosContainer' is pressed", () => {
        const { getByTestId } = render(<CatProfileScreen catID={1} />);
        const galleryButton = getByTestId("view-button");

        fireEvent.press(galleryButton);

        expect(mockNavigate).toHaveBeenCalledWith("PhotoGallery", {
            catID: 1,
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
        });
    });

    it("navigates to Update Cat screen when 'Update Cat' button is pressed", () => {
        const { getByTestId } = render(<CatProfileScreen catID={1} />);
        const buttonContainerOuterLayer = getByTestId(
            "button-container-outer-layer"
        );
        const buttonContainer = buttonContainerOuterLayer.findByProps({
            testID: "button-container",
        });
        const button = buttonContainer.findByProps({ testID: "button" });
        fireEvent.press(button);

        expect(mockNavigate).toHaveBeenCalledWith("update", {
            screen: "Update",
            params: {
                cat: {
                    catID: 1,
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
                    gender: "M",
                    birthYear: 2019,
                    sterilised: true,
                    keyFeatures: "Grey tabby and loves to sleep on his back",
                    concernStatus: ["Injured"],
                    concernDesc:
                        "Seen limping, possibly right front leg injured",
                },
            },
        });
    });
});
