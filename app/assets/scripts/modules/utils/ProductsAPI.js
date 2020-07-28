import ko, { observable, observableArray, computed } from 'knockout';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:8000'
const api2 = 'http://localhost:8000'

let token = localStorage.token


const headers = {
  'Accept': 'application/json',
  'Authorization': `Bearer ${token}`
}

export var productsCash = observableArray()

export const getAll = () =>
  fetch(`${api}/products`, { headers })
    .then(res => res.json())
    .then(data => data)

export const login = (body) =>
  fetch(`${api2}/auth/login`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)

  })

