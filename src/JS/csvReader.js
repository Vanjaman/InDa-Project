// The main function is 'fetchAndParseCSVData' below.
// Author: Vincent Lindvall, Vanja Grigoriev
// Date: 2022-04-23

// Fetch data from the CSV file with the booking info and
// return a comma seperated string with the IDs correspondening 
// to the premises in the SVG that should be colored.

var rawText;

async function fetchAndParseCSVData(date) {
    const response = await fetch('../../bookings.csv');
    rawText = await response.text();
    return parseCSVData(rawText, date);
}

// Parse the fetched data
// Return array with the premises that are booked during the input date
function parseCSVData(text, date) {
    // Split at each new row (slice(1) ignores the header in the csv file)
    // Split at each comma on each row
    /* Format after this will be array elements of form: 
    [startTime, endTime, premiseName] 
    (startTime and endTime are in format: "2022-04-14T21:00" local swedish time) */
    const rows = text.split('\n').slice(1);
    var splittedRows = [];
    for (let i = 0; i < rows.length; i++) {
        splittedRows.push(rows[i].replace('\r',"").split(','));
    }

    // Build the comma separated string that fetchAndParseCSVData() should return
    var s = [];
    for (const row of splittedRows) {
        if (isTime(new Date(row[0]), new Date(row[1]), date)) {
            s.push(premiseID(row[2]));
        }
    }
    console.log(s.join(", "))
    return s.join(", ");
}

// Function used to determine if a room is to be colored red (booked)
/* 'timeNow', 'startTime', (strings) are in format: "2022-04-14T21:00" local swedish time
and endTime is a Date object (created with "new Date()") */
// Return True if 'timeNow' is between 'startTime' and 'endTime'
function isTime(startTime, endTime, timeNow) {
    return (timeNow > startTime && timeNow < endTime);
}

// Returns the current date as a Date object. Can later be modified to return dates in the future.
function getDate() {
    return new Date();
}

// Returns the premiseName ID (or IDs) as a string (seperated with commas if multiple IDs)
function premiseID(premiseName) {
    if (premiseNameToIDMap[premiseName] == null) {
        return "";
    }

    return premiseNameToIDMap[premiseName]
}

var premiseNameToIDMap = {
    "4618": "3416",
    "3721": "3496",
    "4523": "3143",
    "5O1Spe (Spelhallen)": "3149",
    "5O2Spo (Sporthallen)": "3151",
    "5O3Mus (Musiksalen)": "3152",
    "5O4Kons (Konsthallen)": "3155",
    "5O5Mat (Matsalen)": "3159",
    "D/LV5 (Ljusgård, D)": "2743",
    "D1": "3453",
    "D2": "2775",
    "D3": "2782",
    "D31": "2785",
    "D33": "2732",
    "D34": "2734",
    "D35": "2735",
    "D36 (Gamla styrelserummet)" : "2758",
    "D37": "2738",
    "D41": "2929",
    "D42": "2936",
    "D4448": "2934",
    "Haptik labb": "3414",
    "Multi Studio": "3412, 3413",
    "Middla Design studio": "3409",
    "VIC-studion": "2930",
    "1448": "2869",
    "1537": "3063",
    "1625": "3427",
    "4V2Röd (Röd)": "2976",
    "4V3Ora (Orange)": "2975",
    "4V4Gul (Gul)": "2977",
    "4V5Grö (Grön)": "2978",
    "4V6 Bru (Brun)": "2979",
    "5V1Grå (Grå)": "3087",
    "5V2Kar (Karmosin)": "3075",
    "5V3Vit (Vit)": "3088",
    "5V4Mag (Magenta)": "3253",
    "5V5Vio (Violett)": "3259",
    "5V6Tur (Turkos)": "3251",
    "E/1315": "2710",
    "E/LV3": "2655",
    "E1": "2578",
    "E2": "2684",
    "E3": "3271",
    "E31": "2670",
    "E32": "2664",
    "E33": "2660",
    "E34": "2668",
    "E35": "2679",
    "E36": "2683",
    "E51": "3270",
    "E52": "3249",
    "E53": "3240",
}