import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { WiDaySunny, WiDayCloudy, WiNightClear, WiNightCloudy, WiRain } from "react-icons/wi";
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

    const renderCharts = (dayData) => {
      const tempHumidityChartData = {
        labels: dayData.map(item => formatTime(item.dt_txt)),
        datasets: [
          {
            label: 'Temperature',
            data: dayData.map(item => item.main.temp),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Humidity',
            data: dayData.map(item => item.main.humidity),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };

      const windChartData = {
        labels: dayData.map(item => formatTime(item.dt_txt)),
        datasets: [
          {
            label: 'Wind Speed',
            data: dayData.map(item => item.wind.speed),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: 'Wind Gust',
            data: dayData.map(item => item.wind.gust),
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
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
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };

      return (
        <>
          <div className="chart-container" style={{height: '200px'}}>
            <Line data={tempHumidityChartData} options={chartOptions} />
          </div>
          <div className="chart-container" style={{height: '200px'}}>
            <Line data={windChartData} options={chartOptions} />
          </div>
        </>
      );
    };

    return (
      <div className="">
        <table className="weather-card">
          <thead>
            <tr>
              <th className=""></th>
              {days.map(day => {
                const { max, min } = getMaxMinTemp(groupedData[day]);
                return (
                  <th key={day} className="">
                    <div className="">{new Date(day).toLocaleDateString('es-ES', { weekday: 'long', month: '2-digit', day: '2-digit' })}</div>
                    <div className="">
                      Max: {max}°C | Min: {min}°C
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="">Sky Condition</td>
              {days.map(day => (
                <td key={day} className="">
                  <div className="">
                    {groupedData[day].map((item, index) => (
                      <div key={index} className="">
                        {getWeatherIcon(item.weather[0].description, true)}
                        <div className="">{formatTime(item.dt_txt)}</div>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="">Temp/Humidity</td>
              {days.map(day => (
                <td key={day} className="">
                  {renderCharts(groupedData[day])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValue(e.target.city.value)
  };

  return (
    <section className="main-container">
      <form onSubmit={handleSubmit} className="">
        <input type="text" name="city" className="" />
        <button className="">Search</button>
      </form>
      <button onClick={locationFound} className="">Use My Location</button>
      <h2 className="">Weather in {value}</h2>
      <div className="">
        {info.length !== 0 ? renderWeatherTable() : <p>Loading...</p>}
      </div>
    </section>
  );
};

export default WeatherList;