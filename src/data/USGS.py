import requests


def getImportantData(raw_data):
    # data_names = []
    data = []

    for data_point in raw_data["value"]["timeSeries"]:
        # name = data_point["variable"]["variableName"]
        value = data_point["variable"]["variableCode"][0]["value"]

        # data_names.append(name)
        data.append(value)

    return data


def getCurrentData():
    raw_data = requests.get(
        url="https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01303152&siteStatus=all"
    ).json()

    return getImportantData(raw_data)


def getTrainingDate():
    pass
