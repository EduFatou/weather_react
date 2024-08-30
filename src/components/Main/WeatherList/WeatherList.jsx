import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WiDaySunny, WiDayCloudy, WiNightClear, WiNightCloudy, WiRain } from "react-icons/wi";
import { FaLongArrowAltUp } from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const apiKey = import.meta.env.VITE_SOME_VALUE;

const WeatherList = () => {
  const [value, setValue] = useState('');
  const [info, setInfo] = useState([]);
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
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${value}&units=metric&appid=${apiKey}`);
        const json = res.data.list;
        setInfo(json);
      } catch (e) {
        setInfo([])
      }
    }
    if (value) {
      fetchData();
    }
  }, [value]);

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=5&appid=${apiKey}`);
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

  const getWeatherIcon = (description, isDay) => {
    if (description.includes("clear")) {
      return isDay ? <WiDaySunny size={30} /> : <WiNightClear size={30} />;
    } else if (description.includes("cloud")) {
      return isDay ? <WiDayCloudy size={30} /> : <WiNightCloudy size={30} />;
    } else {
      return <WiRain size={30} />;
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
    return (
      <div style={{ transform: `rotate(${degree}deg)`, display: 'inline-block' }}>
        <FaLongArrowAltUp size={20} />
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
                    <div className="icons">
                      {groupedData[day].map((item, index) => (
                        <div key={index}>
                          {getWeatherIcon(item.weather[0].description, true)}
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
          <h2>El tiempo en {value}</h2>
          {renderWeatherTable()}
        </>
      )}
    </section>
  );
};

export default WeatherList;