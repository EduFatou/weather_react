import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';


const WeatherList = () => {

  const apiKey = import.meta.env.VITE_SOME_VALUE;
  
  const [value, setValue] = useState("Seville");// Para guardar el dato a buscar
  const [info, setInfo] = useState([]); // Para guardar los posts


  // equivale a un componentDidUpdate()
  useEffect(() => {
    async function fetchData() {
      try {
        // Petición HTTP
        const res = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${value}&units=metric&appid=${apiKey}`);
        const json = res.data.list;

        // Guarda en el array de posts el resultado. Procesa los datos
        setInfo(json);
      } catch (e) {
        setInfo([]) // No pintes nada 
      }
    }

    fetchData();
  }, [value, apiKey]); // componentDidUpdate

  const renderCards = () => {
    return info.map((item, index) => (
      <WeatherCard
        dataItem={item}
        dataWeather={item.weather}
        dataTemp={item.main}
        dataWind={item.wind}
        key={uuidv4()}
      />
    ));
  };


  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.target.city.value)
    setValue(e.target.city.value) // Modificando el estado de Value
  };


  return <section className="topic">
    <h1>Forecast</h1>
    <form onSubmit={handleSubmit}>
      <input type="text" name="city" />
      <button>Search</button>
    </form>
    <h2>Weather in {value}</h2>
    <h2>Upcoming days:</h2>
    {info.length !== 0 ? renderCards() : <p>Loading...</p>}
  </section>
};

export default WeatherList;
