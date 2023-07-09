import {
    Timestamp,
    collection,
    doc,
    getDocs,
    writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";

const testing = false;
const today = testing ? new Date(2023, 1, 30, 0, 0, 0, 0) : Timestamp.now();
const oneDayAgo = testing
    ? new Date(2023, 1, 29, 0, 0, 0, 0)
    : Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000).toDate();
const tenDaysAgo = testing
    ? new Date(2023, 1, 20, 0, 0, 0, 0)
    : Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000 * 10).toDate();

const cats = [
    // Cat 1: Sushi. Non-injured, non-missing, non-new, non-unfed. Location: User Location, The Deck, Arts
    {
        birthYear: 2018,
        catID: "1",
        concernDesc: null,
        concernPhotoURLs: null,
        concernStatus: {
            injured: false,
            missing: false,
            new: false,
            unfed: false,
        },
        gender: "M",
        keyFeatures: "Has a nice mustache, likes sleeping on people's laps",
        lastFedTime: today,
        lastSeenLocation: {
            latitude: 1.294517,
            longitude: 103.772763,
        },
        lastSeenTime: today,
        locationName: "The Deck",
        locationZone: "Arts",
        name: "Sushi",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fbc3f2bfa-36da-41f0-a516-feeab44c7a54.jpeg?alt=media&token=3d9ab3bc-e814-4bca-954b-5c5a31e9a7a5",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F5081a607-6e0c-464d-bc0c-75469068d010.jpeg?alt=media&token=1613ec0b-62e9-4546-8869-45761f0cee27",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F96689ceb-e139-4811-8ae7-f87685740ea6.jpeg?alt=media&token=4ebc0e96-b13c-49a9-908c-e7c79d94e398",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 2: Marshmallow. Non-injured, non-missing, non-new, unfed. Location: Preset Location, ERC, UTown
    {
        birthYear: 2019,
        catID: "2",
        concernDesc: null,
        concernPhotoURLs: null,
        concernStatus: {
            injured: false,
            missing: false,
            new: false,
            unfed: true,
        },
        gender: "M",
        keyFeatures: "Why the long face?",
        lastFedTime: oneDayAgo,
        lastSeenLocation: {
            latitude: 1.3058234345528048,
            longitude: 103.77292010093264,
        },
        lastSeenTime: today,
        locationName: "ERC",
        locationZone: "UTown",
        name: "Marshmallow",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fd6eaea9f-dbcf-4e0d-a221-fc77a6ac4ec5.jpeg?alt=media&token=ba59cc93-1113-405d-98d0-2636d6df22cc",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Ffe979fb4-3f3d-472c-b18a-1e4e17c4d9f9.jpeg?alt=media&token=148216cc-63da-4a3b-bf23-f47a3bde6134",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F968d9490-d4f9-4021-9590-ca89fbba808a.jpeg?alt=media&token=4a15e2c1-94c7-4d3a-a990-5d2e47349e29",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F560fae84-c216-4ab7-a223-6e2b4b66ec00.jpeg?alt=media&token=a004beb2-2147-47f5-8e73-ef3d796b067a",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F2c86190e-ddf1-4ae0-b975-696449b98a64.jpeg?alt=media&token=8fcd720a-2fe0-457f-ab1c-0540b1cffa19",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F5060ab5b-68ed-4631-9948-4031c5cdb520.jpeg?alt=media&token=cfa9579b-8d89-4da3-b0a5-8fe953150dde",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F51c1241c-43cc-42ba-941c-4284f143ef4c.jpeg?alt=media&token=d9511a8d-be1d-43b8-ad31-1ce9bb54c66b",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F7ac2fe5d-95b7-4e5e-ba00-0cff8e5374ad.jpeg?alt=media&token=35a70684-6907-4eec-9fc5-1256accdf32b",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F9505f13a-0e30-400f-bf2d-7d516fcc2b42.jpeg?alt=media&token=45abd9e0-69f9-4edd-a9c6-cf05929a7430",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fd5568366-2104-4d32-9a6a-2852bc47a72e.jpeg?alt=media&token=0f508605-83e5-4997-bac4-440b6539a21f",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F309bad0e-fd06-403d-b909-4def3956b1c5.jpeg?alt=media&token=937a994b-76cc-44d0-bfcb-d157559c965a",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F6bdef8b0-4b60-4e73-a253-c88e5c62f49d.jpeg?alt=media&token=c0a3bb42-cca0-4069-a122-f17fbf357fc6",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 3: Scratchy. Non-injured, missing, non-new, unfed. Location: User Location, Outside NUS, Outside NUS
    {
        birthYear: 2020,
        catID: "3",
        concernDesc: null,
        concernPhotoURLs: null,
        concernStatus: {
            injured: false,
            missing: true,
            new: false,
            unfed: true,
        },
        gender: "F",
        keyFeatures: "Tuxedo cat, has a belt like collar, can be feisty >:)",
        lastFedTime: tenDaysAgo,
        lastSeenLocation: {
            latitude: 1.296374,
            longitude: 103.768611,
        },
        lastSeenTime: tenDaysAgo,
        locationName: "Outside NUS",
        locationZone: "Outside NUS",
        name: "Scratchy",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F5d964d3e-6668-4542-9cbf-6e2f672f45ab.jpeg?alt=media&token=b02d1853-4f16-4c54-b45a-cd1d849ec95e",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Ffb2ef094-ee9b-4dca-bc6a-c9b303f6af4f.jpeg?alt=media&token=b03799cb-ec14-40bf-ae79-45a1c39bd3a4",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F1463b071-aa5d-4c0d-a16f-a461bcd9b2bc.jpeg?alt=media&token=d2540c88-5a1a-4b44-bd3e-0841abd21404",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 4: Bailey. Injured, non-missing, non-new, non-unfed. Location: User Location, KR MRT, Sci/Med
    {
        birthYear: 2021,
        catID: "4",
        concernDesc: "Fainted after drinking coffee",
        concernPhotoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fdebabc04-0938-424f-8e5b-1ba17c7f53e5.jpeg?alt=media&token=581c0ef5-f98d-4dcb-b90e-db858a4edef4",
        ],
        concernStatus: {
            injured: true,
            missing: false,
            new: false,
            unfed: false,
        },
        gender: "F",
        keyFeatures: "Curious, likes jumping up on tables",
        lastFedTime: today,
        lastSeenLocation: {
            latitude: 1.293246,
            longitude: 103.784513,
        },
        lastSeenTime: today,
        locationName: "KR MRT",
        locationZone: "Sci/Med",
        name: "Bailey",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fc437d334-636c-4163-98b1-6eaa090addfa.jpeg?alt=media&token=56606698-0ed5-48b4-802f-65855efb15e9",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F8442e405-e07b-40f9-8c66-b1b18a40a028.jpeg?alt=media&token=5448fd94-280e-4bb8-9121-de4949cfaef8",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F1a46e83a-7e74-4733-a4b3-65f3bd45552e.jpeg?alt=media&token=cd19eb86-f41c-4583-8ba6-3f42e62b5e15",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 5: Mala. Injured, non-missing, non-new, unfed. Location: Preset Location, COM3, Biz/Com
    {
        birthYear: 2022,
        catID: "5",
        concernDesc: "Got so spooked it became blurry",
        concernPhotoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fee71b3e9-4384-4e24-8f5d-6e7120e9b407.jpeg?alt=media&token=c6dd6627-81b3-4d46-bc3a-2c451cfc8f63",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F5014b3c2-23ee-4822-8d0f-7f81b71e0ea5.jpeg?alt=media&token=949b7c1c-b474-4934-a890-30fbbbe6b732",
        ],
        concernStatus: {
            injured: true,
            missing: false,
            new: false,
            unfed: true,
        },
        gender: "M",
        keyFeatures: "VOID WITH SPICY EYES",
        lastFedTime: oneDayAgo,
        lastSeenLocation: {
            latitude: 1.294914540560788,
            longitude: 103.77457495330813,
        },
        lastSeenTime: today,
        locationName: "COM3",
        locationZone: "Biz/Com",
        name: "Mala",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F55e6feeb-298d-4969-ab6c-348b3433c1cd.jpeg?alt=media&token=ca379754-17b1-42db-8533-299e30c775bc",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 6: Wamenti. Injured, missing, non-new, unfed. Location: User Location, Outside NUS, Outside NUS
    {
        birthYear: 2015,
        catID: "6",
        concernDesc: "Seen limping",
        concernPhotoURLs: null,
        concernStatus: {
            injured: true,
            missing: true,
            new: false,
            unfed: true,
        },
        gender: "M",
        keyFeatures: "Always listens to the uncle singing wamenti KTV",
        lastFedTime: tenDaysAgo,
        lastSeenLocation: {
            latitude: 1.309256,
            longitude: 103.770187,
        },
        lastSeenTime: tenDaysAgo,
        locationName: "Outside NUS",
        locationZone: "Outside NUS",
        name: "Wamenti",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F45599be9-cdd1-4a20-855d-a968aac6b865.jpeg?alt=media&token=ccf9a2f4-d18b-45eb-ab80-125fda669eb8",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Ff0ea6da9-3797-4efe-af0b-07da132cf67b.jpeg?alt=media&token=43fd923f-005e-4b5a-9eec-cc382b8460b7",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 7: Catodile. Non-injured, non-missing, new, non-unfed. Location: User Location, USC, Culture & Recreation
    {
        birthYear: 2003,
        catID: "7",
        concernDesc: null,
        concernPhotoURLs: null,
        concernStatus: {
            injured: false,
            missing: false,
            new: true,
            unfed: false,
        },
        gender: "M",
        keyFeatures: "Cat disguised as a crocodile",
        lastFedTime: today,
        lastSeenLocation: {
            latitude: 1.29975,
            longitude: 103.77587,
        },
        lastSeenTime: today,
        locationName: "USC",
        locationZone: "Culture/Recreation",
        name: "Catodile",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F7C4114B3-7A03-43F0-8B9E-0AA211E5883A.jpg?alt=media&token=36fe5322-176a-4766-afb9-6684202516cf",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fd8e7538c-55dc-4813-ba0e-e698b948663d.jpeg?alt=media&token=35d5103a-360d-426d-b57f-44f90431a056",
        ],
        sterilised: false,
        updatedAt: today,
    },
    // Cat 8: Dibo. Non-injured, missing, new, unfed. Location: User Location, TCOMS, R&D
    {
        birthYear: 2010,
        catID: "8",
        concernDesc: null,
        concernPhotoURLs: null,
        concernStatus: {
            injured: false,
            missing: true,
            new: true,
            unfed: true,
        },
        gender: "M",
        keyFeatures: "Say your wish, and Dibo will give a gift!",
        lastFedTime: tenDaysAgo,
        lastSeenLocation: {
            latitude: 1.293749,
            longitude: 103.776828,
        },
        lastSeenTime: tenDaysAgo,
        locationName: "TCOMS",
        locationZone: "R&D",
        name: "Dibo",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fadba603d-c9f0-4e29-8d7c-a4793987ef36.jpeg?alt=media&token=7f3389bb-3a2c-41a8-b841-046c83c927c0",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F482b32e5-1444-4525-9ae4-02c999e396fd.jpeg?alt=media&token=ea5b67b9-2291-4b4d-b0fc-ec78ff7d3cb9",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F9e331a60-19b8-4ed9-8a42-b2c6e71f8a23.jpeg?alt=media&token=6be980e4-c793-45cd-84d3-a0076a0f6558",
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F1c393221-74f0-4ac9-aa70-9ba6ce66ac68.jpeg?alt=media&token=5736f7b1-e583-4797-ac93-d27c194c6503",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 9: Void. Injured, non-missing, new, non-unfed. Location: Preset Location, SDE1, CDE
    {
        birthYear: 2023,
        catID: "9",
        concernDesc: "Consumed by darkness",
        concernPhotoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F9e6a120d-5a06-4ab3-8e14-9e5436fbb1c6.jpeg?alt=media&token=6e7403de-348e-41fc-90ea-2641ab7c5fb3",
        ],
        concernStatus: {
            injured: true,
            missing: false,
            new: true,
            unfed: false,
        },
        gender: "M",
        keyFeatures: "Cute VOID",
        lastFedTime: today,
        lastSeenLocation: {
            latitude: 1.2974325503103152,
            longitude: 103.77061855678437,
        },
        lastSeenTime: today,
        locationName: "SDE1",
        locationZone: "CDE",
        name: "Void",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2F0c10fde5-7f26-40a7-a1d1-c267fce07197.jpeg?alt=media&token=e86aa91a-2815-490f-a84c-8e8c15a1d058",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 10: Purrgeon. Injured, missing, new, unfed. Location: Preset Location, PGPR, KE/PGPR
    {
        birthYear: 2023,
        catID: "10",
        concernDesc: "Morphed into a kingfisher :O",
        concernPhotoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fcc8e304a-8ef9-4b52-b568-bb394d7611e7.jpeg?alt=media&token=ab377a60-a2ac-48c2-bda3-f8a26cdd1124",
        ],
        concernStatus: {
            injured: true,
            missing: true,
            new: true,
            unfed: true,
        },
        gender: "F",
        keyFeatures: "Shapeshifter cat? Bird?",
        lastFedTime: tenDaysAgo,
        lastSeenLocation: {
            latitude: 1.290823484769731,
            longitude: 103.78116482073736,
        },
        lastSeenTime: tenDaysAgo,
        locationName: "PGPR",
        locationZone: "KE/PGPR",
        name: "Purrgeon",
        photoURLs: [
            "https://firebasestorage.googleapis.com/v0/b/catato-ea64f.appspot.com/o/images%2Fd6277fb5-38dd-40e4-8255-f500b5604543.jpeg?alt=media&token=951a55ac-8dc6-49af-8c43-bc84caff6761",
        ],
        sterilised: true,
        updatedAt: today,
    },
    // Cat 11: null cat
    {
        birthYear: null,
        catID: "11",
        concernDesc: null,
        concernPhotoURLs: null,
        concernStatus: null,
        gender: null,
        keyFeatures: null,
        lastFedTime: null,
        lastSeenLocation: null,
        lastSeenTime: null,
        locationName: null,
        locationZone: null,
        name: null,
        photoURLs: null,
        sterilised: null,
        updatedAt: null,
    },
];

export async function resetCatData() {
    const batch = writeBatch(db);

    // Delete Cat collection
    const querySnapshot = await getDocs(collection(db, "Cat"));
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    // Add cats
    for (let i = 0; i < cats.length; i++) {
        const cat = cats[i];
        const catRef = doc(collection(db, "Cat"));
        batch.set(catRef, cat); // Add the cat object with auto generated id
        batch.update(catRef, { catID: catRef.id }); // Update id to firestore id
    }

    // Commit operations
    await batch.commit();
}
