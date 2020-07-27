import ko, { observable, observableArray, computed } from 'knockout';

const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3000'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export var productsCash = observableArray()

export const getAll = (url) =>
  fetch(`${api + url}`, { headers })
    .then(res => res.json())
    .then(data => data)

export const login = (body) =>
  fetch(`${api}/login`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())