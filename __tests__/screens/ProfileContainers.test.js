import { cleanup, fireEvent, render } from "@testing-library/react-native";
import { cats } from "../../app/data/CatTempData";
import { AvatarContainer, 
    KeyInfoContainer, 
    DetailsContainer, 
    PreviewPhotos, 
    PhotosContainer,
 } from "../../app/screens/main/catalogue/ProfileContainers";

afterEach(cleanup);

// Set time
beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2023, 5, 20, 13, 12, 0, 0));
});

afterAll(() => {
    jest.useRealTimers();
});

describe("<AvatarContainer />", () => {
    it("renders avatar container successfully", () => {
        const avatarContainer = render(<AvatarContainer />);
        expect(avatarContainer).toBeDefined();
    });

    it("renders avatar container correctly", () => {
        const tree = render(<AvatarContainer />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<KeyInfoContainer />", () => {
    it("renders keyinfo container successfully", () => {
        const keyInfoContainer = render(<KeyInfoContainer cat={cats[0]} />);
        expect(keyInfoContainer).toBeDefined();
    });

    it("renders keyinfo container successfully", () => {
        const tree = render(<KeyInfoContainer cat={cats[0]} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders keyinfo container with null cat fields correctly", () => {
        const { getAllByText } = render(<KeyInfoContainer cat={cats[4]}/>);
        const nullAgeGender = getAllByText("?");
        const falseSterilised = getAllByText("No");
        expect(nullAgeGender).toHaveLength(2);
        expect(falseSterilised).toHaveLength(1);
    });
});

describe("<DetailsContainer />", () => {
    it("renders details container successfully", () => {
        const detailsContainer = render(<DetailsContainer cat={cats[0]} variant="headlineSmall" />);
        expect(detailsContainer).toBeDefined();
    });

    it("renders details container correctly", () => {
        const tree = render(<DetailsContainer cat={cats[0]} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders details container with null cat fields correctly", () => {
        const { getAllByText } = render(<DetailsContainer cat={cats[4]}/>);
        const nullFeaturesTimes = getAllByText("Unknown");
        const emptyConcernArray = getAllByText("Healthy");
        const nullConcernsString = getAllByText("The cat is happy and healthy!");
        expect(nullFeaturesTimes).toHaveLength(3);
        expect(emptyConcernArray).toHaveLength(1);
        expect(nullConcernsString).toHaveLength(1);
    });
});

describe("<PreviewPhotos />", () => {
    it("renders preview photos successfully", () => {
        const photosContainer = render(<PreviewPhotos />);
        expect(photosContainer).toBeDefined();
    });

    it("renders preview photos without photoURLs", () => {
        const { getByText } = render(<PreviewPhotos />);
        const noPhotosText = getByText("This cat has no photos!");
        expect(noPhotosText).toBeDefined();
    });

    it("renders only the first 4 preview photos when photoURLs.length > 4", () => {
        const { getAllByTestId } = render(<PreviewPhotos photoURLs={cats[0].photoURLs} />);
        const previewPhotos = getAllByTestId("preview-photo");
        expect(previewPhotos).toHaveLength(4);
    });

    it("renders photos container correctly photoURLs.length < 4", () => {
        const tree = render(<PreviewPhotos photoURLs={cats[3].photoURLs} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("<PhotosContainer />", () => {
    it("renders photos container successfully", () => {
        const photosContainer = render(<PhotosContainer />);
        expect(photosContainer).toBeDefined();
    });

    it("renders photos container correctly", () => {
        const tree = render(<PhotosContainer photoURLs={cats[0].photoURLs} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls onPress callback when touchable is pressed", () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(<PhotosContainer onPress={onPressMock} />);
        const viewTouchable = getByTestId("view-button");
        fireEvent.press(viewTouchable);
        expect(onPressMock).toHaveBeenCalled();
    });
});