// This script colors booked premises red in an SVG.
// Information about which premises are booked comes from a seperate
// csv-reader file.
// Author: Vanja Grigoriev, Vincent Lindvall
// Date: 2022/04/23

// The SVG to manipulate
var svgObject = document.getElementById('svg-object');
var SVGDocument;
// Wait for the SVG to load
svgObject.onload = function() {
    // The contentDocument carries all the tags for the rooms in the SVG
    SVGDocument = svgObject.contentDocument;
    fetchRoomsToColor()
}

async function fetchRoomsToColor() {
    var roomsToColor = await fetchAndParseCSVData();
    roomsToColor = roomsToColor.split(", ");
    colourRooms(roomsToColor);
}

function colourRooms(data) {
    for (var room=0; room<data.length; room++) {
        colourRoom(data[room]);
    }
}

function colourRoom(name) {
    var room = SVGDocument.getElementById(name);
    var newClass = 'room red';
    if (room != null) {
        room.setAttributeNS(null, 'class', newClass); 
    }
}