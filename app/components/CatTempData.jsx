// Temp data to showcase static pages

const catViewProps = [{
    iconName1: "information-circle",
    field1: "Status: ",
    iconName2: "location",
    field2: "Last Seen: "
}, {
    iconName1: "time",
    field1: "Last Fed: ",
    iconName2: "location",
    field2: "Last Seen: "
}];

const concernCatCards = [{
    catImage: require("../../assets/temp-cat.jpg"),
    catName: "Kitty",
    iconName1: catViewProps[0].iconName1,
    field1: catViewProps[0].field1,
    info1: "Injured",
    iconName2: catViewProps[0].iconName2,
    field2: catViewProps[0].field2,
    info2: "Engineering"
}, {
    catImage: require("../../assets/temp-cat.jpg"),
    catName: "Skitty",
    iconName1: catViewProps[0].iconName1,
    field1: catViewProps[0].field1,
    info1: "New",
    iconName2: catViewProps[0].iconName2,
    field2: catViewProps[0].field2,
    info2: "Utown"
}, {
    catImage: require("../../assets/temp-cat.jpg"),
    catName: "Mitty",
    iconName1: catViewProps[0].iconName1,
    field1: catViewProps[0].field1,
    info1: "Missing",
    iconName2: catViewProps[0].iconName2,
    field2: catViewProps[0].field2,
    info2: "Science"
}, {
    catImage: require("../../assets/temp-cat.jpg"),
    catName: "Bitty",
    iconName1: catViewProps[0].iconName1,
    field1: catViewProps[0].field1,
    info1: "Injured",
    iconName2: catViewProps[0].iconName2,
    field2: catViewProps[0].field2,
    info2: "Arts"
}];

const fedCatCards = [{
    catImage: require("../../assets/temp-cat.jpg"),
    catName: "Kitty",
    iconName1: catViewProps[1].iconName1,
    field1: catViewProps[1].field1,
    info1: "19/05 12:01",
    iconName2: catViewProps[1].iconName2,
    field2: catViewProps[1].field2,
    info2: "Engineering"
}];

export { concernCatCards, fedCatCards }