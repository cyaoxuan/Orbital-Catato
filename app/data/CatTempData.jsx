// Temp data to showcase static pages
const cats = [{
    // For Select FlatList
    catID: 0,
    name: "New Cat",
    photoURL: require("../../assets/placeholder.png"),
    gender: null,
    birthYear: null,
    sterilised: null,
    keyFeatures: null,
    lastSeenLocation: null,
    lastSeenTime: null,
    lastFedTime: null,
    concernStatus: null,
    concernDesc: null
},  {
    catID: 1,
    name: "Kitty",
    photoURL: require("../../assets/temp-cat.jpg"), // Will eventually be an array of 
    gender: "M",
    birthYear: 2019,
    sterilised: true,
    keyFeatures: "Grey tabby and loves to sleep on his back",
    lastSeenLocation: "Engineering", // Will eventually be a geohash
    lastSeenTime: new Date(2023, 5, 19, 14, 21, 0, 0), // Will be converted from firebase timestamp
    lastFedTime: new Date(2023, 5, 19, 12, 1, 0, 0), 
    concernStatus: ["Injured"], 
    concernDesc: "Seen limping, possibly right front leg injured"
}, {
    catID: 2,
    name: "Skitty",
    photoURL: require("../../assets/temp-cat.jpg"),
    gender: null,
    birthYear: null,
    sterilised: false,
    keyFeatures: null,
    lastSeenLocation: "Utown",
    lastSeenTime: new Date(2023, 5, 20, 10, 53, 0, 0),
    lastFedTime: null,
    concernStatus: ["New", "Injured"],
    concernDesc: "New and had wounds on body"
}, {
    catID: 3,
    name: "Mitty",
    photoURL: require("../../assets/temp-cat.jpg"),
    gender: "F",
    birthYear: 2020,
    sterilised: true,
    keyFeatures: "White with orange patches with a heart-shaped patch on its back, tends to climb up to high places",
    lastSeenLocation: "Science",
    lastSeenTime: new Date(2023, 5, 15, 18, 34, 0, 0),
    lastFedTime: new Date(2023, 5, 15, 18, 34, 0, 0),
    concernStatus: ["Missing"], // The database registers as missing past certain time?
    concernDesc: "Has not been seen in 5 days"
}, {
    catID: 4,
    name: "Bitty",
    photoURL: require("../../assets/temp-cat.jpg"),
    gender: "M",
    birthYear: 2022,
    sterilised: true,
    keyFeatures: "Slightly chubby tabby and meows alot",
    lastSeenLocation: "Arts",
    lastSeenTime: new Date(2023, 5, 20, 9, 16, 0, 0),
    lastFedTime: new Date(2023, 5, 19, 20, 47, 0, 0),
    concernStatus: [], // If the array is empty it's healthy
    concernDesc: null
}];

export { cats }