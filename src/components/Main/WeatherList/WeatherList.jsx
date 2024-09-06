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
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import clearDay from '../../../assets/clearDay.jpg';
import clearNight from '../../../assets/clearNight.jpg';
import clearSunset from '../../../assets/clearSunset.jpg';
import rainyDay from '../../../assets/RainyDay2.jpg';
import rainyNight from '../../../assets/rainyNight.jpg';
import someCloudsDay from '../../../assets/someCloudsDay.jpg';
import cloudyNight from '../../../assets/cloudyNight.jpg';
import stormDay from '../../../assets/stormDay.jpg';
import littleClouds from '../../../assets/littleClouds.jpg';
import thunderstorm from '../../../assets/thunderstorm.jpg';
import lightRain from '../../../assets/lightRain.jpg';
import someMoreClouds from '../../../assets/someMoreClouds.jpg';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const apiKey = import.meta.env.VITE_SOME_VALUE;

const WeatherList = () => {
  const [value, setValue] = useState('Madrid');
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
        updateBackground(currentRes.data);
      } catch (e) {
        setInfo([]);
        setCurrentWeather(null);
        document.body.style.backgroundImage = '';
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

  const updateBackground = (currentWeather) => {
    const currentTime = new Date();
    const sunriseTime = new Date(currentWeather.sys.sunrise * 1000);
    const sunsetTime = new Date(currentWeather.sys.sunset * 1000);
    const isDay = currentTime >= sunriseTime && currentTime < sunsetTime;
    const weatherId = currentWeather.weather[0].id;
    console.log(weatherId)
    console.log(sunsetTime)
    const isSunset = Math.abs(currentTime - sunsetTime) < 60 * 60 * 1000;
    console.log(isSunset)
    let newBackground = clearDay;

    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      newBackground = thunderstorm;
    }
    // Drizzle and Light Rain
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId <= 504)) {
      newBackground = isDay ? lightRain : rainyNight;
    }
    // Heavy Rain
    else if (weatherId >= 505 && weatherId < 600) {
      newBackground = isDay ? rainyDay : rainyNight;
    }
    // Snow - keep existing logic
    else if (weatherId >= 600 && weatherId < 700) {
      newBackground = isDay ? someCloudsDay : cloudyNight;
    }
    // Atmosphere conditions (fog, mist, etc.)
    else if (weatherId >= 700 && weatherId < 800) {
      newBackground = someMoreClouds;
    }
    // Clear sky
    else if (weatherId === 800) {
      if (isSunset) {
        newBackground = clearSunset;
      } else {
        newBackground = isDay ? clearDay : clearNight;
      }
    }
    // Few clouds
    else if (weatherId === 801) {
      newBackground = littleClouds;
    }
    // Scattered clouds
    else if (weatherId === 802) {
      newBackground = someCloudsDay;
    }
    // Broken or overcast clouds
    else if (weatherId >= 803) {
      newBackground = isDay ? stormDay : cloudyNight;
    }

    document.body.style.backgroundImage = `url(${newBackground})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  };
  
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
    return date.toLocaleTimeString('es-ES', { hour: '2-digit' });
  };

  const getWindDirection = (deg) => {
    if (deg > 337.5 || deg <= 22.5) return 'N';
    if (deg > 22.5 && deg <= 67.5) return 'NE';
    if (deg > 67.5 && deg <= 112.5) return 'E';
    if (deg > 112.5 && deg <= 157.5) return 'SE';
    if (deg > 157.5 && deg <= 202.5) return 'S';
    if (deg > 202.5 && deg <= 247.5) return 'SO';
    if (deg > 247.5 && deg <= 292.5) return 'O';
    if (deg > 292.5 && deg <= 337.5) return 'NO';
  };

  const WindDirectionArrow = ({ degree }) => {
    const adjustedDegree = (degree + 180) % 360;
    return (
      <div style={{ transform: `rotate(${adjustedDegree}deg)`, display: 'inline-block' }}>
        <FaLongArrowAltUp size={22} />
      </div>
    );
  };

  const getRainInfo = (forecastData) => {
    const nextRainData = forecastData.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('es-ES', { hour: '2-digit' }),
      amount: item.rain && item.rain['3h'] ? item.rain['3h'] : 0
    }));

    return nextRainData;
  };

  const renderRainChart = (rainData) => {
    const hasRain = rainData.some(item => item.amount > 0);

    if (!hasRain) {
      return (
        <div className="no-rain-message">
          No se espera lluvia en las próximas horas.
        </div>
      );
    }
    const chartData = {
      labels: rainData.map(item => item.time),
      datasets: [
        {
          label: 'Precipitación (mm)',
          data: rainData.map(item => item.amount),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1,
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
        title: {
          display: true,
          text: 'Lluvia (mm) en las próximas horas',
          color: "white",
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'white'
          },
          border: {
            color: 'white'
          }
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'white'
          },
          border: {
            display: false
          }
        }
      },
    };

    return (
      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>
    );
  };

  const renderCurrentWeather = () => {
    if (!currentWeather || info.length === 0) return null;

    const { main, wind, weather, clouds } = currentWeather;
    const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;
    const rainData = getRainInfo(info);

    return (
      <div className="current-weather">
        <div className="left-section">
          <h2>{value.charAt(0).toUpperCase()+ value.slice(1)}</h2>
          <div className="weather-icon">
            {getWeatherIcon(weather[0].id, isDay)}
          </div>
          <p className="current-temp">{Math.round(main.temp)}°C</p>
          <p className="feels-like">Sensación térmica: {Math.round(main.feels_like)}°</p>
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
          <div className="rain-info">
            {renderRainChart(rainData)}
          </div>
        </div>
      </div>
    );
  };
  const renderWeatherTable = () => {
    const groupedData = groupByDay(info);
    const days = Object.keys(groupedData);
    const validDays = days.filter(day => groupedData[day].length > 1);

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
          // {
          //   label: 'Humidity',
          //   data: dayData.map(item => item.main.humidity),
          //   borderColor: 'rgb(53, 162, 235)',
          //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
          //   tension: 0.4,
          //   pointStyle: false
          // },
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
            intersect: false,
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
              display: false,
            },
            ticks: {
              color: 'white'
            },
            border: {
              color: 'white'
            }
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: 'white',
              precision: 0
            },
            border: {
              display: false
            }
          }
        }
      };

      return (
        <div className="forecast-chart-container">
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
            intersect: false,
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
              display: false,
            },
            ticks: {
              color: 'white'
            },
            border: {
              color: 'white'
            }
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: 'white',
              precision: 0,
              stepSize: 10
            },
            border: {
              display: false
            },
            min: 0,
            max:50
          }
        }
      };

      return (
        <div className="forecast-chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      );
    };

    return (
      <div className="weather-card">
        <div className="table-container">
          {validDays.map(day => {
            const { max, min } = getMaxMinTemp(groupedData[day]);
            return (
              <div key={day} className="table-column">
                <div className="column-header">
                  <div>{new Date(day).toLocaleDateString('es-ES', { weekday: 'long', month: '2-digit', day: '2-digit' })}</div>
                  <div>
                    Max: {Math.round(max)}° | Min: {Math.round(min)}°
                  </div>
                </div>
                <div className="sky-conditions-container">
                  {groupedData[day].map((item, index) => (
                    <div className='sky-condition-icon' key={index}>
                      <div className="icon-hour">{formatTime(item.dt_txt)}</div>
                      {getWeatherIcon(item.weather[0].id, true)}
                      <div className="icon-temp">{Math.round(item.main.temp)}°</div>
                    </div>
                  ))}
                </div>
                <div className="forecast-chart-container">
                  {renderTempHumidityChart(groupedData[day])}
                </div>
                <div className="forecast-chart-container">
                  {renderWindChart(groupedData[day])}
                </div>
                <div className="wind-direction-icons">
                  {groupedData[day].map((item, index) => (
                    <div key={index} title={getWindDirection(item.wind.deg)}>
                      <WindDirectionArrow degree={item.wind.deg} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
      <h1 className='title'>Easy Forecast</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="city" placeholder='Escribe la ubicación' />
        <button>Buscar</button>
      </form>
      <button onClick={locationFound}>Usar mi ubicación</button>
      {info.length !== 0 && (
        <>
          {renderCurrentWeather()}
          <h2 className='forecast-title'>El tiempo en {value}, a 5 días:</h2>
          {renderWeatherTable()}
        </>
      )}
    </section>
  );
};

export default WeatherList;