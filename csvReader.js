// !!! THIS FILE NEEDS TESTING (tested 1 time(s) with success) !!!
// The main function is 'fetchAndParseCSVData' below.
// Author: Vincent Lindvall
// Date: 2022-04-23

// Fetch data from the CSV file with the booking info and
// return a comma seperated string with the IDs correspondening 
// to the premises in the SVG that should be colored.
async function fetchAndParseCSVData() {
    const response = await fetch('bookings.csv');
    const rawText = await response.text();
    return parseCSVData(rawText);
}

// Parse the fetched data
// Return array with the premises that are booked now
function parseCSVData(text) {
    // Split at each new row (slice(1) ignores the header in the csv file)
    const rows = text.split('\n').slice(1);
    // Split at each comma on each row
    /* Format after this will be array elements of form: [startTime, endTime, premiseName] 
    (startTime and endTime are in format: "2022-04-14T21:00" local swedish time) */
    var splittedRows = [];
    for (let i = 0; i < rows.length; i++) {
        splittedRows.push(rows[i].replace('\r',"").split(','));
    }

    // Date used for checking if a premise is booked    
    const date = getDate();
    // Build the comma separated string that fetchAndParseCSVData() should return
    var s = [];
    for (let k = 0; k < splittedRows.length-1; k++) {
        if (isTime(splittedRows[k][0], splittedRows[k][1], date)) {
            s.push(splittedRows[k][2]); // Premise name
        }
    }
    return s.join(", ");
}

// Function used to determine if a room is to be colored red (booked)
/* 'timeNow', 'startTime', (strings) are in format: "2022-04-14T21:00" local swedish time
and endTime is a Date object (created with "new Date()") */
// Return True if 'timeNow' is between 'startTime' and 'endTime'
function isTime(startTime, endTime, timeNow) {
    // Check hour (00:00 does not have to be checked)
    if (parseInt(startTime.slice(11,13).replace("0","")) > parseInt(timeNow.getHours()) ||
        parseInt(endTime.slice(11,13).replace("0","")) < parseInt(timeNow.getHours())) {
                  return false
    // Check day
    } else if(parseInt(startTime.slice(8,10).replace("0","")) > parseInt(timeNow.getDate()) ||
              parseInt(endTime.slice(8,10).replace("0","")) < parseInt(timeNow.getDate())) {
                  return false
    // Check month (in javascript january is month 0)
    } else if (parseInt(startTime.slice(5,7).replace("0","")) > parseInt(timeNow.getMonth())+1 ||
               parseInt(endTime.slice(5,7).replace("0","")) < parseInt(timeNow.getMonth())+1) {
                   return false
    // Check year
    } else if (parseInt(startTime.slice(0,4)) > parseInt(timeNow.getFullYear()) ||
               parseInt(endTime.slice(0,4)) < parseInt(timeNow.getFullYear())) {
                   return false
    }
    return true
}

// Returns the current date as a Date object. Can later be modified to return dates in the future.
function getDate() {
    return new Date();
}

premiseNameToIDMap = {
    "4618" : ["3416"],
    "3721" : ["3496"],
    "4523": ["3143"],
    "5O1Spe (Spelhallen)": ["3149"],
    "5O2Spo (Sporthallen)": ["3151"],
    "5O3Mus (Musiksalen)": ["3152"],
    "5O4Kons (Konsthallen)": ["3155"],
    "5O5Mat (Matsalen)": ["3159"],
    "D/LV5 (Ljusgård, D)": ["2743"],
    "D1": ["3453"],
    "D2": ["2775"],
    "D3": ["2782"],
    "D31": ["2785"],
    "D33": ["2732"],
    "D34": ["2734"],
    "D35": ["2735"],
    "D36 (Gamla styrelserummet)" : ["2758"],
    "D37": ["2738"],
    "D41": ["2929"],
    "D42": ["2936"],
    "D4448": ["2934"],
    "Haptik labb": ["3414"],
    "Multi Studio": ["3412","3413"],
    "Middla Design studio": ["3409"],
    "VIC-studion": ["2930"],
    "1448": ["2869"],
    "1537": ["3063"],
    "1625": ["3427"],
    "4V2Röd (Röd)": ["2976"],
    "4V3Ora (Orange)": ["2975"],
    "4V4Gul (Gul)": ["2977"],
    "4V5Grö (Grön)": ["2978"],
    "4V6 Bru (Brun)": ["2979"],
    "5V1Grå (Grå)": ["3087"],
    "5V2Kar (Karmosin)": ["3075"],
    "5V3Vit (Vit)": ["3088"],
    "5V4Mag (Magenta)": ["3253"],
    "5V5Vio (Violett)": ["3259"],
    "5V6Tur (Turkos)": ["3251"],
    "E/1315": ["2710"],
    "E/LV3": ["2655"],
    "E1": ["2578"],
    "E2": ["2684"],
    "E3": ["3271"],
    "E31": ["2670"],
    "E32": ["2664"],
    "E33": ["2660"],
    "E34": ["2668"],
    "E35": ["2679"],
    "E36": ["2683"],
    "E51": ["3270"],
    "E52": ["3249"],
    "E53": ["3240"],
}


console.log(fetchAndParseCSVData())