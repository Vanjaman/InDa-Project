// This file decide what SVG to load when entering a building view
// Author: Vincent Lindvall
// Date: 2022-05-05

// !!! This should be done when clicking on the E-D-house on
// !!! the map at the start page
sessionStorage.setItem("house", "D-E-house");
// !!!
// !!!

// Get house name
var house = sessionStorage.getItem("house");

var mainSVG;
var floorUpPreview;
var floorDownPreview;

// JSON file containing information about how floors are connected in different buildings
var floorStructuresFile;
var floorStructuresText;
var floorStructuresJSON;
var houseObject;

// Fetch the file that describes how the floors are connected in the different buildings at KTH
// This file is run initially when the user enters a building view, and fetches the names of the
// SVGs that should be loaded.
async function fetchEntrySVGs() {
    floorStructuresFile = await fetch('houseStructures.json');
    floorStructuresText = await floorStructuresFile.text();
    floorStructuresJSON = JSON.parse(floorStructuresText);

    // D-E-house
    if (house == "D-E-house") {
        houseObject = floorStructuresJSON['D-E-house'];
    }
    mainSVG = houseObject['entry-floor'];
    floorDownPreview = houseObject['entry-down-floor'];
    floorUpPreview = houseObject['entry-up-floor'];

    return [mainSVG, floorUpPreview, floorDownPreview]
}

// This function is used to fetch the name of the given 'floorName' and the
// two floors that the 'floorName' is connected to according to the house structures
// JSON file. This file is used when the user switches floor in the building view.
async function fetchSVGs(floorName) {
    var floor = houseObject[floorName];
    mainSVG = floor['floorName'];
    floorDownPreview = floor['floorDown'];
    floorUpPreview = floor['floorUp'];

    return [mainSVG, floorUpPreview, floorDownPreview]
}
