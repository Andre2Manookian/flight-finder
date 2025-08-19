import Constants from 'expo-constants';
import axios from 'axios';

// API key from environment variables or directly from app.config.js
const API_KEY = Constants.expoConfig?.extra?.skyScrapperApiKey || 'a573e70924msh8abdea7c4475226p1cefbfjsn24377d886104';

const BASE_URL = 'https://sky-scrapper.p.rapidapi.com';

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
};

/**
 * Search for flights based on provided parameters
 * @param {string} origin - Origin sky/airport code
 * @param {string} destination - Destination sky/airport code
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} passengers - Number of passengers
 * @returns {Promise} - Promise with flight search results
 */
export const searchFlights = async (origin, destination, date, passengers = 1) => {
  try {
    const options = {
      method: 'GET',
      url: `${BASE_URL}/api/v2/flights/searchFlights`,
      params: {
        origin,
        destination,
        date,
        adults: String(passengers),
        currency: 'USD',
        market: 'US',
        countryCode: 'US'
      },
      headers
    };
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * Get city suggestions for autocomplete (normalized shape)
 * @param {string} query - The search query for city
 * @returns {Promise<Array<{name: string, code: string, country: string}>>}
 */
export const getCitySuggestions = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    const options = {
      method: 'GET',
      url: `${BASE_URL}/api/v1/flights/searchAirport`,
      params: {
        query,
        limit: '10'
      },
      headers
    };

    const response = await axios.request(options);
    const raw = response?.data?.data || response?.data || [];

    const normalized = (Array.isArray(raw) ? raw : []).map((i) => {
      const name =
        i?.presentation?.suggestionTitle ||
        i?.presentation?.title ||
        i?.name ||
        i?.navigation?.relevantFlightParams?.skyId ||
        '';
      const code =
        i?.skyId ||
        i?.navigation?.relevantFlightParams?.skyId ||
        i?.entityId ||
        i?.uid ||
        i?.iataCode ||
        '';
      const country =
        i?.presentation?.subtitle ||
        i?.country?.name ||
        '';
      return { name, code, country };
    }).filter(x => x.name && x.code);

    return normalized;
  } catch (error) {
    console.error('Error getting city suggestions:', error?.response?.data || error.message);
    return [];
  }
};

/**
 * Get detailed information about a specific flight
 * @param {string} flightId - ID of the flight
 * @returns {Promise} - Promise with flight details
 */
export const getFlightDetails = async (flightId) => {
  try {
    const options = {
      method: 'GET',
      url: `${BASE_URL}/api/v1/flights/getFlightDetails/${flightId}`,
      headers
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error getting flight details:', error);
    throw error;
  }
};