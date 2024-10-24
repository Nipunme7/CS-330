const API_KEY = 'cfdd9f200c9923cea7062e8b331d0016';

export async function fetchFlightData(flightNumber) {
    const url = `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightNumber}`;
    console.log('Fetching flight data from:', url);
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function fetchCityData(iata) {
    const url = `https://api.aviationstack.com/v1/cities?access_key=${API_KEY}&search=${iata}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.data.filter(city => city.iata_code === iata)[0];
}
