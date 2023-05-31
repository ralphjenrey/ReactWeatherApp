import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const Map = ({ center }) => {
  return (
    <GoogleMap zoom={50} center={center} mapContainerClassName="map-container">
    
    </GoogleMap>
  );
};

function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyApP6fMWknPbMn93nRMJxt1f1puuYWx-hQ",
  });

  const center = useMemo(() => ({ lat: Number(latitude), lng: Number(longitude) }), [
    latitude,
    longitude,
  ]);

  const getWeather = async (latitude, longitude) => {
    try {
      // Fetch weather data
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimezone = async (latitude, longitude) => {
    try {
      // Fetch timezone data
      const apiKey = "TWENCKLXEA44";
      const apiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&by=position&lat=${latitude}&lng=${longitude}&format=json`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch timezone data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDaySelect = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const latitude = event.target.elements.latitude.value;
    const longitude = event.target.elements.longitude.value;
    const timezoneData = await getTimezone(latitude, longitude);

    if (timezoneData) {
      const currentDate = timezoneData.formatted;
      setCurrentTime(currentDate);
      setLocationInfo({
        country: timezoneData.countryName,
        region: timezoneData.regionName,
        city: timezoneData.cityName,
        timezone: timezoneData.zoneName,
        abbreviation: timezoneData.abbreviation,
      });
    }

    setLatitude(latitude);
    setLongitude(longitude);
    getWeather(latitude, longitude);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container py-5 h-100">
      <Map center={center} />

      <h1 className="mt-4 mb-4">Weather App</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Latitude</label>
          <input
            type="text"
            className="form-control text-center"
            placeholder="Enter Latitude"
            name="latitude"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Longitude</label>
          <input
            type="text"
            className="form-control text-center"
            placeholder="Enter Longitude"
            name="longitude"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Get Weather
        </button>
      </form>

      {weatherData && (
        <div className="mt-4">
          {/* CurrentWeather component */}
          <h2 className="text-left">Current Weather</h2>
          <p>Time: {currentTime}</p>
          <p className="celcius">Temperature: {weatherData.current_weather.temperature}</p>
          <p>City: {locationInfo.city}</p>
          <p>Region: {locationInfo.region}</p>
          <p>Country: {locationInfo.country}</p>
          <p>
            Timezone: {locationInfo.timezone} {locationInfo.abbreviation}
          </p>

          {/* Hourly weather data */}
          <h2>Hourly Weather Data</h2>
          <select onChange={handleDaySelect}>
            <option value="">Select a day</option>
            {Object.keys(weatherData.hourly.time).map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>

          {selectedDay && (
            <ul className="list-group mt-3 d-flex flex-row flex-wrap">
              {weatherData.hourly.time[selectedDay].map((data, index) => (
                <li key={index} className="list-group-item mb-1 col-6 col-md-2">
                  {data.time} <br />
                  <span className="celcius">{data.temperature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
