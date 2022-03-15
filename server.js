import https from "https";
import express from "express";
import "dotenv/config";

const app = express();
const port = 3000;
const apiKey = process.env.WEATHER_KEY;
const endPoint = "https://api.openweathermap.org/data/2.5/weather?";
const paramKeys = ["q", "units", "lang", "mode"];

function createCall(params) {
  var call = endPoint;
  for (var i = 0; i < params.length; i++) {
    call +=
      i == 0
        ? paramKeys[i] + "=" + params[i]
        : "&" + paramKeys[i] + "=" + params[i];
  }
  call += "&appid=" + apiKey;
  return call;
}

app.get("/", (req, res) => {
  var r 
  https.get(createCall(["london", "metric"]), (response) => {
    r = response
    console.log(r)
  })
  res.send(r)
})

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
