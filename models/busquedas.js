const fs = require("fs");
require("dotenv").config();
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    //TODO leer db si existe
    this.leerDB();
  }
  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(" ");
    });
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_TOKEN,
      limit: 6,
      language: "es",
    };
  }
  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_TOKEN,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(lugar = "") {
    try {
      //Peticion https
      const api = await axios({
        url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox,
      });
      // console.log(api.data.features);
      return api.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        longitud: lugar.center[0],
        latitud: lugar.center[1],
      }));
    } catch (error) {
      //console.log(error);
      return [];
    }
  }

  async clima(lat, lon) {
    try {
      const api = await axios({
        url: "https://api.openweathermap.org/data/2.5/weather",
        params: { ...this.paramsOpenWeather, lat, lon },
      });

      return {
        desc: api.data.weather[0].description,
        min: api.data.main.temp_min,
        max: api.data.main.temp_max,
        temp: api.data.main.temp,
      };
    } catch (error) {
      console.log("error");
    }
  }

  agregarHistoriar(lugar = "") {
    if (this.historial.includes(lugar.toLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 5);
    this.historial.unshift(lugar.toLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDB() {
    if (!fs.existsSync(this.dbPath)) {
      return;
    }
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}
module.exports = Busquedas;
