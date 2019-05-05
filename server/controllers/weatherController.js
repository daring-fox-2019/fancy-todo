const axios = require("axios")

class WeatherController{
    static getWeather(req,res){
        axios.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${req.params.lat},${req.params.lon}`)
        .then(({data})=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            console.log(err.message)
            res.status(500).json({
                msg : err.message
            })
        })
    }
}

module.exports = WeatherController