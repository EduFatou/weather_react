import React, { useEffect, useState } from 'react';
import WeatherCard from './WeatherCard';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';


const WeatherList = () => {

  const apiKey = import.meta.env.VITE_SOME_VALUE;

  const [value, setValue] = useState('');// Para guardar el dato a buscar
  const [info, setInfo] = useState([]); // Para guardar los posts
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

  // equivale a un componentDidUpdate()
  useEffect(() => {
    async function fetchData() {
      try {
        // Petición HTTP
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${value}&units=metric&appid=${apiKey}`);
        const json = res.data.list;

        // Guarda en el array de posts el resultado. Procesa los datos
        setInfo(json);
      } catch (e) {
        setInfo([]) // No pintes nada 
      }
    }

    fetchData();
  }, [value, apiKey]); // componentDidUpdate

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
  }, [lat, long, apiKey]);

  const renderCards = () => {
    return info.map((item, index) => (
      <WeatherCard
        dataItem={item}
        dataWeather={item.weather[0]}
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


  return <section className="main-container">
    <h1>Forecast</h1>
    <form onSubmit={handleSubmit}>
      <input type="text" name="city" />
      <button>Search</button>
    </form>
    <button onClick={locationFound}>Use My Location</button>
    <h2>Weather in {value}</h2>
    <h2>Upcoming days:</h2>
    {info.length !== 0 ? renderCards() : <p>Loading...</p>}
  </section>
};

export default WeatherList;
