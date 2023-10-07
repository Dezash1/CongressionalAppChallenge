import requests
import json

with open('data/NCEI_Token', 'r') as token_file:
    token = token_file.read()
ncei_site = 'https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:11791&limit=1000'
# ncei_site = 'https://www.ncei.noaa.gov/cdo-web/api/v2/datatypes?datasetid=GHCND&locationid=ZIP:11791'


def getData(startdate, enddate):  # YYYY-MM-DD
    site = ncei_site + '&startdate=' + startdate + '&enddate=' + enddate
    print(site)
    data = requests.get(ncei_site, headers={'token': token}).json()
    meta = data['metadata']['resultset']
    data = data['results']
    # print(meta)
    ordered_data = {'Precipitation': [[], []], 'MaxTemp': [[], []], 'MinTemp': [[], []], 'TOBS?': [[], []]}
    for i in data:
        match i['datatype']:
            case 'PRCP':
                ordered_data['Precipitation'][0].append(i['value'])
                ordered_data['Precipitation'][1].append(i['date'][8:10])
            case 'TMAX':
                ordered_data['MaxTemp'][0].append(i['value'])
                ordered_data['MaxTemp'][1].append(i['date'][8:10])
            case 'TMIN':
                ordered_data['MinTemp'][0].append(i['value'])
                ordered_data['MinTemp'][1].append(i['date'][8:10])
            case 'TOBS':
                ordered_data['TOBS?'][0].append(i['value'])
                ordered_data['TOBS?'][1].append(i['date'][8:10])

    return ordered_data
