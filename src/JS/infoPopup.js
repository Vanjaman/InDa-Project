// This code is used to display an informative popup when the user hovers over a premise in the building view
//
// Author: Vincent Lindvall
// Date: 2022-05-18

function setUpInfoWhenHover() {
    // Only rooms that are booked or bookable should have their information shown when
    // hovering over them
    roomsToDisplayInfoAbout = [];
    var svgMain = document.getElementById('svg-main-object');
    arr1 = Array.from(svgMain.contentDocument.getElementsByClassName('bookable'));
    arr2 = Array.from(svgMain.contentDocument.getElementsByClassName('booked'));
    roomsToDisplayInfoAbout.push(arr1);
    roomsToDisplayInfoAbout.push(arr2);

    // set eventlisteners for displaying info when hovering over a room
    for (var typeOfRoom = 0; typeOfRoom < 2; typeOfRoom++) { // type of room is "booked" or "bookable"
        roomsToDisplayInfoAbout[typeOfRoom].forEach(room => {
            if (room != null) {
                room.addEventListener('mousemove', displayInfo)
                room.addEventListener('mouseout', removeDisplayInfo)
            }
        });
    }

    // When the user hovers over a premise, show information popup about that premise
    function displayInfo(e) {
        // Position information in pixels on SVG
        var x = e.pageX;
        var y = e.pageY;
        var svgRect = svgMain.getBoundingClientRect(); // Rectangle that holds the SVG

        // Highlight the premise
        this.style.stroke = 'black';
        this.style.strokeWidth = '1px';
        this.style.cursor = "pointer";

        // Display the info-popup
        var infoPopup = document.getElementById('info-popup');
        infoPopup.style.left = x+svgRect.x+"px";
        infoPopup.style.top = y+svgRect.y*0.7+"px"; // *0.7 to make the pop-up appear above the cursor
        infoPopup.style.visibility = "visible";
        var premiseName = Object.keys(premiseNameToIDMap).find(key => premiseNameToIDMap[key] === this.id);
        infoPopup.innerHTML = premiseName;
    }

    // When the user no longer hovers a premise, remove the popup with info about the premise
    function removeDisplayInfo() {
        // De-highlight the premise
        this.style.strokeWidth = '0.1px';
        this.style.cursor = "pointer";

        // Hide the popup
        var infoPopup = document.getElementById('info-popup');
        infoPopup.style.visibility = "hidden";
    }
}