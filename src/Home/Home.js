import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

export default function Home() {
    const [location, setLocation] = useState(null);
    const [location_key, setLocationKey] = useState(null);
    const [weather, setWeather] = useState(null);

    const fetchLocationKey = async (location) => {
        const resLocationKey = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.WEATHER_KEY}&q=${location.lat},${location.lon}`)
        setLocationKey(resLocationKey.data);
    }

    const fetchWeather = async (location_key) => {
        const resWeather = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${location_key}?apikey=${process.env.WEATHER_KEY}&details=true`)
        setWeather(resWeather.data);
        console.log(resWeather.data[0]);
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setLocation({lat:position.coords.latitude, lon:position.coords.longitude});
        });
    }, []);

    return (
        <>
        <h1 id='Title' className='home-title'>Weather</h1>
        <div className='main'>
        {location && <div className='location'>
            <h2 id='SubTitle' className='home-subtitle'>Geo Position</h2>
            <p>Latitude: {location.lat}</p>
            <p>Longitude: {location.lon}</p>
            <button className='btn get-location' onClick={() => fetchLocationKey(location)}>Get Location</button>
        </div>}
        {location_key && <div className='location-key'>
            <h2 id='SubTitle' className='home-subtitle'>Location Details</h2>
            <p>Key: {location_key.Key}</p>
            <p>LocalizedName: {location_key.LocalizedName}</p>
            <p>AdministrativeArea: {location_key.AdministrativeArea.LocalizedName}</p>
            <p>Country: {location_key.Country.LocalizedName}</p>
            <p>TimeZone: {location_key.TimeZone.Code}</p>
            <button className='btn get-weather' onClick={() => fetchWeather(location_key.Key)}>Get Weather</button>
        </div>}
        {weather && <div className='location-weather'>
            <h2 id='SubTitle' className='home-subtitle'>Current Condition</h2>
            <p>WeatherIcon: {weather[0].WeatherIcon}</p>
            <p>WeatherText: {weather[0].WeatherText}</p>
            <p>Temperature: {weather[0].Temperature.Metric.Value} C</p>
            <p>Wind: {weather[0].Wind.Speed.Metric.Value} km/h</p>
            <p>Pressure: {weather[0].Pressure.Metric.Value} mb</p>
            <p>Humidity: {weather[0].RelativeHumidity} %</p>
            <p>Visibility: {weather[0].Visibility.Metric.Value}</p>
            <p>CloudCover: {weather[0].CloudCover}</p>
            <p>UVIndex: {weather[0].UVIndex}</p>
            <p>UVIndexText: {weather[0].UVIndexText}</p>
            <p>WindGust: {weather[0].WindGust.Speed.Metric.Value} km/h</p>
            <p>WindDirection: {weather[0].Wind.Direction.Degrees} {weather[0].Wind.Direction.English}</p>
            <p>RealFeelTemperature: {weather[0].RealFeelTemperature.Metric.Value}</p>
            <p>PrecipitationType: {weather[0].PrecipitationType}</p>
            <p>DewPoint: {weather[0].DewPoint.Metric.Value}</p>
            <p>IsDayTime: {weather[0].IsDayTime ? 'Light' : 'Night'}</p>
        </div>}
        </div>
        </>
    )
}