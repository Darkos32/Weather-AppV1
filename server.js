import https from "https"; // necessário para fazer as chamadas da API
import express from "express"; // cria o servidor
import bodyParser from "body-parser";
import path from 'path'
import { fileURLToPath } from "url";
import "dotenv/config"; // pega as variaveis de ambiente onde está a API key

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const apiKey = process.env.WEATHER_KEY;
const endPoint = "https://api.openweathermap.org/data/2.5/weather?";
const paramKeys = ["q", "units", "lang", "mode"];

app.use(bodyParser.urlencoded({ extended: true }));

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
    iconImg:
      "http://openweathermap.org/img/wn/" + json.weather[0].icon + "@2x.png",
  };
  return parse;
}

function parseBody(body) {
  var params = [body.cityName, "metric"];
  return params
}

app.get("/", (req, res) => {
  res.sendFile(__dirname +"/index.html")
});

app.post("/", (req, res) => {
  var clima;
  console.log(req.body)
  var params = parseBody(req.body);
  console.log(params)
  var url = createCall(params);
  https.get(url, (response) => {
    if (response.statusCode == 200) {
      response.on("data", (data) => {
        clima = parseWeather(JSON.parse(data));
        res.write("<p> The weather is " + clima.description + "</p>");
        res.write(
          "<h1>It's currently " +
            clima.temp +
            " degrees Celcius in "+params[0]+"</h1>"
        );
        res.write("<img src='" + clima.iconImg + "' />");
        res.send();
      });
    } else {
      clima = "ERRO " + response.statusCode;
    }
  });
})

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
