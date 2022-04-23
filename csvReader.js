// The main function is 'fetchAndParseCSVData' below.
// THIS FILE NEEDS TESTING
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

console.log(fetchAndParseCSVData())