# 'requests' is a HTTP library for sending HTTP requests and more.
# 'requests' is used to fetch the HTML of KTH's cloud.timeedit schedules to 
# get information about when and where rooms are booked at KTH.
# - https://docs.python-requests.org/en/latest/
import requests 
# "Beautiful Soup is a Python library for pulling data out of HTML and XML files".
# This will be used in combination with the requests library above.
# - https://www.crummy.com/software/BeautifulSoup/bs4/doc/
from bs4 import BeautifulSoup
# re is a library for using Regex
import re
# the scraper writes to a csv file
import csv
file = open("bookings.csv", "w")
writer = csv.writer(file)

# Premises to check for in the title attribute containing the information
knownPremises = ["4618", "3721", "4523", "5O1Spe (Spelhallen)", "5O2Spo (Sporthallen)", 
                 "5O3Mus (Musiksalen)", "5O4Kons (Konsthallen)", "5O5Mat (Matsalen)", 
                 "D/LV5 (Ljusgård, D)", "D1", "D2", "D3", "D31", "D33", "D34", "D35", 
                 "D36 (Gamla styrelserummet)", "D37", "D41", "D42", "D4448", "Haptik labb",
                 "Middla Design studio", "Multi Studio", "VIC-studion", "1448", "1537", "1625",
                 "4V2Röd (Röd)", "4V3Ora (Orange)", "4V4Gul (Gul)", "4V5Grö (Grön)", "4V6 Bru (Brun)", 
                 "5V1Grå (Grå)", "5V2Kar (Karmosin)", "5V3Vit (Vit)", "5V4Mag (Magenta)", "5V5Vio (Violett)",
                 "5V6Tur (Turkos)", "E/1315", "E/LV3", "E1", "E2", "E3", "E31", "E32", "E33", "E34",
                 "E35", "E36", "E51", "E52", "E53"]

# URL to be scraped
url = "https://cloud.timeedit.net/kth/web/public01/ri15XXQ5043Z58Qv9303X046y3Y140Y37YX1Y6gQ0028173ZY3778647498Y46669X7YYX4779488XX878272Y78979776X9Y779216X797Y677XXXY04572858Y76732986937786Y9Y88X29788Y95X25977X8125377888849979XX77Y6XY2783X7Y16607Y8467YY373Y3841377786Y1683YY8943923X43Y71X4878XX7131XX8938006Y87Q7.html"

# The user-agent retrieved from "my user-agent" search query in Google
# A user-agent is the agent that tries to send the request on behalf of the user
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"}

# Returns a HTTP response with the HTML of the url
page = requests.get(url, headers=headers)

# Parses the HTML and puts it in a easier format with BeautifulSoup
soup = BeautifulSoup(page.content, 'html.parser')

# Find all divs with the class bookingDiv (these contain information about date, time, etc. for a booking)
bookingDivs = soup.findAll("div", "bookingDiv")

# The title attributes contain a string will all important information concerning the booking
titles = []
for bookingDiv in bookingDivs:
    titles.append(bookingDiv["title"])

# Format for date and time
date = re.compile("\\d{4}-\\d{2}-\\d{2}")
time = re.compile("\\d{2}:\\d{2} - \\d{2}:\\d{2}")

# Write booking information to csv file in format (example): 2022-04-16T08:00,2022-04-16T21:00,5O2Spo (Sporthallen)
for title in titles:
    csvRow = []
    premisesFoundInTitle = []
    # Date
    dateResult = date.search(title).group(0)
    # startTime and endTime
    timeResult = time.search(title).group(0).split("-")
    # Find the booked premis(es) name
    for premis in knownPremises:
        if title.__contains__(premis):
            premisesFoundInTitle.append(premis)
    # Create the csv row entry
    for csvEntry in range(len(premisesFoundInTitle)):
        csvRow.append(dateResult+"T"+timeResult[0].strip())
        csvRow.append(dateResult+"T"+timeResult[1].strip())
        csvRow.append(premisesFoundInTitle[csvEntry])
        writer.writerow(csvRow)
file.close()
