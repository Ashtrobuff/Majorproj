from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)

# Load the model
model = load_model('swat_lstm_model.h5')

# Initialize the scaler (fit it with sample data or load a pre-fitted scaler)
scaler = MinMaxScaler()
# Dummy fit; replace with your scaler or fit with training data if needed
scaler.fit(np.random.rand(100, 10))  # Replace (100, 10) with actual feature shape

def prepare_input(user_inputs, scaler, time_steps=100):
    """
    Prepares the input data from the front-end for model prediction.
    """
    # Convert user inputs to a DataFrame or array and scale the features
    user_inputs = np.array(user_inputs).reshape(1, -1)  # Assuming user inputs are for one instance
    user_inputs_scaled = scaler.transform(user_inputs)  # Scale the features

    # Reshape the data to match the LSTM input shape (time_steps, num_features)
    sequence = np.array([user_inputs_scaled for _ in range(time_steps)]).reshape(1, time_steps, user_inputs_scaled.shape[1])

    return sequence

@app.route('/predict', methods=['POST'])
def predict():
    # Get user inputs from the front-end
    data = request.get_json()
    user_inputs = data['inputs']
    
    # Prepare the input sequence
    sequence = prepare_input(user_inputs, scaler)

    # Make predictions
    prediction = model.predict(sequence)
    prediction_label = (prediction > 0.5).astype(int).item()  # Convert numpy array to int

    # Return the prediction as a JSON response
    return jsonify({'prediction': prediction_label})

if __name__ == '__main__':
    app.run(debug=True)
