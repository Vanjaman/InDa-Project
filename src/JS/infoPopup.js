
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
                room.addEventListener('mouseover', displayInfo)
            }
        });
    }

    function displayInfo() {
        console.log(Object.keys(premiseNameToIDMap).find(key => premiseNameToIDMap[key] === this.id))
    }
}