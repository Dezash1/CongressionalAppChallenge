import data.USGS
import ai

data = data.USGS.getTrainingData()
ai.train(data)
