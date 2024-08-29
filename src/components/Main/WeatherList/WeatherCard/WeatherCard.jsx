// import React from "react";
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { WiDaySunny, WiDayCloudy, WiNightClear, WiNightCloudy, WiRain } from "react-icons/wi";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const WeatherCard = ({ data }) => {
//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
//   };

//   const getWindDirection = (deg) => {
//     if (deg > 337.5 || deg <= 22.5) return 'N';
//     if (deg > 22.5 && deg <= 67.5) return 'NE';
//     if (deg > 67.5 && deg <= 112.5) return 'E';
//     if (deg > 112.5 && deg <= 157.5) return 'SE';
//     if (deg > 157.5 && deg <= 202.5) return 'S';
//     if (deg > 202.5 && deg <= 247.5) return 'SW';
//     if (deg > 247.5 && deg <= 292.5) return 'W';
//     if (deg > 292.5 && deg <= 337.5) return 'NW';
//   };

//   const getWeatherIcon = (description, isDay) => {
//     if (description.includes("clear")) {
//       return isDay ? <WiDaySunny size={30} /> : <WiNightClear size={30} />;
//     } else if (description.includes("cloud")) {
//       return isDay ? <WiDayCloudy size={30} /> : <WiNightCloudy size={30} />;
//     } else {
//       return <WiRain size={30} />;
//     }
//   };

//   const tempHumidityChartData = {
//     labels: data.map(item => formatTime(item.dt_txt)),
//     datasets: [
//       {
//         label: 'Temperature',
//         data: data.map(item => item.main.temp),
//         borderColor: 'rgb(255, 99, 132)',
//         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//       },
//       {
//         label: 'Humidity',
//         data: data.map(item => item.main.humidity),
//         borderColor: 'rgb(53, 162, 235)',
//         backgroundColor: 'rgba(53, 162, 235, 0.5)',
//       },
//     ],
//   };

//   const windChartData = {
//     labels: data.map(item => formatTime(item.dt_txt)),
//     datasets: [
//       {
//         label: 'Wind Speed',
//         data: data.map(item => item.wind.speed),
//         borderColor: 'rgb(75, 192, 192)',
//         backgroundColor: 'rgba(75, 192, 192, 0.5)',
//       },
//       {
//         label: 'Wind Gust',
//         data: data.map(item => item.wind.gust),
//         borderColor: 'rgb(255, 159, 64)',
//         backgroundColor: 'rgba(255, 159, 64, 0.5)',
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           afterBody: function(context) {
//             const dataIndex = context[0].dataIndex;
//             const feelsLike = data[dataIndex].main.feels_like;
//             const windDirection = getWindDirection(data[dataIndex].wind.deg);
//             return `Feels like: ${feelsLike.toFixed(1)}°C\nWind Direction: ${windDirection}`;
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   };

//   return (
//     <div className="weather-card">
//       <h3>{new Date(data[0].dt_txt).toLocaleDateString('es-ES', { weekday: 'long', month: '2-digit', day: '2-digit' })}</h3>
      
//       <div className="weather-icons">
//         {data.map((item, index) => (
//           <img key={index} src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} />
//         ))}
//       </div>

//       <div className="chart-container">
//         <Line data={tempHumidityChartData} options={chartOptions} />
//       </div>

//       <div className="sky-condition">
//         {getWeatherIcon(data[0].weather[0].description, true)}
//         {getWeatherIcon(data[Math.floor(data.length / 2)].weather[0].description, true)}
//         {getWeatherIcon(data[data.length - 1].weather[0].description, false)}
//       </div>

//       <div className="chart-container">
//         <Line data={windChartData} options={chartOptions} />
//       </div>
//     </div>
//   );
// };

// export default WeatherCard;