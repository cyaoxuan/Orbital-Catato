import {
    autoProcessUnfed,
    autoProcessMissing,
    autoProcessConcernStatus,
    processNewPhotoURLs,
    processNewConcernPhotoURLs,
} from "../../app/utils/db/cat";

// For spying on functions
const catUtils = require("../../app/utils/db/cat");

// Mock firebase and firestore modules
jest.mock("../../app/config/firebase", () => ({
    db: {},
}));

// Mock other Firestore functions and modules
jest.mock("firebase/firestore", () => ({
    Timestamp: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    or: jest.fn(),
    orderBy: jest.fn(),
    query: jest.fn(),
    serverTimestamp: jest.fn(),
    where: jest.fn(),
    writeBatch: jest.fn(),
}));

jest.mock("date-fns", () => ({
    sub: jest.fn(),
}));

// Mock the 'photo' module
jest.mock("../../app/utils/db/photo", () => ({
    uploadImageToStorage: jest.fn(),
}));

// Mock the 'findLocation' module
jest.mock("../../app/utils/findLocation", () => ({
    processLocation: jest.fn(),
}));

// Mock the 'noti' module
jest.mock("../../app/utils/noti", () => ({
    sendNoti: jest.fn(),
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe("processNewPhotoURLs", () => {
    test("throws error when queried with invalid catID", async () => {
        const invalidCatID = null;
        const photoURI = "testPhotoURI";

        await expect(
            processNewPhotoURLs(invalidCatID, photoURI, false)
        ).rejects.toThrow();
    });

    test("throws error when photoURI not provided", async () => {
        const validCatID = "testCatID";
        const missingPhotoURI = null;

        await expect(
            processNewPhotoURLs(validCatID, missingPhotoURI, false)
        ).rejects.toThrow();
    });

    test("correctly appends and returns array of photoURLs", async () => {
        const validCatID = "testCatID";
        const photoURI = "testPhotoURI";
        const downloadURL = "testDownloadURL";
        const uploadImageToStorage =
            require("../../app/utils/db/photo").uploadImageToStorage;
        uploadImageToStorage.mockResolvedValue(downloadURL);

        const cat = { photoURLs: ["oldURL1", "oldURL2"] };
        const getDoc = require("firebase/firestore").getDoc;
        getDoc.mockResolvedValue({ data: () => cat });

        const result = await processNewPhotoURLs(validCatID, photoURI, false);

        expect(result).toEqual(["oldURL1", "oldURL2", downloadURL]);
    });

    test("correctly sets profile pic and returns array of photoURLs", async () => {
        const validCatID = "testCatID";
        const photoURI = "testPhotoURI";
        const downloadURL = "testDownloadURL";
        const uploadImageToStorage =
            require("../../app/utils/db/photo").uploadImageToStorage;
        uploadImageToStorage.mockResolvedValue(downloadURL);

        const cat = { photoURLs: ["oldURL1", "oldURL2"] };
        const getDoc = require("firebase/firestore").getDoc;
        getDoc.mockResolvedValue({ data: () => cat });

        const result = await processNewPhotoURLs(validCatID, photoURI, true);

        expect(result).toEqual([downloadURL, "oldURL1", "oldURL2"]);
    });
});

describe("processNewConcernPhotoURLs", () => {
    test("throws error when queried with invalid catID", async () => {
        const invalidCatID = null;
        const photoURI = "testPhotoURI";

        const getDoc = require("firebase/firestore").getDoc;
        getDoc.mockRejectedValue(new Error("Invalid catID"));

        await expect(
            processNewConcernPhotoURLs(invalidCatID, photoURI)
        ).rejects.toThrow();
    });

    test("throws error when photoURI not provided", async () => {
        const validCatID = "testCatID";
        const missingPhotoURI = null;

        const uploadImageToStorage =
            require("../../app/utils/db/photo").uploadImageToStorage;
        uploadImageToStorage.mockRejectedValue(new Error("Missing photoURI"));

        await expect(
            processNewConcernPhotoURLs(validCatID, missingPhotoURI)
        ).rejects.toThrow();
    });

    test("correctly appends and returns array of photoURLs", async () => {
        const validCatID = "testCatID";
        const photoURI = "testPhotoURI";
        const downloadURL = "testDownloadURL";
        const uploadImageToStorage =
            require("../../app/utils/db/photo").uploadImageToStorage;
        uploadImageToStorage.mockResolvedValue(downloadURL);

        const cat = { concernPhotoURLs: ["oldURL1", "oldURL2"] };
        const getDoc = require("firebase/firestore").getDoc;
        getDoc.mockResolvedValue({ data: () => cat });

        const result = await processNewConcernPhotoURLs(validCatID, photoURI);

        expect(result).toEqual(["oldURL1", "oldURL2", downloadURL]);
    });
});

// describe("autoProcessUnfed", () => {
//     test("no update is done when cat is fed", async () => {
//         const cat = {
//             concernStatus: { unfed: false },
//             lastFedTime: { toMillis: () => Date.now() - 10000 }, // Last fed 10 seconds ago
//             catID: "testCatID",
//         };

//         const userUpdateCatSpy = jest.spyOn(catUtils, "userUpdateCat");

//         await autoProcessUnfed(cat);

//         expect(userUpdateCatSpy).not.toHaveBeenCalled();
//     });

//     test("an update is done when cat is unfed and not updated before", async () => {
//         const cat = {
//             concernStatus: { unfed: false },
//             lastFedTime: { toMillis: () => Date.now() - 24 * 60 * 60 * 1000 }, // Last fed 24 hours ago
//             catID: "testCatID",
//         };

//         const userUpdateCatSpy = jest.spyOn(catUtils, "userUpdateCat");

//         await autoProcessUnfed(cat);

//         expect(userUpdateCatSpy).toHaveBeenCalledWith(
//             "SYSTEM",
//             cat.catID,
//             "Update Concern (Unfed)",
//             {
//                 "concernStatus.unfed": true,
//             }
//         );
//     });

//     test("no update is done when cat is unfed and update was done before", async () => {
//         const cat = {
//             concernStatus: { unfed: true },
//             lastFedTime: { toMillis: () => Date.now() - 24 * 60 * 60 * 1000 }, // Last fed 24 hours ago
//             catID: "testCatID",
//         };

//         const userUpdateCat = jest.fn();

//         await autoProcessUnfed(cat);

//         expect(userUpdateCat).not.toHaveBeenCalled();
//     });
// });

// describe("autoProcessMissing", () => {
//     test("no update is done when cat is not missing", async () => {
//         const cat = {
//             concernStatus: { missing: false },
//             lastSeenTime: {
//                 toMillis: () => Date.now() - 2 * 24 * 60 * 60 * 1000,
//             }, // Last seen 2 days ago
//             catID: "testCatID",
//         };

//         const userUpdateCat = jest.fn();

//         await autoProcessMissing(cat);

//         expect(userUpdateCat).not.toHaveBeenCalled();
//     });

//     test("update is done when cat is missing and not updated before", async () => {
//         const cat = {
//             concernStatus: { missing: false },
//             lastSeenTime: {
//                 toMillis: () => Date.now() - 4 * 24 * 60 * 60 * 1000,
//             }, // Last seen 4 days ago
//             catID: "testCatID",
//         };

//         const userUpdateCat = jest.fn();

//         await autoProcessMissing(cat);

//         expect(userUpdateCat).toHaveBeenCalledWith(
//             "SYSTEM",
//             cat.catID,
//             "Update Concern (Missing)",
//             {
//                 "concernStatus.missing": true,
//             }
//         );
//     });

//     test("no update is done when the cat is missing and update was done before", async () => {
//         const cat = {
//             concernStatus: { missing: true },
//             lastSeenTime: {
//                 toMillis: () => Date.now() - 4 * 24 * 60 * 60 * 1000,
//             }, // Last seen 4 days ago
//             catID: "testCatID",
//         };

//         const userUpdateCat = jest.fn();

//         await autoProcessMissing(cat);

//         expect(userUpdateCat).not.toHaveBeenCalled();
//     });
// });

// describe("autoProcessConcernStatus", () => {
//     test("does nothing when there are no cats", async () => {
//         // Mock getDocs to return an empty query snapshot
//         const getDocs = require("firebase/firestore").getDocs;
//         getDocs.mockResolvedValue({ docs: [] });

//         // Mock the autoProcessUnfed and autoProcessMissing functions to ensure they are not called
//         autoProcessUnfed.mockResolvedValue();
//         autoProcessMissing.mockResolvedValue();

//         await autoProcessConcernStatus();

//         expect(getDocs).toHaveBeenCalledTimes(1);
//         expect(autoProcessUnfed).not.toHaveBeenCalled();
//         expect(autoProcessMissing).not.toHaveBeenCalled();
//     });

//     test("updates the unfed status for one cat", async () => {
//         // Mock the query snapshot with one cat that is unfed
//         const getDocs = require("firebase/firestore").getDocs;
//         getDocs.mockResolvedValue({
//             docs: [
//                 {
//                     data: () => ({
//                         concernStatus: { unfed: true },
//                         lastFedTime: {
//                             toMillis: () => Date.now() - 24 * 60 * 60 * 1000,
//                         }, // Last fed 24 hours ago
//                         catID: "unfedCatID",
//                     }),
//                 },
//             ],
//         });

//         // Mock the autoProcessUnfed and autoProcessMissing functions to ensure they are called
//         autoProcessUnfed.mockResolvedValue();
//         autoProcessMissing.mockResolvedValue();

//         await autoProcessConcernStatus();

//         expect(getDocs).toHaveBeenCalledTimes(1);
//         expect(autoProcessUnfed).toHaveBeenCalledTimes(1);
//         expect(autoProcessMissing).not.toHaveBeenCalled();
//     });

//     test("updates the missing status for one cat", async () => {
//         // Mock the query snapshot with one cat that is missing
//         const getDocs = require("firebase/firestore").getDocs;
//         getDocs.mockResolvedValue({
//             docs: [
//                 {
//                     data: () => ({
//                         concernStatus: { missing: true },
//                         lastSeenTime: {
//                             toMillis: () =>
//                                 Date.now() - 4 * 24 * 60 * 60 * 1000,
//                         }, // Last seen 4 days ago
//                         catID: "missingCatID",
//                     }),
//                 },
//             ],
//         });

//         // Mock the autoProcessUnfed and autoProcessMissing functions to ensure they are called
//         autoProcessUnfed.mockResolvedValue();
//         autoProcessMissing.mockResolvedValue();

//         // Act
//         await autoProcessConcernStatus();

//         // Assert
//         expect(getDocs).toHaveBeenCalledTimes(1);
//         expect(autoProcessUnfed).not.toHaveBeenCalled();
//         expect(autoProcessMissing).toHaveBeenCalledTimes(1);
//     });

//     test("updates the unfed and missing statuses for one cat", async () => {
//         // Mock the query snapshot with one cat that is both unfed and missing
//         const getDocs = require("firebase/firestore").getDocs;
//         getDocs.mockResolvedValue({
//             docs: [
//                 {
//                     data: () => ({
//                         concernStatus: { unfed: true, missing: true },
//                         lastFedTime: {
//                             toMillis: () => Date.now() - 24 * 60 * 60 * 1000,
//                         }, // Last fed 24 hours ago
//                         lastSeenTime: {
//                             toMillis: () =>
//                                 Date.now() - 4 * 24 * 60 * 60 * 1000,
//                         }, // Last seen 4 days ago
//                         catID: "bothCatID",
//                     }),
//                 },
//             ],
//         });

//         // Mock the autoProcessUnfed and autoProcessMissing functions to ensure they are called
//         autoProcessUnfed.mockResolvedValue();
//         autoProcessMissing.mockResolvedValue();

//         await autoProcessConcernStatus();

//         expect(getDocs).toHaveBeenCalledTimes(1);
//         expect(autoProcessUnfed).toHaveBeenCalledTimes(1);
//         expect(autoProcessMissing).toHaveBeenCalledTimes(1);
//     });

//     test("updates the statuses for multiple cats", async () => {
//         // Mock the query snapshot with multiple cats with various statuses
//         const getDocs = require("firebase/firestore").getDocs;
//         getDocs.mockResolvedValue({
//             docs: [
//                 {
//                     data: () => ({
//                         concernStatus: { unfed: false, missing: false },
//                         catID: "catID1",
//                     }),
//                 },
//                 {
//                     data: () => ({
//                         concernStatus: { unfed: true, missing: false },
//                         lastFedTime: {
//                             toMillis: () => Date.now() - 24 * 60 * 60 * 1000,
//                         }, // Last fed 24 hours ago
//                         catID: "catID2",
//                     }),
//                 },
//                 {
//                     data: () => ({
//                         concernStatus: { unfed: false, missing: true },
//                         lastSeenTime: {
//                             toMillis: () =>
//                                 Date.now() - 4 * 24 * 60 * 60 * 1000,
//                         }, // Last seen 4 days ago
//                         catID: "catID3",
//                     }),
//                 },
//                 {
//                     data: () => ({
//                         concernStatus: { unfed: true, missing: true },
//                         lastFedTime: {
//                             toMillis: () => Date.now() - 24 * 60 * 60 * 1000,
//                         }, // Last fed 24 hours ago
//                         lastSeenTime: {
//                             toMillis: () =>
//                                 Date.now() - 4 * 24 * 60 * 60 * 1000,
//                         }, // Last seen 4 days ago
//                         catID: "catID4",
//                     }),
//                 },
//             ],
//         });

//         // Mock the autoProcessUnfed and autoProcessMissing functions to ensure they are called
//         autoProcessUnfed.mockResolvedValue();
//         autoProcessMissing.mockResolvedValue();

//         await autoProcessConcernStatus();

//         expect(getDocs).toHaveBeenCalledTimes(1);
//         expect(autoProcessUnfed).toHaveBeenCalledTimes(2);
//         expect(autoProcessMissing).toHaveBeenCalledTimes(2);
//     });
// });
