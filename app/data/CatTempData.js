// Temp data to showcase static pages
const cats = [{
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
    concernDesc: "Seen limping, possibly right front leg injured"
}, {
    catID: 2,
    name: "Skitty",
    photoURLs: [
        require("../../assets/cats/cat-2-1.jpg"), 
        require("../../assets/cats/cat-2-2.jpg"),
        require("../../assets/cats/cat-2-3.jpg"),
        require("../../assets/cats/cat-2-4.jpg"),
        require("../../assets/cats/cat-2-5.jpg"),
    ],
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
    photoURLs: [
        require("../../assets/cats/cat-3-1.jpg"), 
        require("../../assets/cats/cat-3-2.jpg"),
        require("../../assets/cats/cat-3-3.jpg"),
        require("../../assets/cats/cat-3-4.jpg"),
    ],
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
    photoURLs: [
        require("../../assets/cats/cat-4-1.jpg"), 
        require("../../assets/cats/cat-4-2.jpg"),
        require("../../assets/cats/cat-4-3.jpg"),
    ],
    gender: "M",
    birthYear: 2022,
    sterilised: true,
    keyFeatures: "Slightly chubby tabby and meows alot",
    lastSeenLocation: "Arts",
    lastSeenTime: new Date(2023, 4, 20, 9, 16, 0, 0),
    lastFedTime: new Date(2023, 4, 19, 20, 47, 0, 0),
    concernStatus: [], // If the array is empty it's healthy
    concernDesc: null
}, {
    catID: 5,
    name: "Nully",
    photoURLs: [],
    gender: null,
    birthYear: null,
    sterilised: false,
    keyFeatures: null,
    lastSeenLocation: null,
    lastSeenTime: null,
    lastFedTime: null,
    concernStatus: [],
    concernDesc: null
}];

export { cats }