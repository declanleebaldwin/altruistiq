import { useState, useEffect } from 'react'
export const useFetchCountryData = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  return { data, loading, error }
}