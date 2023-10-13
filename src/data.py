import requests
import random
import json


def getCurrentUSGSData(yearsBackwards):
    raw_data = []

    for y in range(0, yearsBackwards):
        year = 2023
        for m in range(1, 12):
        # for m in range(1, 5):
            # There are no more than 27 days in a month. Trust.
            for d in range(1, 27):
            # for d in range(1, 3):
                for i in range(0, 10):
                    startMinute = random.randint(0, 35)
                    startHour = random.randint(0, 23)
                    startTime = str(startHour) + ':' + str(startMinute) + '-' + '0000'
                    endTime = str(startHour) + ':' + str(random.randint(0, 20) + startMinute) + '-' + '0000'
                    date = str(year) + '-' + str(m) + '-' + str(d)

                    #Query the USGS API for the data
                    raw_data.append(requests.get(url="https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01303152&startDT=" + date + "T" + startTime + "&endDT=" + date + "T" + endTime + "&siteStatus=all").json())


    with open('raw_data.json', 'w') as outfile:
        json.dump(raw_data, outfile)

    # raw_data = requests.get(
    #     url="https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01303152&siteStatus=all"
    # ).json()
    #
    # #https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01303152&startDT=2023-06-05&endDT=2023-10-06&siteStatus=all
    #
    # # data_names = []
    # data = []
    #
    # for data_point in raw_data["value"]["timeSeries"]:
    #     # name = data_point["variable"]["variableName"]
    #     value = data_point["variable"]["variableCode"][0]["value"]
    #
    #     # data_names.append(name)
    #     data.append(value)

    return raw_data
