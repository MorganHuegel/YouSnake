import { SERVER_BASE_URL } from './config'

export function fetchLoginJwt (webToken) {
  return fetch(`${SERVER_BASE_URL}/users/jwt`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': webToken
    }
  })
  .then(res => res.json())
  .then(response => {
    if (response.valid) {
      return Promise.resolve(response.user)
    } else {
      return Promise.reject('JWT not valid')
    }
  })
  .catch(error => {
    return Promise.reject(error)
  })
}