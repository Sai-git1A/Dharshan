import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/joy/CircularProgress';
import data from '../Icons.json';
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const icons = data;
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState(null);
    const birthDate = new Date('2002-09-15'); 

    const calculateElapsedTime = (birthDate) => {
        const now = new Date();
        const timeDifference = now - birthDate;
      
        const years = now.getFullYear() - birthDate.getFullYear();
        const months = now.getMonth() - birthDate.getMonth();
        const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 23.56 * 7));
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 23.56));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 23.56)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      
        return { years, months, weeks, days, hours, minutes, seconds };
    };

    const [elapsedTime, setElapsedTime] = useState(calculateElapsedTime(birthDate));

    useEffect(() => {
        const intervalId = setInterval(() => {
          setElapsedTime(calculateElapsedTime(birthDate));
        }, 1000);
  
        return () => clearInterval(intervalId);
    }, [birthDate]);

    const fetchLocationKey = async (location) => {
        const resLocationKey = await axios.get(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.REACT_APP_WEATHER_KEY}&q=${location.lat},${location.lon}`)
        fetchWeather(resLocationKey.data.Key);
        setLoading(false);
    }

    const fetchWeather = async (location_key) => {
        const resWeather = await axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${location_key}?apikey=${process.env.REACT_APP_WEATHER_KEY}&details=true`)
        setWeather(resWeather.data);
    }

    const getLocation = () => {
        setLoading(!loading);
        navigator.geolocation.getCurrentPosition(position => {
            fetchLocationKey({lat:position.coords.latitude, lon:position.coords.longitude});
        });
    }

    return (
        <>
        <div className='main'>
        {loading ? <div className='circular-progress'>
        <CircularProgress variant="soft" size="lg" /> <span>Getting Weather Details...</span>
        </div> : ''}
        {loading ? '' : <>
        {weather ? '' : <button className='btn get-weather' onClick={() => getLocation()}>Get Weather</button>
        }</>}
        {weather && <div className='location-weather'>
            <h2 id='SubTitle' className='home-subtitle'>ప్రస్తుత వాతావరణం</h2>
            <div className='weather-icon-temp-text'>
                {icons && icons.map(item => weather[0].WeatherIcon === item.id && <img key={item.id} className='weather-icon' src={item.icon} alt='Weather IMG'/>)}
                <p className='temp'>{weather[0].Temperature.Metric.Value}&deg;C</p>
                <p className='status'>{weather[0].WeatherText}</p>
            </div>
            <div className='weather-details'>
                <div className='weather-real-feel'>
                    <span>Real feel</span>
                    <p className='real-feel'>{weather[0].RealFeelTemperature.Metric.Value}&deg;C</p>
                </div>
                <div className='weather-wind'>
                    <span>Wind</span>
                    <p className='wind'>{weather[0].Wind.Speed.Metric.Value}km/hr {weather[0].Wind.Direction.Degrees}&deg; {weather[0].Wind.Direction.English}</p>
                </div>
                <div className='weather-humidity'>
                    <span>Humidity</span>
                    <p className='humidity'>{weather[0].RelativeHumidity}%</p>
                </div>
                <div className='weather-pressure'>
                    <span>Pressure</span>
                    <p className='pressure'>{weather[0].Pressure.Metric.Value}mbar</p>
                </div>
                <div className='weather-visibility'>
                    <span>Visibility</span>
                    <p className='visibility'>{weather[0].Visibility.Metric.Value}km</p>
                </div>
                <div className='weather-uv-index'>
                    <span>UV Index</span>
                    <p className='uv-index'>{weather[0].UVIndex} {weather[0].UVIndexText}</p>
                </div>
                <div className='weather-cloud-cover'>
                    <span>Cloud cover</span>
                    <p className='cloud-cover'>{weather[0].CloudCover} oktas</p>
                </div>
                <div className='weather-dew-point'>
                    <span>Dew point</span>
                    <p className='dew-point'>{weather[0].DewPoint.Metric.Value}</p>
                </div>
                <div className='weather-is-day-time'>
                    <span>Light or Night</span>
                    <p className='is-day-time'>{weather[0].IsDayTime ? 'Light' : 'Night'}</p>
                </div>
            </div>
        </div>}
        <div className='గడిచిన-సమయము'>
           <h1 id='Title'>గడిచి వెళ్తున్న సమయము</h1>
           {/* <p>{elapsedTime.years} years, {elapsedTime.months} months, {elapsedTime.weeks} weeks, {elapsedTime.days} days, {elapsedTime.hours} hours, {elapsedTime.minutes} minutes, {elapsedTime.seconds} seconds</p> */}
           <div className='సమయము'>
            <div className='సంవసరాలు'>{elapsedTime.years}
            <span>సంవసరాలు</span>
            </div>
            <div className='నెలలు'>{elapsedTime.months}
            <span>నెలలు</span> 
            </div>
            <div className='వారాలు'>{elapsedTime.weeks}
            <span>వారాలు</span>
            </div>
            <div className='రోజులు'>{elapsedTime.days}
            <span>రోజులు</span>
            </div>
            <div className='గంటలు'>{elapsedTime.hours}
            <span>గంటలు</span>
            </div>
            <div className='నిమిషాలు'>{elapsedTime.minutes}
            <span>నిమిషాలు</span>
            </div>
            <div className='క్షణాలు'>{elapsedTime.seconds}
            <span>క్షణాలు</span>
            </div>
           </div>
        </div>
        </div>
        </>
    )
}