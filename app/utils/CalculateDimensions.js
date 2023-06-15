import { Dimensions } from "react-native";

// Get size of preview photos
export function getItemWidth(noOfColumns, margin) {
    if (noOfColumns < 1) return 0;

    const { height, width } = Dimensions.get("window");
    // Width of screen - margins between images (8 * margin) / 4
    const itemSize = (width - margin * 2 * noOfColumns) / noOfColumns;
    return itemSize;
}