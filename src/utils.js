export const generateBasicAuth = (username, password) => btoa(`${username}:${password}`)