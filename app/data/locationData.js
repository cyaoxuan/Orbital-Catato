// JSON file format
// {
//     "User Location": {
//         "key": "1",
//         "value": "Use Current Location"
//     },
//     "The Deck": {
//         "key": "2",
//         "value": "The Deck",
//         "location": {"latitude": 1.2945075717691477, "longitude": 103.77256063897944},
//         "zone": "Arts"
//     },...
// }

const locationjson = require("./location.json");
const locations = Object.values(locationjson);
const zonejson = require("./zone.json");

export { locations, locationjson, zonejson };
