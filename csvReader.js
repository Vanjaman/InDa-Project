// Fetch data from the CSV file with the booking info
async function fetchCSVData() {
    const response = await fetch('bookings.csv');
    const rawText = await response.text();
    parseCSVData(rawText);
}

// Parse the fetched data
function parseCSVData(text) {
    // Split at each new row (slice(1) ignores the header in the csv file)
    const rows = text.split('\n').slice(1);
    // Split at each comma on each row
    // Format after this will be array elements [startTime, endTime, premiseName]
    var splittedRows = [];
    for (let i = 0; i < rows.length; i++) {
        splittedRows.push(rows[i].replace('\r',"").split(','))
    }
    
}

fetchCSVData()