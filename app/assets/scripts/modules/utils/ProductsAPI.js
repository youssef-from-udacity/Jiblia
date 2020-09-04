import ko, { observable, observableArray, computed } from 'knockout';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:8000'

let token = localStorage.token

const headers = {
  'Accept': 'application/json',
  'Authorization': `Bearer ${token}`
}

export const setToken = () => {
  token = localStorage.token
  headers.Authorization = `Bearer ${token}`
}


export const getAll = (link) =>
  fetch(`${api}/${link}`, { headers })

export const login = (body) =>
  fetch(`${api}/auth/login`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)

  })

export const purchase = (body) =>
  fetch(`${api}/auth/purchase`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

export const register = (body) =>
  fetch(`${api}/auth/register`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

export const reset = (body) =>
  fetch(`${api}/auth/reset`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

export const updateProfile = (link, body) =>
  fetch(`${api}/${link}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)

  })

