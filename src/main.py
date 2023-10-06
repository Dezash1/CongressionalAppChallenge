import data.USGS as USGS
import data.NCEI as NCEI
import ai

USGS = USGS.getCurrentUSGSData()
ai.train(USGS)

