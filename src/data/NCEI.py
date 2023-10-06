import requests
ncei_site = 'https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:11791&startdate=2023-10-01&enddate=2023-10-06'
response_API = requests.get(ncei_site)
def getCurrentNCEIData():
    response_API = requests.get(ncei_site, headers={'token': 'kmTpwXwhZXthHCXTkjHIRYWwtxlwgDEE'})
    data = response_API.text
    return data