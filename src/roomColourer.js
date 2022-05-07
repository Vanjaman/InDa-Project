/* This script colors booked premises red in the SVGs displayed in a building view.
   Information about which premises are booked comes from a seperate
   csv-reader file. The initial (entry-level of building) SVGs are loaded when this
   script is called from enterying the building view. The SVGs are updated when an
   up- or down-floor button is pressed, and rooms are re-colored.
*/
// Author: Vanja Grigoriev, Vincent Lindvall
// Date: 2022/05/06


// Get house name
var house = sessionStorage.getItem("house");
var houseName;
if (house == "D-E-house") {
    houseName = "D-E House";
}

// Class to be applied to booked premises in the SVG
var bookedRoomClass = 'room booked';

// List of (string) SVG names to display in format [mainSVG, floorUpSVG, floorDownSVG]
var svgNames = [];

// comma-seperated string with ID:s for premises to color
var roomsToColor = [];

// SVGs to display in the building view
var svgMain = document.getElementById('svg-main-object');
var svgFloorUp = document.getElementById('floor-up-preview');
var svgFloorDown = document.getElementById('floor-down-preview');

// Load the the Initial (entry-level of building) SVGs to manipulate
// This function will only run once when entering the building view
// to set up the SVGs that should be shown in the entry-level of the building
async function loadInitialSVGsAndColor() {
    svgNames = await fetchEntrySVGs().then(res => svgNames = res);

    // Load correct floor title
    document.getElementById('floor-info').innerHTML = houseName.concat("- Floor ",svgNames[0].charAt(svgNames[0].length-1));

    svgMain.setAttribute('data', 'maps/ED/'.concat(svgNames[0], ".svg"))
    svgFloorUp.setAttribute('data', 'maps/ED/'.concat(svgNames[1], ".svg"))
    svgFloorDown.setAttribute('data', 'maps/ED/'.concat(svgNames[2], ".svg"))

    svgMain.onload = function() {
        svgFloorUp.onload = function() {
            svgFloorDown.onload = function() {
                fetchRoomsToColor()
            }
        }
    }
}
loadInitialSVGsAndColor()

// Load what rooms should be colored. This will be run when loading the building view page,
// and when the user selects a new time (modifies the rooms that should be colored)
async function fetchRoomsToColor() {
    roomsToColor = await fetchAndParseCSVData();
    roomsToColor = roomsToColor.split(", ");
    colourRooms(roomsToColor)
}

// When the user has clicked on the 'floor up' or 'floor down' button in the building view,
// the maps shown should be updated. 'svgMain' (string) is the name of the newly selected floor,
// and (string) 'svgFloorup' and (string) 'svgFloorDown' are the names of the floors that the newly
// selected floor is connected with, and are shown in the preview boxes in the building view
// (previews will not be shown in a future mobile version).
async function switchFloors(direction) {
    // direction = 1 means go up, direction = 2 means go down
    svgNames = await fetchSVGs(svgNames[direction]);

    svgMain.onload = function() {
        svgFloorUp.onload = function() {
            colourRooms(roomsToColor)
            svgFloorDown.onload = function() {
                colourRooms(roomsToColor)
            }
        }
    }

    // Switch floor title
    document.getElementById('floor-info').innerHTML = houseName.concat("- Floor ",svgNames[0].charAt(svgNames[0].length-1));

    // Switch the SVGs
    svgMain.setAttribute('data', 'maps/ED/'.concat(svgNames[0], ".svg"))
    // If null, the SVG should be hidden and not try to load in an undefined SVG
    // (will cause problems with the .onload functions)
    if (svgNames[1] != null) {
        svgFloorUp.style.display = "block";
        svgFloorUp.setAttribute('data', 'maps/ED/'.concat(svgNames[1], ".svg"))
    } else {
        svgFloorUp.style.display = "none";
    }
    // If null, the SVG should be hidden and not try to load in an undefined SVG
    // (will cause problems with the .onloa
    if (svgNames[2] != null) {
        svgFloorDown.style.display = "block";
        svgFloorDown.setAttribute('data', 'maps/ED/'.concat(svgNames[2], ".svg"))
    } else {
        svgFloorDown.style.display = "none";
    }
}

// Colours the given rooms. 'data' is an array of strings that contain the IDs of the 
// premises that should be colored red. If an ID is not in the array, the default color
// of a bookable premise is green.
function colourRooms(data) {
    for (var room=0; room<data.length; room++) {
        colourRoom(data[room]);
    }
}

function colourRoom(name) {
    // getElementById will return  null if not found on that floor
    var svgMainRoom = svgMain.contentDocument.getElementById(name);
    var svgFloorUpRoom = svgFloorUp.contentDocument.getElementById(name);
    var svgFloorDownRoom = svgFloorDown.contentDocument.getElementById(name);
    var rooms = [svgMainRoom, svgFloorUpRoom, svgFloorDownRoom];
    
    rooms.forEach((room) => {
        if (room != null) {
            room.setAttributeNS(null, 'class', bookedRoomClass); 
        }
    })
}