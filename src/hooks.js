import { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { CACHE_TIMEOUT } from './config'
import { generateBasicAuth, isDateExpired } from './utils'

const basicAuth = generateBasicAuth(process.env.REACT_APP_FOOTPRINT_API_USERNAME, process.env.REACT_APP_FOOTPRINT_API_KEY)
const countriesEndpoint = 'http://api.footprintnetwork.org/v1/countries'

const tryFetchFromCache = async (url) => {
  const request = new Request(url, {
    method: 'GET',
    headers: {
      "Authorization": `Basic ${basicAuth}`,
    }
  })
  const cache = await caches.open('country_data');
  const cacheResponse = await cache.match(request)
  if (cacheResponse) {
    console.log('fetch using cache')
    // if cached response hasnt expired return response;
    const cacheExpiry = cacheResponse.headers.get('Cache-Expires')
    const cacheExpiryDate = new Date(cacheExpiry)
    if (!isDateExpired(cacheExpiryDate)) {
      // fetch from api
      const json = await cacheResponse.json()
      return json
    }
    console.log('date expired, fetch from api')
  }
  // fetch from api
  // create new response with expiry date
  const apiReponse = await axios.get(url, {
    headers: {
      "Authorization": `Basic ${basicAuth}`,
    }
  })
  const expires = new Date();
  expires.setSeconds(
    expires.getSeconds() + CACHE_TIMEOUT,
  );
  const blob = new Blob([JSON.stringify(apiReponse.data, null, 2)], { type: 'application/json' });
  const responseWithExpiry = new Response(blob, {
    status: apiReponse.status,
    statusText: apiReponse.statusText,
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      'Cache-Expires': expires.toUTCString()
    }
  })

  // save request and response to cache
  await cache.put(request, responseWithExpiry)
  return apiReponse.data;
}

export const useFetchCountryData = () => {
  const [data, setData] = useState()

  useEffect(() => {
    const handleFetchingData = async () => {
      try {
        const countriesArray = await tryFetchFromCache(countriesEndpoint);
        const filteredCountriesArray = countriesArray.filter((country => parseInt(country.countryCode) < 1000))
        const values = await Promise.allSettled(filteredCountriesArray.map(country => {
          const carbonEndpoint = `https://api.footprintnetwork.org/v1/data/${country.countryCode}/all/EFCpc`
          return tryFetchFromCache(carbonEndpoint)
        }))
        const carbonArray = values.map((item => item.value))
        setData(carbonArray)
      } catch (e) {
        console.error(e)
      }

    }

    handleFetchingData()
  }, [])

  return data;
}

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}