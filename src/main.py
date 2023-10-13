import data.NCEI as NCEI
import data.USGS as USGS
# import ai

#data = data.USGS.getTrainingData()
#ai.train(data)

print(NCEI.getData('2023-10-1', '2023-10-3'))