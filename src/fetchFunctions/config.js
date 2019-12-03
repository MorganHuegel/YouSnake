//Should use .env here, but I would have to figure out how to
// use built-in Node modules first, like fs and path, which react-native
// doesn't support??
//const { SERVER_BASE_URL } = require('react-native-dotenv')

// const SERVER_BASE_URL = 'https://owen-wilsnake-server.herokuapp.com'
// const SERVER_BASE_URL = 'http://192.168.0.4:8080'
const SERVER_BASE_URL = 'http://localhost:8080'

module.exports = {
  SERVER_BASE_URL: SERVER_BASE_URL || 'http://192.168.0.4:8080'
}
