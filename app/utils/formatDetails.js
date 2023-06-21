import { dateTimeOptions } from "../data/DateTimeOptions";

// Format Age Field
export function formatAge(birthYear) {
    const currYear = new Date().getFullYear();

    if (currYear < birthYear) {
        return "0y";
    } else {
        return (currYear - birthYear) + "y";
    }
}

// Format Last Seen Field - assumes arguments are not null since checks are done beforehand
export function formatLastSeen(lastSeenLocation, lastSeenTime) {
    const lastSeenTimeDate = lastSeenTime.toDate();
    const lastSeenTimeString = lastSeenTimeDate.toLocaleString("en-GB", dateTimeOptions);
    let today = new Date();
    // duration in hours
    let duration = (today - lastSeenTimeDate) / 3600000;
    let durationString;
    if (duration >= 24) {
        durationString = Math.floor(duration / 24) + "d";
    } else {
        durationString = Math.floor(duration) + "h";
    }

    return `${lastSeenLocation}, ${lastSeenTimeString} (${durationString} ago)`;
}

// Simpler format for dashboard
export function formatLastSeenSimple(lastSeenLocation, lastSeenTime) {
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

    return `${lastSeenLocation} (${durationString})`;
}

// Format Last Fed Field
export function formatLastFed(lastFedTime) {
    const lastFedTimeDate = lastFedTime.toDate();
    const lastFedTimeString = lastFedTimeDate.toLocaleString("en-GB", dateTimeOptions);
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
    const lastFedTimeDate = lastFedTime.toDate();
    const lastFedTimeString = lastFedTimeDate.toLocaleString("en-GB", dateTimeOptions);
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

