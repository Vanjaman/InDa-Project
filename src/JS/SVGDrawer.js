/* This script colors booked premises red in the SVGs displayed in a building view.
   The script also contains the eventListeners for switching date and time in a building view
   because these update the SVGs.
  
   Information about which premises are booked comes from a seperate
   csvReader.js file. The initial (entry-level of building) SVGs are loaded when this
   script is called when enterying a building view. The SVGs are updated when an
   up- or down-floor button is pressed or if the date or time is updated.
*/
// Author: Vanja Grigoriev, Vincent Lindvall
// Date: 2022/05/13

// string list with ID:s for premises to color
var roomsToColorRed = [];

const inputDate = document.querySelector('#date-picker');
inputDate.value = sessionStorage.getItem("date");
var date = inputDate.value;
inputDate.addEventListener('input', () => {
    date = inputDate.value;
    roomsToColorRed = parseCSVData(rawText, new Date(date+"T"+time)); // rawText is from 'csvReader.js'
    colourRooms(roomsToColorRed.split(", "))
  });
// The SVGs will update when the time is changed
const inputTime = document.querySelector('#time-picker');
inputTime.value = sessionStorage.getItem("time");
var time = inputTime.value;
inputTime.addEventListener('input', () => {
    time = inputTime.value;
    roomsToColorRed = parseCSVData(rawText, new Date(date+"T"+time)); // rawText is from 'csvReader.js'
    colourRooms(roomsToColorRed.split(", "))
})

// Get house name
var house = sessionStorage.getItem("house");
var houseName;
if (house == "D-E-house") {
    houseName = "D-E House";
}
// Class to be applied to booked premises in the SVG
var bookedRoomClass = 'room booked';
// Class to be applied to un-booked premises in the SVG
var bookableRoomClass = 'room bookable';
// List of (string) SVG names to display (format [mainSVG, floorUpSVG, floorDownSVG])
var svgNames = [];
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
    // Load SVGs
    svgMain.setAttribute('data', '../../maps/ED/'.concat(svgNames[0], ".svg"))
    svgFloorUp.setAttribute('data', '../../maps/ED/'.concat(svgNames[1], ".svg"))
    svgFloorDown.setAttribute('data', '../../maps/ED/'.concat(svgNames[2], ".svg"))

    // Wait for SVGs to load before coloring them
    loadedSVGs = 0; // Will work because Javascript is single threaded
    svgList = [svgMain, svgFloorUp, svgFloorDown];
    for (var i = 0; i < svgList.length; i++) {
        // If the SVG is not found consider it already loaded
        if (svgNames[i] == null) {
            loadedSVGs += 1;
        }
        // Add to loadedSVGs when loaded
        svgList[i].onload = function() {
            loadedSVGs += 1;
            if (loadedSVGs == svgList.length) {
                // Fetch the rooms that should be colored red (booked premises)
                fetchRoomsToColorRed(new Date(date+"T"+time))
                
            }
        }
        if (loadedSVGs == svgList.length) {
            // Fetch the rooms that should be colored red (booked premises)
            fetchRoomsToColorRed(new Date(date+"T"+time))
        }
    }
}
loadInitialSVGsAndColor()

// Load what rooms should be colored. This will run when loading the building view page,
// and when the user selects a new time (modifies the rooms that should be colored)
async function fetchRoomsToColorRed(date) {
    roomsToColorRed = await fetchAndParseCSVData(date);
    roomsToColorRed = roomsToColorRed.split(", ");
    colourRooms(roomsToColorRed)
}

// When the user has clicked on the 'floor up' or 'floor down' button in the building view,
// the maps shown will be updated. (string) 'svgMain' is the name of the newly selected floor,
// and (string) 'svgFloorup' and (string) 'svgFloorDown' are the names of the floors that the newly
// selected floor is connected with, and are shown in the preview boxes in the building view
// (previews will not be shown in a future mobile version).
async function switchFloors(direction) {
    // direction = 1 means go up, direction = 2 means go down
    svgNames = await fetchSVGs(svgNames[direction]);

    // Wait for SVGs to load before coloring them
    loadedSVGs = 0; // Will work because Javascript is single threaded
    svgList = [svgMain, svgFloorUp, svgFloorDown];
    for (var i = 0; i < svgList.length; i++) {
        // If the SVG is not found consider it already loaded
        if (svgNames[i] == null) {
            loadedSVGs += 1;
        }
        // Add to loadedSVGs when loaded
        svgList[i].onload = function() {
            loadedSVGs += 1;
            if (loadedSVGs == svgList.length) {
                // Fetch the rooms that should be colored red (booked premises)
                colourRooms(roomsToColorRed);
            }
        }
        if (loadedSVGs == svgList.length) {
            // Fetch the rooms that should be colored red (booked premises)
            colourRooms(roomsToColorRed);
        }
    }

    // Switch floor title
    document.getElementById('floor-info').innerHTML = houseName.concat("- Floor ",svgNames[0].charAt(svgNames[0].length-1));
    // Switch the SVGs
    svgMain.setAttribute('data', '../../maps/ED/'.concat(svgNames[0], ".svg"))
    // If null, the SVG should be hidden and not try to load in an undefined SVG
    // (will cause problems with the .onload functions)
    if (svgNames[1] != null) {
        document.getElementById('floor-up').style.visibility = "visible"; // Make visible
        svgFloorUp.setAttribute('data', '../../maps/ED/'.concat(svgNames[1], ".svg"))
    } else {
        document.getElementById('floor-up').style.visibility = "hidden";
    }
    // If null, the SVG should be hidden and not try to load in an undefined SVG
    // (will cause problems with the .onload functions)
    if (svgNames[2] != null) {
        document.getElementById('floor-down').style.visibility = "visible"; // Make visible
        svgFloorDown.setAttribute('data', '../../maps/ED/'.concat(svgNames[2], ".svg"))
    } else {
        document.getElementById('floor-down').style.visibility = "hidden";
    }
}

// Colours the given SVG. 'data' is an array of strings that contain the IDs of the 
// premises that should be colored red. If an ID is not in the array, the default color
// of a bookable premise is green.
function colourRooms(roomsToColorRed) {
    Object.values(premiseNameToIDMap).forEach((premiseID) => {
        if (roomsToColorRed.includes(premiseID)) {
            colorRoom(premiseID, "red")
        } else {
            // Rooms that are not in roomsToColorRed must be colored green to reset them when changing time or date
            colorRoom(premiseID, "green")
        }
    })
}

// Colours the premise corresponding to the given premise ID if present in any
// of the loaded SVGs in the building view.
function colorRoom(premiseID, color) {
    // getElementById will return  null if not found on that floor
    var svgMainRoom = svgMain.contentDocument.getElementById(premiseID);
    var svgFloorUpRoom = svgFloorUp.contentDocument.getElementById(premiseID);
    var svgFloorDownRoom = svgFloorDown.contentDocument.getElementById(premiseID);

    var rooms = [svgMainRoom, svgFloorUpRoom, svgFloorDownRoom]; 
    rooms.forEach((room) => {
        if (room != null) {
            if (color == "red") {
                room.setAttributeNS(null, 'class', bookedRoomClass);
            } 
            else {
                room.setAttributeNS(null, 'class', bookableRoomClass);
            }
        }
    })
}