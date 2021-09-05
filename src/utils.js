export const generateBasicAuth = (username, password) => btoa(`${username}:${password}`)

export const isDateExpired = (date) => {
  const currentDateMs = new Date().getTime()
  return date.getTime() < currentDateMs;
}