import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  WiHail,
  WiStormShowers,
  WiThunderstorm,
  WiSprinkle,
  WiRain,
  WiSnow,
  WiFog,
  WiDaySunny,
  WiNightClear,
  WiCloud,
  WiCloudy,
  WiDust,
  WiHurricane,
  WiSnowflakeCold,
  WiRainMix,
  WiDayHaze,
  WiSmoke,
  WiDayCloudy,
  WiNightAltCloudy,
  WiDayRain,
  WiRainWind,
  WiShowers,
  WiDayShowers,
  WiRaindrops,
  WiNightCloudy,
  WiNightRain,
  WiNightShowers,
  WiNightAltRain,
  WiNightAltSprinkle,
  WiNa,
  WiSleet
} from "react-icons/wi";
import { FaLongArrowAltUp } from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const apiKey = import.meta.env.VITE_SOME_VALUE;

const WeatherList = () => {
  const [value, setValue] = useState('');
  const [info, setInfo] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const locationFound = () => {
    const success = (position) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    }
    const errorResponse = (error) => {
      if (error.code == 1) {
        alert("Access denied");
      } else if (error.code == 2) {
        alert("Location is not available");
      }
    }
    navigator.geolocation.getCurrentPosition(success, errorResponse)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${value}&units=metric&appid=${apiKey}&lang=es`);
        const currentRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${value}&units=metric&appid=${apiKey}&lang=es`);
        setInfo(forecastRes.data.list);
        setCurrentWeather(currentRes.data);
      } catch (e) {
        setInfo([]);
        setCurrentWeather(null);
      }
    }
    if (value) {
      fetchData();
    }
  }, [value]);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=5&appid=${apiKey}&lang=es`);
        setValue(res.data[0].name);
      } catch (e) {
        console.error('Error fetching location name:', e);
      }
    }
    if (lat && long) {
      fetchLocation();
    }
  }, [lat, long]);

  const groupByDay = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.dt_txt).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };

  const getWeatherIcon = (id, isDay) => {
    switch (true) {
      // Group 2xx: Thunderstorm
      case id >= 200 && id < 210:
        return <WiThunderstorm />;
      case id >= 210 && id < 220:
        return <WiLightning />;
      case id >= 220 && id < 300:
        return <WiStormShowers />;
      
      // Group 3xx: Drizzle
      case id === 300: 
        return <WiSprinkle />;
      case id === 301:
        return <WiSprinkle />;
      case id === 302:
        return <WiRainMix />;
      case id === 310:
        return isDay ? <WiDayShowers /> : <WiNightAltSprinkle />;
      case id === 311:
        return <WiRainMix />;
      case id === 312:
        return <WiRainWind />;
      case id === 313:
        return <WiShowers />;
      case id === 314:
        return <WiRainWind />;
      case id === 321:
        return <WiShowers />;
      
      // Group 5xx: Rain
      case id === 500:
        return isDay ? <WiDayRain /> : <WiNightRain />;
      case id === 501:
      case id === 520:
        return <WiRain />;
      case id === 502:
      case id === 503:
      case id === 504:
      case id === 521:
      case id === 522:
      case id === 531:
        return <WiRainWind />;
      case id === 511:
        return <WiSnowflakeCold />;
      
      // Group 6xx: Snow
      case id === 600:
      case id === 601:
      case id === 602:
        return <WiSnow />;
      case id === 611:
      case id === 612:
      case id === 613:
      case id === 615:
      case id === 616:
      case id === 620:
      case id === 621:
      case id === 622:
        return <WiRainMix />;
      
      // Group 7xx: Atmosphere
      case id === 701:
      case id === 741:
        return <WiFog />;
      case id === 711:
        return <WiSmoke />;
      case id === 721:
        return <WiDayHaze />;
      case id === 731:
      case id === 751:
      case id === 761:
      case id === 762:
        return <WiDust />;
      case id === 771:
        return <WiWindy />;
      case id === 781:
        return <WiHurricane />;
      
      // Group 800: Clear
      case id === 800:
        return isDay ? <WiDaySunny /> : <WiNightClear />;
      
      // Group 80x: Clouds
      case id === 801:
        return isDay ? <WiDayCloudy /> : <WiNightAltCloudy />;
      case id === 802:
        return <WiCloud />;
      case id === 803:
        return isDay ? <WiCloudy /> : <WiNightCloudy />;
      case id === 804:
        return <WiCloudy />;
      
      // Special cases
      case id === 906:
        return <WiHail />;
      case id === 957:
        return <WiRaindrops />;
      
      // Default case
      default:
        return <WiNa />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getWindDirection = (deg) => {
    if (deg > 337.5 || deg <= 22.5) return 'N';
    if (deg > 22.5 && deg <= 67.5) return 'NE';
    if (deg > 67.5 && deg <= 112.5) return 'E';
    if (deg > 112.5 && deg <= 157.5) return 'SE';
    if (deg > 157.5 && deg <= 202.5) return 'S';
    if (deg > 202.5 && deg <= 247.5) return 'SW';
    if (deg > 247.5 && deg <= 292.5) return 'W';
    if (deg > 292.5 && deg <= 337.5) return 'NW';
  };

  const WindDirectionArrow = ({ degree }) => {
    const adjustedDegree = (degree + 180) % 360;
    return (
      <div style={{ transform: `rotate(${adjustedDegree}deg)`, display: 'inline-block' }}>
        <FaLongArrowAltUp size={20} />
      </div>
    );
  };

  const getRainInfo = (forecastData) => {
    const nextRainData = forecastData.filter(item => item.rain && item.rain['3h']);
    if (nextRainData.length > 0) {
      const rainInfo = nextRainData.map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        amount: item.rain['3h']
      }));
      return rainInfo.map(info => `${info.time}: ${info.amount} mm`).join(', ');
    }
    return "No se espera lluvia en las próximas horas";
  };


  const renderCurrentWeather = () => {
    if (!currentWeather || info.length === 0) return null;

    const { name, main, wind, weather, clouds } = currentWeather;
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 18;

    return (
      <div className="current-weather">
        <div className="left-section">
          <h2>{name}</h2>
          <div className="weather-icon">
            {getWeatherIcon(weather[0].id, isDay)}
          </div>
          <p className="current-temp">{main.temp.toFixed(1)}°C</p>
          <p className="feels-like">Sensación térmica: {main.feels_like.toFixed(1)}°C</p>
          <p className="current-wind">
            Viento: {(wind.speed * 3.6).toFixed(1)} km/h
            <span className="wind-direction">
              {getWindDirection(wind.deg)} <WindDirectionArrow degree={wind.deg} />
            </span>
          </p>
        </div>
        <div className="right-section">
          <p className="weather-description">{weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}</p>
          <p className="cloudiness">Nubosidad: {clouds.all}%</p>
          <p className="rain-info">Lluvia: {getRainInfo(info)}</p>
          {/* <p className="temp-range">
            Máx: {main.temp_max.toFixed(1)}°C | Mín: {main.temp_min.toFixed(1)}°C
          </p> */}
        </div>
      </div>
    );
  };

  const renderWeatherTable = () => {
    const groupedData = groupByDay(info);
    const days = Object.keys(groupedData);

    const getMaxMinTemp = (dayData) => {
      const temps = dayData.map(item => item.main.temp);
      return {
        max: Math.max(...temps).toFixed(1),
        min: Math.min(...temps).toFixed(1)
      };
    };

    const renderTempHumidityChart = (dayData) => {
      const chartData = {
        labels: dayData.map(item => formatTime(item.dt_txt)),
        datasets: [
          {
            label: 'Temperature',
            data: dayData.map(item => item.main.temp),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.4,
            pointStyle: false
          },
          {
            label: 'Humidity',
            data: dayData.map(item => item.main.humidity),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.4,
            pointStyle: false
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              afterBody: function (context) {
                const dataIndex = context[0].dataIndex;
                const feelsLike = dayData[dataIndex].main.feels_like;
                return `Feels like: ${feelsLike.toFixed(1)}°C`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
                display: false
            }
        },
          y: {
            grid: {
              display: false
          },
            min: 0,
            max: 100
          }
        }
      };

      return (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      );
    };

    const renderWindChart = (dayData) => {
      const chartData = {
        labels: dayData.map(item => formatTime(item.dt_txt)),
        datasets: [
          {
            label: 'Wind Speed',
            data: dayData.map(item => item.wind.speed * 3.6),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.4,
            pointStyle: false
          },
          {
            label: 'Wind Gust',
            data: dayData.map(item => item.wind.gust * 3.6),
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            tension: 0.4,
            pointStyle: false
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              afterBody: function (context) {
                const dataIndex = context[0].dataIndex;
                const windDirection = getWindDirection(dayData[dataIndex].wind.deg);
                return `Wind Direction: ${windDirection}`;
              },
            }
          }
        },
        scales: {
          x: {
            grid: {
                display: false
            }
        },
          y: {
            grid: {
              display: false
          },
            min: 0,
            max: 100
          }
        }
      };

      return (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      );
    };

    return (
      <div className="weather-card">
        <div className="table-container">
          <table className="weather-table">
            <thead>
              <tr>
                <th></th>
                {days.map(day => {
                  const { max, min } = getMaxMinTemp(groupedData[day]);
                  return (
                    <th key={day}>
                      <div>{new Date(day).toLocaleDateString('es-ES', { weekday: 'long', month: '2-digit', day: '2-digit' })}</div>
                      <div>
                        Max: {max}°C | Min: {min}°C
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nubosidad</td>
                {days.map(day => (
                  <td key={day}>
                    <div className="sky-conditions-container">
                      {groupedData[day].map((item, index) => (
                        <div className='sky-condition-icon' key={index}>
                          {getWeatherIcon(item.weather[0].id, true)}
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td><p className='temp'>Temperatura</p>y<p className='humidity'>Humedad</p></td>
                {days.map(day => (
                  <td key={day}>
                    {renderTempHumidityChart(groupedData[day])}
                  </td>
                ))}
              </tr>
              <tr>
                <td><p className='wind'>Viento</p>y<p className='gust'>Rachas</p></td>
                {days.map(day => (
                  <td key={day}>
                    {renderWindChart(groupedData[day])}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Dirección</td>
                {days.map(day => (
                  <td key={day}>
                    <div className="wind-direction-icons">
                      {groupedData[day].map((item, index) => (
                        <div key={index} title={getWindDirection(item.wind.deg)}>
                          <WindDirectionArrow degree={item.wind.deg} />
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  const handleSubmit = e => {
    e.preventDefault();
    setValue(e.target.city.value)
  };

  return (
    <section className="main-container">
      <h1>Easy Forecast</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="city" placeholder='Escribe la ubicación' />
        <button>Buscar</button>
      </form>
      <button onClick={locationFound}>Usar mi ubicación</button>
      {info.length !== 0 && (
        <>
          {renderCurrentWeather()}
          <h2>El tiempo en {value}, a 5 días:</h2>
          {renderWeatherTable()}
        </>
      )}
    </section>
  );
};

export default WeatherList;