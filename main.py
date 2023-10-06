# importing the requests library
import requests

# api-endpoint
URL = "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01303152&siteStatus=all"

# sending get request and saving the response as response object
r = requests.get(url = URL)

# extracting data in json format
data = r.json()

print(data)
