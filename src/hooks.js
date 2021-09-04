import { useState, useEffect } from 'react'
import axios from 'axios';
import { CACHE_TIMEOUT } from './config'
import { generateBasicAuth } from './utils'

const basicAuth = generateBasicAuth(process.env.REACT_APP_FOOTPRINT_API_USERNAME, process.env.REACT_APP_FOOTPRINT_API_KEY)
export const useFetchCountryData = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    caches.open('country_data').then(cache => {
      const request = new Request('http://api.footprintnetwork.org/v1/countries', {
        method: 'GET',
        headers: {
          "Authorization": `Basic ${basicAuth}`,
        }
      })
      // check if data is cached
      cache.match(request).then(response => {
        console.log(response)
        // response.json().then(json => {
        //   console.log(json)
        // })
        if (response) {
          console.log(response)
          // if cached response hasnt expired return response
        }
        axios.get('http://api.footprintnetwork.org/v1/countries', {
          headers: {
            "Authorization": `Basic ${basicAuth}`,
          }
        }).then((response) => {
          console.log(response)
        })
      })

      // cache.add(request).then(() => console.log('data cached'))
    })

  }, [])

  return { data, loading, error }
}