# 'requests' is a HTTP library for sending HTTP requests and more.
# 'requests' is used to fetch the HTML of KTH's cloud.timeedit schedules to 
# get information about when and where rooms are booked at KTH.
# - https://docs.python-requests.org/en/latest/
import requests 
# "Beautiful Soup is a Python library for pulling data out of HTML and XML files".
# This will be used in combination with the requests library above.
# - https://www.crummy.com/software/BeautifulSoup/bs4/doc/
from bs4 import BeautifulSoup

url = "https://cloud.timeedit.net/kth/web/public01/ri15XXQ5043Z58Qv9303X046y3Y140Y37YX1Y6gQ0028173ZY3778647498Y46669X7YYX4779488XX878272Y78979776X9Y779216X797Y677XXXY04572858Y76732986937786Y9Y88X29788Y95X25977X8125377888849979XX77Y6XY2783X7Y16607Y8467YY373Y3841377786Y1683YY8943923X43Y71X4878XX7131XX8938006Y87Q7.html"
# The user-agent retrieved from "my user-agent" search query in Google
# A user-agent is the agent that tries to send the request on behalf of the user
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"}

page = requests.get(url, headers=headers)

soup = BeautifulSoup(page.content, 'html.parser')

# Will find all divs with the class bookingDiv
bookingDivs = soup.findAll("div", "bookingDiv")

print(bookingDivs)