import React from "react";

const WeatherCard = ({
  dataItem: {
    dt_txt
  },
  dataWeather: {
    main,
    description
  },
  dataTemp: {
    temp,
    temp_min,
    temp_max
  },
  dataWind: {
    speed,
    deg
  }

}) => {
  return <article>
    <div>
    <h3>{dt_txt}</h3>
    <p>
      Average: {Math.round(temp)} Cº
    </p>
    <p>
      Max. {Math.round(temp_max)} Cº
    </p>
    <p>
      Min. {Math.round(temp_min)} Cº
    </p>
  </div>
  <div>
    <p>
      General: {main}
    </p>
    <p>
      Description: {description}
    </p>
  </div>
  <div>
    <p>
      Wind Speed: {Math.round(speed)} Km/h
    </p>
    <p>
      Wind Direction: {deg} º
    </p>
  </div>
  </article>
};

export default WeatherCard;
