import { fetchFlightData, fetchCityData } from '../api/flightApi.js';
import { fetchWeatherData } from '../api/weatherApi.js';
import { formatUTCDateTime } from '../utils/dateTime.js';
import { setCookie, getCookie } from '../utils/cookies.js';

export function initFlightSearch() {
    document.getElementById('flight_search_form').addEventListener('submit', handleFlightSearch);

    // Check for existing cookie on page load
    const savedFlight = getCookie('flight_number');
    if (savedFlight) {
        document.querySelector('#search_input').value = savedFlight;
        searchFlight(savedFlight);
    }
}

export async function searchFlight(flightNumber) {
    try {
        const flightData = await fetchFlightData(flightNumber);
        console.log('Raw API response:', flightData); // Log the entire API response

        if (flightData && flightData.data && flightData.data.length > 0) {
            console.log('Flight data found:', flightData.data[0]); // Log the first flight data object
            const processedData = await processFlightData(flightData.data[0]);
            console.log('Processed data:', processedData); // Log the processed data
            updateUI(processedData);
            setCookie('flight_number', flightNumber, 7);
            hideError();
        } else {
            console.log('No flight data found in the API response');
            showError(`No data found for flight ${flightNumber}. Please check the flight number and try again.`);
        }
    } catch (error) {
        console.error('Error in searchFlight:', error);
        if (error.response) {
            console.log('Error response:', error.response);
            console.log('Error response data:', error.response.data);
            console.log('Error response status:', error.response.status);
            console.log('Error response headers:', error.response.headers);
        }
        if (error.message.includes('Network Error')) {
            showError("Network error. Please check your internet connection and try again.");
        } else if (error.response && error.response.status === 404) {
            showError(`Flight ${flightNumber} not found. Please check the flight number and try again.`);
        } else if (error.response && error.response.status === 429) {
            showError("Too many requests. Please try again later.");
        } else {
            showError(`An error occurred while fetching flight data: ${error.message}`);
        }
    }
}

async function handleFlightSearch(event) {
    event.preventDefault();
    const flightNumber = document.querySelector('#search_input').value;
    await searchFlight(flightNumber);
}

async function processFlightData(flightData) {
    const processedData = {
        flightNumber: flightData.flight?.iata || 'N/A',
        departureAirport: flightData.departure?.iata || 'N/A',
        arrivalAirport: flightData.arrival?.iata || 'N/A',
        departureCity: await getCityName(flightData.departure?.iata),
        arrivalCity: await getCityName(flightData.arrival?.iata),
        departureTime: flightData.departure?.scheduled ? formatUTCDateTime(flightData.departure.scheduled) : { formattedDate: 'N/A', formattedTime: 'N/A' },
        arrivalTime: flightData.arrival?.scheduled ? formatUTCDateTime(flightData.arrival.scheduled) : { formattedDate: 'N/A', formattedTime: 'N/A' },
        status: flightData.flight_status || 'N/A',
        departureTerminal: flightData.departure?.terminal || '-',
        arrivalTerminal: flightData.arrival?.terminal || '-',
        departureGate: flightData.departure?.gate || '-',
        arrivalGate: flightData.arrival?.gate || '-',
        departureWeather: null,
        arrivalWeather: null
    };

    // Fetch departure weather data
    if (processedData.departureCity) {
        try {
            processedData.departureWeather = await fetchWeatherData(processedData.departureCity);
            console.log('Departure weather fetched:', processedData.departureWeather);
        } catch (error) {
            console.error('Error fetching departure weather:', error);
            processedData.departureWeather = null;
        }
    } else {
        console.log('No departure city available for weather fetch');
    }

    // Fetch arrival weather data
    if (processedData.arrivalCity) {
        try {
            processedData.arrivalWeather = await fetchWeatherData(processedData.arrivalCity);
            console.log('Arrival weather fetched:', processedData.arrivalWeather);
        } catch (error) {
            console.error('Error fetching arrival weather:', error);
            processedData.arrivalWeather = null;
        }
    } else {
        console.log('No arrival city available for weather fetch');
    }

    console.log('Processed flight data:', processedData);
    return processedData;
}

async function getCityName(iataCode) {
    const cityData = await fetchCityData(iataCode);
    return cityData ? cityData.city_name : iataCode;
}

function updateUI(data) {
    // Update flight information
    document.getElementById('flight_num').textContent = data.flightNumber;
    document.getElementById('dept_date').textContent = data.departureTime.formattedDate;
    document.getElementById('arr_date').textContent = data.arrivalTime.formattedDate;
    document.getElementById('dept_city').textContent = data.departureCity;
    document.getElementById('arr_city').textContent = data.arrivalCity;
    document.getElementById('dept_airport').textContent = data.departureAirport;
    document.getElementById('arr_airport').textContent = data.arrivalAirport;
    document.getElementById('dept_time').textContent = data.departureTime.formattedTime;
    document.getElementById('arr_time').textContent = data.arrivalTime.formattedTime;
    document.getElementById('live_status').textContent = data.status;
    document.getElementById('dept_terminal').textContent = data.departureTerminal;
    document.getElementById('arr_terminal').textContent = data.arrivalTerminal;
    document.getElementById('dept_gate').textContent = data.departureGate;
    document.getElementById('arr_gate').textContent = data.arrivalGate;

    // Update departure weather information
    const deptTemp = document.getElementById('dept_temperature');
    const deptHumidity = document.getElementById('dept_humidity');
    const deptWindspeed = document.getElementById('dept_windspeed');

    if (data.departureWeather) {
        deptTemp.textContent = Math.round(data.departureWeather.main.temp);
        deptHumidity.textContent = data.departureWeather.main.humidity;
        deptWindspeed.textContent = data.departureWeather.wind.speed;
    } else {
        deptTemp.textContent = '-';
        deptHumidity.textContent = '-';
        deptWindspeed.textContent = '-';
    }

    // Update arrival weather information
    const arrTemp = document.getElementById('arr_temperature');
    const arrHumidity = document.getElementById('arr_humidity');
    const arrWindspeed = document.getElementById('arr_windspeed');

    if (data.arrivalWeather) {
        arrTemp.textContent = Math.round(data.arrivalWeather.main.temp);
        arrHumidity.textContent = data.arrivalWeather.main.humidity;
        arrWindspeed.textContent = data.arrivalWeather.wind.speed;
    } else {
        arrTemp.textContent = '-';
        arrHumidity.textContent = '-';
        arrWindspeed.textContent = '-';
    }
}

function showError(message) {
    let element = document.querySelector("#feed_back_message");
    element.innerHTML = message;
    element.setAttribute("class", "alert alert-danger custom-alert");
    element.style.display = "flex";
}

function hideError() {
    let element = document.querySelector("#feed_back_message");
    element.style.display = "none";
}
