import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/joy/CircularProgress';
import data from '../Icons.json';
import './Home.css';

export default function Home() {
    const icons = data;
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [location_key, setLocationKey] = useState(null);
    const [weather, setWeather] = useState(null);

    const fetchLocationKey = async (location) => {
        setLoading(!loading);
        const resLocationKey = await axios.get(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.REACT_APP_WEATHER_KEY}&q=${location.lat},${location.lon}`)
        setLocationKey(resLocationKey.data);
        setLoading(false);
    }

    const fetchWeather = async (location_key) => {
        setLoading(!loading);
        const resWeather = await axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${location_key}?apikey=${process.env.REACT_APP_WEATHER_KEY}&details=true`)
        setWeather(resWeather.data);
        setLoading(false);
    }

    const getLocation = () => {
        setLoading(!loading);
        navigator.geolocation.getCurrentPosition(position => {
            setLocation({lat:position.coords.latitude, lon:position.coords.longitude});
        });
        setLoading(false);
    }

    return (
        <>
        <h1 id='Title' className='home-title'>Weather</h1>
        <div className='main'>
        {location ? '' : <div className='location'><button className='btn get-location' onClick={getLocation}>{loading ? <><CircularProgress color="neutral" variant="soft" size="sm" /> <span>Getting Location...</span></> : 'Get Location'}</button></div>}
        {location_key ? '' : <>
        {location && <div className='location-details'>
            <h2 id='SubTitle' className='home-subtitle'>Geo Position</h2>
            <p>Latitude: {location.lat}</p>
            <p>Longitude: {location.lon}</p>
            <button className='btn get-location-details' onClick={() => fetchLocationKey(location)}>{loading ? <><CircularProgress color="neutral" variant="soft" size="sm" /> <span>Getting Location Details...</span></> : 'Get Location Details'}</button>
        </div>}
        </>}
        {weather ? '' : <>
        {location_key && <div className='location-key'>
            <h2 id='SubTitle' className='home-subtitle'>Location Details</h2>
            <p>Name: {location_key.LocalizedName}</p>
            <p>Dist: {location_key.SupplementalAdminAreas[0].LocalizedName}</p>
            <p>State: {location_key.AdministrativeArea.LocalizedName} {location_key.AdministrativeArea.ID}</p>
            <p>Country: {location_key.Country.LocalizedName} {location_key.Country.ID}</p>
            <p>TimeZone: {location_key.TimeZone.Code} {location_key.TimeZone.Name} {location_key.TimeZone.GmtOffset}</p>
            <p>Continent: {location_key.Region.LocalizedName} {location_key.Region.ID}</p>
            <button className='btn get-weather' onClick={() => fetchWeather(location_key.Key)}>{loading ? <><CircularProgress color="neutral" variant="soft" size="sm" /> <span>Getting Weather...</span></> : 'Get Weather'}</button>
        </div>}
        </>}
        {weather && <div className='location-weather'>
            <h2 id='SubTitle' className='home-subtitle'>Current Condition</h2>
            <div className='weather-icon-temp-text'>
                {icons && icons.map(item => weather[0].WeatherIcon === item.id && <img className='weather-icon' src={item.icon} alt='Weather IMG'/>)}
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
                    <p className='cloud-cover'>{weather[0].CloudCover}oktas</p>
                </div>
                <div className='weather-dew-point'>
                    <span>Dew point</span>
                    <p className='dew-point'>{weather[0].DewPoint.Metric.Value}</p>
                </div>
            </div>
            <p>PrecipitationType: {weather[0].PrecipitationType}</p>
            <p>IsDayTime: {weather[0].IsDayTime ? 'Light' : 'Night'}</p>
        </div>}
        </div>
        </>
    )
}