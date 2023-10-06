import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


def run(data):
    # Generate some synthetic data for demonstration purposes
    # In reality, you would need real data for training
    X = np.random.rand(100, 5)  # 5 water quality metrics as features
    y = np.random.randint(
        0, 2, 100
    )  # Binary classification (0 for no algal bloom, 1 for algal bloom)

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Standardize the features (mean=0, std=1)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Define a simple neural network model
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Input(shape=(5,)),
            tf.keras.layers.Dense(16, activation="relu"),
            tf.keras.layers.Dense(1, activation="sigmoid"),
        ]
    )

    # Compile the model
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

    # Train the model
    model.fit(
        X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test)
    )

    # Evaluate the model on the test set
    loss, accuracy = model.evaluate(X_test, y_test)
    print(f"Test Loss: {loss:.4f}, Test Accuracy: {accuracy:.4f}")

    # Make predictions on new data (replace with real water quality metrics)
    new_data = np.array([[0.1, 0.2, 0.3, 0.4, 0.5]])  # Replace with actual values
    new_data = scaler.transform(new_data)
    predictions = model.predict(new_data)
    if predictions[0][0] > 0.5:
        print("Algal bloom is likely.")
    else:
        print("No algal bloom is likely.")
