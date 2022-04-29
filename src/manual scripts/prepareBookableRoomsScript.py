import csv
import os
import xml.etree.ElementTree as ET

"""
This script formats an SVG map of a floor by finding all bookable rooms and colouring them green.

To use:
    Change the file name to the path to the SVG that is to be formatted.
    Change the nameToID to a text file containing a dictionary with premise name as key and premise ID as value
        The dictionary has ";" as delimiter
    Change outputFileName to whatever you want the formatted file to be named.
    Change id to a string in the format "housename(s)-floor"

Author: Vanja Grigoriev
"""

filename = "3270.svg"
nameToID = "premise_to_ID_DEhouse.txt"
outputFileName = "mapEDfloor3.svg"
id = "ED-5"

ET.register_namespace("", "http://www.w3.org/2000/svg")
mytree = ET.parse(filename)
myroot = mytree.getroot()

with open(nameToID, mode='r') as infile:
    reader = csv.reader(infile, delimiter=";")
    mydict = {rows[0]:rows[1] for rows in reader}

    myroot.set("id", id)
    myroot.attrib.pop("width")
    myroot.attrib.pop("height")
    myroot.attrib.pop("style")
    myroot.attrib.pop("preserveAspectRatio")
    style = ET.SubElement(myroot, "style", {"type":"text/css"})
    style.text = "\n  .room:hover {\n    opacity: 0.7\n  }\n  .room {\n    stroke-width: 0.1;\n    stroke: #000;\n  }\n  .nonroom {\n    stroke-width: 0.1;\n    stroke: #000;\n    fill: #f5f5f5;\n  }\n  .non-bookable {fill: #F0F0F0;}\n  .bookable {fill: #0DE47E;}\n  .booked {fill: #ED047E;}\n"
    
    
    for room in list(myroot.iter()):
        if "workspacesFrontGroup" in room.attrib.values():
            myroot[0].remove(room)
        if "{http://www.w3.org/2000/svg}path" == room.tag:
            if "class" in room.attrib:
                room.set("id", room.attrib["id"][3:])
                room.set("class", "room non-bookable")
                if "room non-bookable" == room.attrib["class"]:
                    if room.attrib["id"] in mydict.values():
                        room.set("class", "room bookable")
            else:
                room.set("class", "nonroom")

os.remove(outputFileName)
mytree.write(outputFileName)