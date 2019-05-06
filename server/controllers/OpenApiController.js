const axios = require('axios')

const AX_BORED_API = axios.create({
    baseURL: 'http://www.boredapi.com/api',
})

class OpenApiController {
    static generateRandomActivity(req, res) {
        AX_BORED_API
        .get('/activity')
        .then(({data}) => {
            res.status(200).json(data.activity)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = OpenApiController
