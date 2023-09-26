import React, { useState, useCallback, useEffect } from "react";
import "./App.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("Dublin,IE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const fetchWeatherData = useCallback(async () => {
    try {
      if (!city) {
        return;
      }

      setLoading(true); // Start loading
      setError(null); // Clear previous error

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&limit=2&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data not found");
      }
      const data = await response.json();
      console.log("Weather Data:", data);
      setWeatherData(data);
    } catch (error) {
      setError(error.message); // Set error message
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false); // Stop loading, whether success or error
    }
  }, [apiKey, city]);

  const fetchForecastData = useCallback(async () => {
    try {
      if (!city) {
        return;
      }

      setLoading(true);
      setError(null);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error("Forecast data not found");
      }

      const forecastData = await forecastResponse.json();
      console.log("Forecast Data:", forecastData);
      setForecastData(forecastData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching forecast data:", error);
    } finally {
      setLoading(false);
    }
  }, [apiKey, city]);

  useEffect(() => {
    if (city) {
      fetchWeatherData();
      fetchForecastData();
    }
  }, [city, fetchWeatherData, fetchForecastData]);

  const handleCityChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (inputValue.trim()) {
      setCity(inputValue.trim()); // Update city with the input value
      setInputValue(""); // Clear input field
      // fetchWeatherData(); 
      // Fetch weather data
    }
  };


  // Helper function to group forecast items by date
function groupForecastByDate(forecastList) {
  const grouped = {};
  forecastList.forEach((forecast) => {
    const date = formatDate(forecast.dt_txt);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(forecast);
  });
  return Object.values(grouped);
}

// Helper function to format date (extract day and time without seconds)
function formatDate(dt_txt) {
  const parts = dt_txt.split(' ');
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':')[0];

  const formattedDate = `${dateParts[2]}`;
  const formattedTime = `${timeParts[0]}${timeParts[1]}`;

  return {
    formattedDate,
    formattedTime,
  }
};



  return (
    <div>
      <header>
        <h2 className="header" alt="header">
          myWeather
        </h2>
      </header>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cityInput"></label>
        <input
          type="text"
          id="cityInput"
          value={inputValue}
          onChange={handleCityChange}
          placeholder=" Enter City"
        />
        <button type="submit">Get Weather</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <h2>{weatherData.sys.country}</h2>
          <p>High: {Math.round(weatherData.main.temp_max)}</p>
          <h1>Temp: {Math.round(weatherData.main.temp)}°C</h1>
          <p>Low: {Math.round(weatherData.main.temp_min)}°C</p>
          <img
            className="logo"
            src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="weather icon"
          />
          <p>{weatherData.weather[0].description}</p>
          <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>

   

{forecastData && (
  <div>
    <h2>5-Day Forecast</h2>
    <div className="forecast-list">
      {groupForecastByDate(forecastData.list).map((group, index) => (
        <div key={index} className="forecast-day">
          {/* <h3>{formatDate(group[0].dt_txt)}</h3> */}
          <div className="forecast-container">
            {group.map((forecast, idx) => (
              <div key={idx} className="forecast-item">
                <h3>{formatDate(forecast.dt_txt).formattedDate}</h3>
                <p>{formatDate(forecast.dt_txt).formattedTime}</p>

                <h2>{Math.round(forecast.main.temp)}°C</h2>
                {/* <p>{forecast.weather[0].description}</p> */}
                <img
                  src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                  alt="weather icon"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
      )}
    </div>


  );
};

export default function App() {
  return (
    <div className="App">
      <Weather />
    </div>
  );
}


// changed temps to display in whole nums without decimals //
// Changed to single Get Weather button for Current and 5 Day Forecast 