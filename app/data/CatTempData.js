// Temp data to showcase static pages
const cats = [{
    catID: 1,
    name: "Kitty",
    photoURLs: [require("../../assets/temp-cat.jpg"), require("../../assets/catato-logo.png")],
    gender: "M",
    birthYear: 2019,
    sterilised: true,
    keyFeatures: "Grey tabby and loves to sleep on his back",
    lastSeenLocation: "Engineering", // Will eventually be a geohash
    lastSeenTime: new Date(2023, 4, 19, 14, 21, 0, 0), // Will be converted from firebase timestamp
    lastFedTime: new Date(2023, 4, 19, 12, 1, 0, 0), 
    concernStatus: ["Injured"], 
    concernDesc: "Seen limping, possibly right front leg injured"
}, {
    catID: 2,
    name: "Skitty",
    photoURLs: [require("../../assets/temp-cat.jpg")],
    gender: null,
    birthYear: null,
    sterilised: false,
    keyFeatures: null,
    lastSeenLocation: "Utown",
    lastSeenTime: new Date(2023, 4, 20, 10, 53, 0, 0),
    lastFedTime: null,
    concernStatus: ["New", "Injured"],
    concernDesc: "New and had wounds on body"
}, {
    catID: 3,
    name: "Mitty",
    photoURLs: [require("../../assets/temp-cat.jpg")],
    gender: "F",
    birthYear: 2020,
    sterilised: true,
    keyFeatures: "White with orange patches with a heart-shaped patch on its back, tends to climb up to high places",
    lastSeenLocation: "Science",
    lastSeenTime: new Date(2023, 4, 15, 18, 34, 0, 0),
    lastFedTime: new Date(2023, 4, 15, 18, 34, 0, 0),
    concernStatus: ["Missing"], // The database registers as missing past certain time?
    concernDesc: "Has not been seen in 5 days"
}, {
    catID: 4,
    name: "Bitty",
    photoURLs: [require("../../assets/temp-cat.jpg")],
    gender: "M",
    birthYear: 2022,
    sterilised: true,
    keyFeatures: "Slightly chubby tabby and meows alot",
    lastSeenLocation: "Arts",
    lastSeenTime: new Date(2023, 4, 20, 9, 16, 0, 0),
    lastFedTime: new Date(2023, 4, 19, 20, 47, 0, 0),
    concernStatus: [], // If the array is empty it's healthy
    concernDesc: null
}];

export { cats }