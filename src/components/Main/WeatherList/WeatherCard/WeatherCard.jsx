import React from "react";

const WeatherCard = ({
  dataItem: {
    dt_txt,
    visibility
  },
  dataWeather: {
    description,
    icon
  },
  dataTemp: {
    temp,
    feels_like,
    humidity
  },
  dataWind: {
    speed,
    deg,
    gust
  }

}) => {
  const img_url = `http://openweathermap.org/img/wn/${icon}@2x.png`;
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
  
  return <article className="article-container">
    <div>
      <h3>{dt_txt}</h3>
      <img src={img_url} alt={description} />
      <p>
        Temp: {Math.round(temp)} ºC
      </p>
      <p>
        Feels like: {Math.round(feels_like)} ºC
      </p>
      <p>
        Humidity {Math.round(humidity)} %
      </p>
    </div>
    <div>
      <p>
        Sky: {description}
      </p>
      <p>
        Visibility: {visibility/1000} km
      </p>
    </div>
    <div>
      <p>
        Wind Speed: {Math.round(speed)} Km/h
      </p>
      <p>
        Wind Direction: {getWindDirection(deg)}
      </p>
      <p>
        Gusts: {Math.round(gust)} Km/h
      </p>
    </div>
  </article>
};

export default WeatherCard;
