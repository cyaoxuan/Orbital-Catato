import { Dimensions } from "react-native";

// Get width of preview photos in CatProfile / cards in SelectCats
export function getItemWidthCols(noOfColumns, margin) {
    if ((!noOfColumns && noOfColumns !== 0) || (!margin && margin !== 0)) {
        throw new Error("Missing noOfColumns or margin");
    } else if (isNaN(noOfColumns) || isNaN(margin)) {
        throw new Error("Non-number noOfColumns or margin");
    } else if (noOfColumns < 0) {
        throw new Error("Negative noOfColumns");
    } else if (noOfColumns === 0) {
        return 0;
    }

    const { height, width } = Dimensions.get("window");
    // Width of screen - margins between images (8 * margin) / 4
    const itemWidth = (width - margin * 2 * noOfColumns) / noOfColumns;
    return itemWidth;
}

// Calculate card width in Carousel in Dashboard
export function getItemWidthFrac(frac) {
    if (!frac && frac !== 0) {
        throw new Error("Missing frac");
    } else if (isNaN(frac)) {
        throw new Error("Non-number frac");
    } else if (frac < 0) {
        throw new Error("Negative frac");
    }
    // Card is fraction the width of a screen
    const { height, width } = Dimensions.get("window");
    const itemWidth = width * frac;
    return itemWidth;
}
