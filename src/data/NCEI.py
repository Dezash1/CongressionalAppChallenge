import requests
import json

ncei_site = 'https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:11791&startdate=2023-09-19&enddate=2023-10-06&limit=1000'
# ncei_site = 'https://www.ncei.noaa.gov/cdo-web/api/v2/datatypes?datasetid=GHCND&locationid=ZIP:11791'
response_API = requests.get(ncei_site)
def getCurrentNCEIData():
    print('getting')
    response_API = requests.get(ncei_site, headers={'token': 'kmTpwXwhZXthHCXTkjHIRYWwtxlwgDEE'})
    print('got')
    data = response_API.text
    parse_json = json.loads(data)
    data = parse_json['results']
    meta = parse_json['metadata']['resultset']
    print(meta)
    ordered_data = {'Precipitation' : [[], []], 'MaxTemp': [[], []], 'MinTemp': [[], []], 'TOBS?': [[], []] }
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