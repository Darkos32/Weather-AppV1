import https from "https"; // necessário para fazer as chamadas da API
import express from "express"; // cria o servidor
import "dotenv/config"; // pega as variaveis de ambiente onde está a API key
import { parse } from "path";

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

function parseWeather(json) {
  
  var parse = {
    temp: json.main.temp,
    description: json.weather[0].description,
  };
  return parse;
}

app.get("/", (req, res) => {
  var clima;
  https.get(createCall(["london", "metric"]), (response) => {
    if (response.statusCode == 200) {
      response.on("data", (data) => {
        clima = parseWeather(JSON.parse(data));
              
      });
    } else {
      clima = "ERRO " + response.statusCode 
    }
  });
  res.send(JSON.stringify(clima));
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
