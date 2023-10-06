import data.USGS as USGS
import ai

USGS = USGS.getCurrentUSGSData()
ai.train(USGS)
