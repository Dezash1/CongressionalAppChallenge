import requests
import random
import json
import datetime

yearsBackwards = 1


raw_data = []


for y in range(0, yearsBackwards):
    year = datetime.datetime.now().year
    for m in range(1, 12):
        # for m in range(1, 5):
        # There are no more than 27 days in a month. Trust.
        for d in range(1, 27):
            # for d in range(1, 3):
            for i in range(0, 10):
                startMinute = random.randint(0, 35)
                startHour = random.randint(0, 23)
                startTime = str(startHour) + ":" + str(startMinute) + "-" + "0000"
                endTime = (
                    str(startHour)
                    + ":"
                    + str(random.randint(0, 20) + startMinute)
                    + "-"
                    + "0000"
                )
                date = str(year) + "-" + str(m) + "-" + str(d)

                # Query the USGS API for the data
                raw_data.append(
                    requests.get(
                        url="https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01303152&startDT="
                        + date
                        + "T"
                        + startTime
                        + "&endDT="
                        + date
                        + "T"
                        + endTime
                        + "&siteStatus=all"
                    ).json()
                )

with open("raw_data.json", "w") as outfile:
    json.dump(raw_data, outfile)
