import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler


def train(data):
    # Load your dataset
    data = pd.read_csv("water_quality_data.csv")

    # Split the data into features and target metrics
    X = data.drop(
        ["target_metric_1", "target_metric_2", ...], axis=1
    )  # Replace with your metric names
    y = data[
        ["target_metric_1", "target_metric_2", ...]
    ]  # Replace with your metric names

    # Normalize the features
    scaler = MinMaxScaler()
    X_normalized = scaler.fit_transform(X)

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X_normalized, y, test_size=0.2, random_state=42
    )

    model = keras.Sequential(
        [
            keras.layers.Dense(64, activation="relu", input_shape=(X_train.shape[1],)),
            keras.layers.Dense(32, activation="relu"),
            keras.layers.Dense(y_train.shape[1]),  # Output layer for multiple metrics
        ]
    )

    # Compile the model
    model.compile(optimizer="adam", loss="mean_squared_error")

    model.fit(
        X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test)
    )

    loss = model.evaluate(X_test, y_test)
    print(f"Test Loss: {loss}")
