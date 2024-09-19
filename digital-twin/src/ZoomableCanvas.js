
import React, { useState, useEffect, useRef } from 'react';
import './ZoomableCanvas.css';

// Function to generate random default values
const generateDefaultValues = (sensors) => {
  const defaultValues = {};
  sensors.forEach((sensor) => {
    defaultValues[sensor.id] = Math.floor(Math.random() * 250); // Random value between 0 and 249
  });
  return defaultValues;
};

const sensors = [
    { name: 'FIT101', nonNull: 449919, type: 'float64' },
    { name: 'LIT101', nonNull: 449919, type: 'float64' },
    { name: 'MV101', nonNull: 449919, type: 'int64' },
    { name: 'P101', nonNull: 449919, type: 'int64' },
    { name: 'P102', nonNull: 449919, type: 'int64' },
    { name: 'AIT201', nonNull: 449919, type: 'float64' },
    { name: 'AIT202', nonNull: 449919, type: 'float64' },
    { name: 'AIT203', nonNull: 449919, type: 'float64' },
    { name: 'FIT201', nonNull: 449919, type: 'float64' },
    { name: 'MV201', nonNull: 449919, type: 'int64' },
    { name: 'P201', nonNull: 449919, type: 'int64' },
    { name: 'P202', nonNull: 449919, type: 'int64' },
    { name: 'P203', nonNull: 449919, type: 'int64' },
    { name: 'P204', nonNull: 449919, type: 'int64' },
    { name: 'P205', nonNull: 449919, type: 'int64' },
    { name: 'P206', nonNull: 449919, type: 'int64' },
    { name: 'DPIT301', nonNull: 449919, type: 'float64' },
    { name: 'FIT301', nonNull: 449919, type: 'float64' },
    { name: 'LIT301', nonNull: 449919, type: 'float64' },
    { name: 'MV301', nonNull: 449919, type: 'int64' },
    { name: 'MV302', nonNull: 449919, type: 'int64' },
    { name: 'MV303', nonNull: 449919, type: 'int64' },
    { name: 'MV304', nonNull: 449919, type: 'int64' },
    { name: 'P301', nonNull: 449919, type: 'int64' },
    { name: 'P302', nonNull: 449919, type: 'int64' },
    { name: 'AIT401', nonNull: 449919, type: 'float64' },
    { name: 'AIT402', nonNull: 449919, type: 'float64' },
    { name: 'FIT401', nonNull: 449919, type: 'float64' },
    { name: 'LIT401', nonNull: 449919, type: 'float64' },
    { name: 'P401', nonNull: 449919, type: 'int64' },
    { name: 'P402', nonNull: 449919, type: 'int64' },
    { name: 'P403', nonNull: 449919, type: 'int64' },
    { name: 'P404', nonNull: 449919, type: 'int64' },
    { name: 'UV401', nonNull: 449919, type: 'int64' },
    { name: 'AIT501', nonNull: 449919, type: 'float64' },
    { name: 'AIT502', nonNull: 449919, type: 'float64' },
    { name: 'AIT503', nonNull: 449919, type: 'float64' },
    { name: 'AIT504', nonNull: 449919, type: 'float64' },
    { name: 'FIT501', nonNull: 449919, type: 'float64' },
    { name: 'FIT502', nonNull: 449919, type: 'float64' },
    { name: 'FIT503', nonNull: 449919, type: 'float64' },
    { name: 'FIT504', nonNull: 449919, type: 'float64' },
    { name: 'P501', nonNull: 449919, type: 'int64' },
    { name: 'P502', nonNull: 449919, type: 'int64' },
    { name: 'PIT501', nonNull: 449919, type: 'float64' },
    { name: 'PIT502', nonNull: 449919, type: 'float64' },
    { name: 'PIT503', nonNull: 449919, type: 'float64' },
    { name: 'FIT601', nonNull: 449919, type: 'float64' },
    { name: 'P601', nonNull: 449919, type: 'int64' },
    { name: 'P602', nonNull: 449919, type: 'int64' },
    { name: 'P603', nonNull: 449919, type: 'int64' },
    { name: 'Normal/Attack', nonNull: 449919, type: 'object' },
    { name: 'Timestamp', nonNull: 449919, type: 'datetime64[ns]' },
  ];
  

const ZoomableCanvas = () => {
  const [sensorValues, setSensorValues] = useState(generateDefaultValues(sensors));
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSelectedSensor(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = (sensor, event) => {
    setSelectedSensor(sensor);
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height });
  };

  const handleValueChange = (e) => {
    if (selectedSensor) {
      setSensorValues({
        ...sensorValues,
        [selectedSensor.id]: Number(e.target.value),
      });
    }
  };

  const getStatusLight = (value) => {
    if (value > 200) {
      return <div className="light red"></div>; // Red light for abnormal value
    }
    return <div className="light green"></div>; // Green light for normal value
  };

  const predictState = async () => {
    try {
        // Prepare data to send to the backend
        const inputData = Object.values(sensorValues);

        // Send POST request to the backend
        const response = await fetch('http://localhost:5000/predict', {  // Adjust the URL if needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: inputData }),
        });

        // Get the prediction from the response
        const data = await response.json();
        alert(`Prediction: ${data.prediction === 1 ? 'Attack' : 'Normal'}`);
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <>
      <div style={{ textAlign: 'center', fontSize: 50, fontWeight: 'bold' }}>
        SwaT Testbed
      </div>
      <div className="grid-container">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="sensor">
            <div
              onClick={(e) => handleClick(sensor, e)}
              className="sensor-box"
            >
              <span>
                {sensor.id}: {sensorValues[sensor.id]}
              </span>
              <div className="lights">{getStatusLight(sensorValues[sensor.id])}</div>
            </div>
          </div>
        ))}

        {selectedSensor && (
          <div
            className="control-panel"
            ref={inputRef}
            style={{
              position: 'absolute',
              left: popupPosition.x,
              top: popupPosition.y,
              transform: 'translate(-50%, 10px)', // Adjust position near the sensor
              backgroundColor: 'white',
              padding: '10px',
              border: '1px solid black',
              zIndex: 1000,
            }}
          >
            <input
              type="number"
              value={sensorValues[selectedSensor.id]}
              onChange={handleValueChange}
              placeholder={`Set value for ${selectedSensor.id}`}
            />
          </div>
        )}
      </div>

      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={predictState} style={{ padding: '10px 20px' }}>
          Predict
        </button>
      </div>
    </>
  );
};

export default ZoomableCanvas;

