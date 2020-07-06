const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3000'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getAll = () =>
  fetch(`${api}/products`, { headers })
    .then(res => res.json())
    .then(data => data)
