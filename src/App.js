import './App.css';

import {
  WiDaySunny, WiDayCloudy, WiDayFog, WiDayHaze, WiDayRain, WiDayShowers,
  WiDaySnow, WiDayLightning, WiBarometer, WiDaySunnyOvercast, WiDayThunderstorm,
  WiFog, WiHumidity, WiNightAltCloudy, WiNightAltSnow, WiNightAltRain, WiNightAltShowers, WiNightAltThunderstorm,
  WiNightClear, WiNightCloudy, WiNightFog, WiNightPartlyCloudy, WiNightAltCloudyGusts, WiThermometer, WiCelsius
} from 'weather-icons-react';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormOutlinedIcon from '@mui/icons-material/ThunderstormOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import PublicIcon from '@mui/icons-material/Public';
import CloudTwoToneIcon from '@mui/icons-material/CloudTwoTone';
import AirTwoToneIcon from '@mui/icons-material/AirTwoTone';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';

import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined';

import { useEffect, useState } from 'react';

function App() {
  const [cityName, setCityName] = useState('');
  const [data, setData] = useState(null);
  const [forecasts, setForecasts] = useState(null);

  const apiKey = '651ce41f9ed2d27bb56553cad7676b52';

  const apiUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  const apiUrl2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchForecasts = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setForecasts(data);
      console.log(forecasts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    fetchData(apiUrl1);
    fetchForecasts(apiUrl2);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
          fetchData(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
          fetchForecasts(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const tzlookup = require('tz-lookup');

  function convertDateTimestamp(data, dt) {
    const timezone = tzlookup(data.coord.lat, data.coord.lon);
    const unixTimestamp = dt * 1000 + 5 * 60 * 1000;
    const date = new Date(unixTimestamp);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);

    return formattedDate;
  }

  function convertTimestamp(data, dt) {
    const timezone = tzlookup(data.coord.lat, data.coord.lon);
    const unixTimestamp = dt * 1000;
    const date = new Date(unixTimestamp);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);

    return formattedDate;
  }

  const getWeatherIcon = (weatherStatus, timestamp) => {
    const sunriseDate = new Date(data.sys.sunrise * 1000);
    const sunsetDate = new Date(data.sys.sunset * 1000);
    const forecastDate = new Date(timestamp * 1000);

    const sunriseTime = sunriseDate.getHours() * 60 + sunriseDate.getMinutes();
    const sunsetTime = sunsetDate.getHours() * 60 + sunsetDate.getMinutes();
    const forecastTime = forecastDate.getHours() * 60 + forecastDate.getMinutes();

    const isDay = forecastTime > sunriseTime && forecastTime < sunsetTime;
    switch (weatherStatus) {
      case 'Thunderstorm':
        return isDay ? <ThunderstormOutlinedIcon style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightAltThunderstorm style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Drizzle':
        return isDay ? <WiDayRain style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightAltRain style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Sunny':
        return <WiDaySunny style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Rain':
        return isDay ? <WiDayRain style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightAltShowers style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Snow':
        return isDay ? <WiDaySnow style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightAltSnow style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Clear':
        return isDay ? <WiDaySunny style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightClear style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Clouds':
        return isDay ? <WiDayCloudy style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightAltCloudy style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Smoke':
        return isDay ? <WiDayFog style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightFog style={{ fontSize: "60", marginTop: "15" }} />;
      case 'Overcast':
        return isDay ? <WiDaySunnyOvercast style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightAltCloudyGusts style={{ fontSize: "60", marginTop: "15" }} />;
      default:
        return isDay ? <WiDaySunny style={{ fontSize: "60", marginTop: "15" }} /> : <WiNightCloudy style={{ fontSize: "60", marginTop: "15" }} />;
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="name">Weatherly</div>
        <div className="search">
          <SearchOutlinedIcon style={{ fontSize: "20", marginLeft: "-10", marginRight: "10" }} />
          <input type="text" placeholder='Enter cityname ...' value={cityName}
            onChange={(e) => setCityName(e.target.value)}></input>
          <button onClick={handleSearch}>Search</button>
          <button onClick={getCurrentLocation}>Current Location</button>
        </div>
      </header>

      <div className="main">
        <div className="side-section">
          <div className="tempdata">
            <div className="top">Now</div>
            <div className="temp">
              <div className="tempval" id="tempval">
                <div className='value'>{data ? (data.main.temp - 273.15).toFixed(2) : '--'}</div>°C
              </div>
              <div className="icon">{data ? getWeatherIcon(data.weather[0].main, data.dt) : null}</div>
            </div>
            <div className="status" id="status">{data ? data.weather[0].main : '-'}</div>
            <div className="other">
              <div className="text" id="date">
                <CalendarTodayOutlinedIcon style={{ fontSize: "20" }} />
                <div>{data ? convertDateTimestamp(data, data.dt) : '-'}</div>
              </div>
              <div className="text" id="location">
                <LocationOnIcon style={{ fontSize: "20" }} />
                <div>{data ? data.name + " , " + data.sys.country : '--'}</div>
              </div>
            </div>
          </div>
          <div className="tempdata">
            <div className="top">Coordinates</div>
            <div className="coord">
              <div className="top">Latitude</div>
              <div className="val">{data ? data.coord.lat + ' °' : '-'}<PublicIcon /></div>
            </div>

            <div className="coord">
              <div className="top">Longitude</div>
              <div className="val">{data ? data.coord.lon + ' °' : '-'}<PublicIcon /></div>
            </div>
            <div className="coord">
              <div className="top">Clouds</div>
              <div className="val">{data ? data.clouds.all + ' %' : '-'}<CloudTwoToneIcon /></div>
            </div>
          </div>
        </div>
        <div className='section'>
          <div className='details'>
            <h4>Today's Highlights</h4>
            <div className='container'>
              <div className='component'>
                <div className='heading'>Air and Temperature</div>
                <div className='parts'>
                  <div className='icon'><AirTwoToneIcon style={{ fontSize: "60" }} /></div>
                  <div className='part'>
                    <div className='top'>Max Temp</div>
                    <div className='val'>{data ? (data.main.temp_max - 273.15).toFixed(1) + ' °C' : '--'}</div>
                  </div>
                  <div className='part'>
                    <div className='top'>Min Temp</div>
                    <div className='val'>{data ? (data.main.temp_min - 273.15).toFixed(1) + ' °C' : '--'}</div>
                  </div>
                  <div className='part'>
                    <div className='top'>Speed</div>
                    <div className='val'>{data ? data.wind.speed.toFixed(1) + ' km/h' : '--'}</div>
                  </div>
                  <div className='part'>
                    <div className='top'>Deg</div>
                    <div className='val'>{data ? data.wind.deg + ' °' : '--'}</div>
                  </div>
                </div>
              </div>
              <div className='component'>
                <div className='heading'>Sunrise & Sunset</div>
                <div className='parts'>
                  <div className='icon'><LightModeOutlinedIcon style={{ fontSize: "60" }} /></div>
                  <div className='part'>
                    <div className='top'>Sunrise</div>
                    <div className='val'>
                      {data ? convertTimestamp(data, data.sys.sunrise) : '-'}
                    </div>
                  </div>
                  <div className='icon'><DarkModeOutlinedIcon style={{ fontSize: "60" }} /></div>
                  <div className='part'>
                    <div className='top'>Sunset</div>
                    <div className='val'>
                      {data ? convertTimestamp(data, data.sys.sunset) : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='component'>
                <div className='parts1'>
                  <div className='icon'><WiThermometer style={{ fontSize: "60" }} /></div>
                  <div className='part'>
                    <div className='top'>Kelvin</div>
                    <div className='val'>{data ? data.main.temp.toFixed(1) + ' K' : '--'}</div>
                  </div>
                  <div className='icon'><WiThermometer style={{ fontSize: "60" }} /></div>
                  <div className='part'>
                    <div className='top'>Fahrenheit</div>
                    <div className='val'>{data ? ((data.main.temp_max - 273.15) * 9 / 5 + 32).toFixed(1) + ' °F' : '--'}</div>
                  </div>
                  <div className='icon'><WiThermometer style={{ fontSize: "60" }} /></div>
                  <div className='part'>
                    <div className='top'>Feels Like</div>
                    <div className='val'>{data ? ((data.main.feels_like - 273.15)).toFixed(2) + ' °F' : '--'}</div>
                  </div>
                </div>
              </div>
              <div className='component'>
                <div className='parts1'>
                  <div className='icon'><VisibilityOutlinedIcon style={{ fontSize: "45" }} /></div>
                  <div className='part'>
                    <div className='top'>Visibility</div>
                    <div className='val'>{data ? (data.visibility / 1000).toFixed(1) + ' Km' : '-'}</div>
                  </div>
                  <div className='icon'><WaterDropOutlinedIcon style={{ fontSize: "45" }} /></div>
                  <div className='part'>
                    <div className='top'>Humidity</div>
                    <div className='val'>{data ? data.main.humidity + ' %' : '-'}</div>
                  </div>
                  <div className='icon'><WiBarometer style={{ fontSize: "55 " }} /></div>
                  <div className='part'>
                    <div className='top'>Pressure</div>
                    <div className='val'>{data ? data.main.pressure + ' hPa' : '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className='forecasts'>
          <div className='top'>3-Hour Forecast</div>
          <div className='forecast'>
            {forecasts && forecasts.list && forecasts.list.length > 0 ? (
              (() => {
                const forecastItems = [];
                for (let i = 0; i < forecasts.list.length; i++) {
                  const forecast = forecasts.list[i];

                  forecastItems.push(
                    <div className='data' key={i}>
                      <div className='date'>
                        {forecast ? convertDateTimestamp(data, forecast.dt) : '-'}
                      </div>
                      <div className='temp' style={{ marginTop: '-7px', marginBottom: '-20px' }}>
                        <div className='v'>{(forecast.main.temp - 273.15).toFixed(0)}</div>
                        <WiCelsius />
                        <div className='icon'>{getWeatherIcon(forecast.weather[0].main, forecast.dt)}</div>
                      </div>
                      <div className='date'>{forecast.weather[0].main}</div>
                      <div className='others'>
                        <div className='other'>
                          <div className='top'>Max</div>
                          <div className='val'>{(forecast.main.temp_max - 273.15).toFixed(0)} °C</div>
                        </div>
                        <div className='other'>
                          <div className='top'>Min</div>
                          <div className='val'>{(forecast.main.temp_min - 273.15).toFixed(0)} °C</div>
                        </div>
                      </div>
                      <div className='others'>
                        <div className='other'>
                          <div className='top'>Humid</div>
                          <div className='val'>{(forecast.main.humidity).toFixed(0)} %</div>
                        </div>
                        <div className='other'>
                          <div className='top'>Speed</div>
                          <div className='val'>{(forecast.wind.speed).toFixed(2)}</div>
                        </div>
                      </div>
                      <div className='others'>
                        <div className='other'>
                          <div className='top'>Clouds</div>
                          <div className='val'>{(forecast.clouds.all) + ' %'}</div>
                        </div>
                        <div className='other'>
                          <div className='top'>Sea level</div>
                          <div className='val'>{(forecast.main.sea_level).toFixed(0)}</div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return forecastItems;
              })()
            ) : (
              <div>No forecast data available</div>
            )}
          </div>
        </div>
    </div>
  );
}

export default App;
