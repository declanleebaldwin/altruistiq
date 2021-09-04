import { useState, useEffect } from 'react'
import axios from 'axios';
import { CACHE_TIMEOUT } from './config'
import { generateBasicAuth } from './utils'

const basicAuth = generateBasicAuth(process.env.REACT_APP_FOOTPRINT_API_USERNAME, process.env.REACT_APP_FOOTPRINT_API_KEY)
const countriesEndpoint = 'http://api.footprintnetwork.org/v1/countries'


const isDateExpired = (date) => {
  const currentDateMs = new Date().getTime()
  return date.getTime() < currentDateMs;
}

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
    console.log('fetch using cache', cacheResponse)
    // if cached response hasnt expired return response
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

  console.log('fetch using api')
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
  await cache.put(request, responseWithExpiry)
  return apiReponse.data;
}

export const useFetchCountryData = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const handleFetchingData = async () => {
      const countriesArray = await tryFetchFromCache(countriesEndpoint);
      console.log('countriesArray', countriesArray)

      const carbonArray = await Promise.all(countriesArray.map(country => {
        const carbonEndpoint = `https://api.footprintnetwork.org/v1/data/${country.countryCode}/all/EFCpc`
        return tryFetchFromCache(carbonEndpoint)
      }))
      console.log('carbonArray', carbonArray[0])
    }

    handleFetchingData()
    // caches.open('country_data').then(cache => {

    //   // check if data is cached
    //   cache.match(request).then(response => {
    //     if (response) {
    //       console.log('fetch using cache', response)
    //       // if cached response hasnt expired return response
    //       const cacheExpiry = response.headers.get('Cache-Expires')
    //       console.log(cacheExpiry)
    //       return;
    //     }
    //     console.log('fetch using api')
    //     axios.get('http://api.footprintnetwork.org/v1/countries', {
    //       headers: {
    //         "Authorization": `Basic ${basicAuth}`,
    //       }
    //     }).then((response) => {
    //       // Compute expires date from caching duration
    //       console.log(response)
    //       const expires = new Date();
    //       expires.setSeconds(
    //         expires.getSeconds() + CACHE_TIMEOUT,
    //       );
    //       const responseWithExpiry = new Response(response.data, {
    //         status: response.status,
    //         statusText: response.statusText,
    //         headers: {
    //           "Authorization": `Basic ${basicAuth}`,
    //           'Cache-Expires': expires.toUTCString()
    //         }
    //       })
    //       cache.put(request, responseWithExpiry).then(() => {
    //         console.log('cached with expiry')
    //       })
    //     })
    //   })
    // })
  }, [])

  return { data, loading, error }
}