// This script is run by an SVG file to colour it's rooms red.
// The code that runs this file is found at the bottom of an SVG file.
// Author: Vanja Grigoriev
// Date: 2022/04/20
var data = document.defaultView.location.href.split("?")[1].split(",");

colourRooms(data);

function colourRooms(data) {
    for (var room=0; room<data.length; room++) {
        colourRoom(data[room]);
    }
}

function colourRoom(name) {
    var country = document.getElementById(name);
    var newClass = 'room red';
    country.setAttributeNS(null, 'class', newClass);
}