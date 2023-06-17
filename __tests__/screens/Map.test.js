import { render } from "@testing-library/react-native";
import Map from "../../app/screens/main/Map";

jest.mock("react-native-maps", () => {
    const { View } = require("react-native");

    const MockMapView = (props) => {
        const {testID, children, ...rest} = props;
        return <View {...{...rest, testID}}>{children}</View>;
    }
    const MockMarker = (props) => {
        return <View>{props.children}</View>;
    };
    return {
        __esModule: true,
        default: MockMapView,
        Marker: MockMarker,
        PROVIDER_GOOGLE: "google",
    };
});

describe('Map Screen', () => {
    it("renders MapView successfully", () => {
        const { getByTestId } = render(<Map />);
        expect(getByTestId("map")).toBeDefined();
    });

    it("renders MapView correctly", () => {
        const tree = render(<Map />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});