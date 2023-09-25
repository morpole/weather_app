import React, { useState, useCallback, useEffect } from "react";
import "./App.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("Dublin,IE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);

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
    }
  }, [city, fetchWeatherData]);

  const handleCityChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (inputValue.trim()) {
      setCity(inputValue.trim()); // Update city with the input value
      setInputValue(""); // Clear input field
      fetchWeatherData(); // Fetch weather data
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
        <button onClick={fetchForecastData}>Get 5-Day Forecast</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <h2>{weatherData.sys.country}</h2>
          <p>High: {weatherData.main.temp_max}</p>
          {/* change temps to display in whole nums without decimals */}
          <h1>Temp: {weatherData.main.temp}°C</h1>
          <p>Low: {weatherData.main.temp_min}°C</p>
          <img
            className="logo"
            src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
            alt="weather icon"
          />
          <p>{weatherData.weather[0].description}</p>
          <p>Feels like: {weatherData.main.feels_like}°C</p>

          {forecastData && (
            <div>
              <h2>5-Day Forecast</h2>
              {forecastData && forecastData.list && (
                <div>
                  <div className="forecast-list">
                    {forecastData.list.map((forecast, index) => (
                      <div key={index} className="forecast-item">
                        <p>Date and Time: {forecast.dt_txt}</p>
                        <p>Temperature: {Math.round(forecast.main.temp)}°C</p>
                        <p>Weather: {forecast.weather[0].description}</p>
                        <img
                          src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                          alt="weather icon"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
//this is a comment//
