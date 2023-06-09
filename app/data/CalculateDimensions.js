import { Dimensions } from "react-native";

// Get size of preview photos
export function getItemWidth(noOfItems, margin) {
    const { height, width } = Dimensions.get("window");
    // Width of screen - margins between images (8 * margin) / 4
    const itemSize = (width - margin * 2 * noOfItems) / noOfItems;
    return itemSize;
}
