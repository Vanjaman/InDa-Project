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

// Fetch the file that describes how the floors are connected in the different buildings at KTH
async function fetchEntrySVGs() {
    var floorStructuresFile = await fetch('houseStructures.json');
    var floorStructuresText = await floorStructuresFile.text();
    var floorStructuresJSON = JSON.parse(floorStructuresText);

    // D-E-house
    if (house == "D-E-house") {
        var houseObject = floorStructuresJSON['D-E-house'];
        mainSVG = houseObject['entry-floor'];
        floorDownPreview = houseObject['entry-down-floor'];
        floorUpPreview = houseObject['entry-up-floor'];

        console.log(mainSVG, floorDownPreview, floorUpPreview)
    }

    return [mainSVG, floorDownPreview, floorUpPreview]
}
