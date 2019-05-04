const { OAuth2Client } = require('google-auth-library')

module.exports = {
  google(token) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const client = new OAuth2Client(clientId)

    return client.verifyIdToken({
      idToken: token,
      audience: clientId
    })
  }
}