import { SERVER_BASE_URL } from './config'

export function changeAvatar (webToken, avatar) {
  return fetch(`${SERVER_BASE_URL}/users/avatar`, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': webToken
    },
    body: JSON.stringify({avatar})
  })
  .then(res => res.json())
  .then(response => {
    if (response.updatedUser) {
      return Promise.resolve(response.updatedUser)
    } else {
      return Promise.reject(response.error)
    }
  })
  .catch(errMessage => {
    return Promise.reject(errMessage)
  })
}