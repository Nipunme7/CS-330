const WEATHER_API_KEY = '53acbccdccbb46dcbdd65d17a45a988e';

export async function fetchWeatherData(cityName) {
    if (!cityName) {
        console.error('City name is undefined or null');
        return null;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}`;
    console.log('Fetching weather data from:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Weather data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
