import { dateTimeOptions } from "../data/DateTimeOptions";

// Format Age Field
// @param birthYear: number
// @return age: number
// @throw Error
export function formatAge(birthYear) {
    const currYear = new Date().getFullYear();

    if (
        !birthYear ||
        isNaN(birthYear) ||
        birthYear < 0 ||
        currYear < birthYear
    ) {
        throw new Error("Invalid birthYear");
    } else {
        return currYear - birthYear + "y";
    }
}

// Format Last Seen Field - assumes arguments are not null since checks are done beforehand
// @param locationName: string
// @param lastSeenTime
export function formatLastSeen(locationName, lastSeenTime) {
    if (!locationName || !lastSeenTime) {
        throw new Error("Missing locationName or lastSeenTime");
    } else if (!(typeof locationName === "string")) {
        throw new Error("locationName is not String");
    }
    const lastSeenTimeDate = lastSeenTime.toDate();
    const lastSeenTimeString = lastSeenTimeDate.toLocaleString(
        "en-GB",
        dateTimeOptions
    );
    let today = new Date();
    // duration in hours
    let duration = (today - lastSeenTimeDate) / 3600000;
    let durationString;
    if (duration >= 24) {
        durationString = Math.floor(duration / 24) + "d";
    } else {
        durationString = Math.floor(duration) + "h";
    }

    return `${locationName}, ${lastSeenTimeString} (${durationString} ago)`;
}

// Simpler format for dashboard
export function formatLastSeenSimple(locationName, lastSeenTime) {
    if (!locationName || !lastSeenTime) {
        throw new Error("Missing locationName or lastSeenTime");
    } else if (!(typeof locationName === "string")) {
        throw new Error("locationName is not String");
    }
    const lastSeenTimeDate = lastSeenTime.toDate();
    let today = new Date();
    // duration in hours
    let duration = (today - lastSeenTimeDate) / 3600000;
    let durationString;
    if (duration >= 24) {
        durationString = Math.floor(duration / 24) + "d";
    } else {
        durationString = Math.floor(duration) + "h";
    }

    return `${locationName} (${durationString})`;
}

// Format Last Fed Field
export function formatLastFed(lastFedTime) {
    if (!lastFedTime) {
        throw new Error("Missing lastFedTime");
    }
    const lastFedTimeDate = lastFedTime.toDate();
    const lastFedTimeString = lastFedTimeDate.toLocaleString(
        "en-GB",
        dateTimeOptions
    );
    let today = new Date();
    // duration in hours
    let duration = (today - lastFedTimeDate) / 3600000;
    let durationString;
    if (duration >= 24) {
        durationString = Math.floor(duration / 24) + "d";
    } else {
        durationString = Math.floor(duration) + "h";
    }

    return `${lastFedTimeString} (${durationString} ago)`;
}

// Simpler format for dashboard
export function formatLastFedSimple(lastFedTime) {
    if (!lastFedTime) {
        throw new Error("Missing lastFedTime");
    }
    const lastFedTimeDate = lastFedTime.toDate();
    const lastFedTimeString = lastFedTimeDate.toLocaleString(
        "en-GB",
        dateTimeOptions
    );
    let today = new Date();
    // lastFedTime.toDate() when using TimeStamp
    // duration in hours
    let duration = (today - lastFedTimeDate) / 3600000;
    let durationString;
    if (duration >= 24) {
        durationString = Math.floor(duration / 24) + "d";
    } else {
        durationString = Math.floor(duration) + "h";
    }

    return `${lastFedTimeString} (${durationString})`;
}
