const fs = require('fs');

const axios = require('axios');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        // Leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        let newHistorial = [];
        this.historial.forEach( lugar => {
            let texto = '';
            const arr = lugar.split(' ');
            arr.forEach( palabra => {
                const primerLetra = palabra.charAt(0).toUpperCase();
                const resto = palabra.substring(1, palabra.length);
                texto += primerLetra.concat(resto) + ' ';
            })
            newHistorial.push(texto);
        })
        this.historial = newHistorial;
        return this.historial
    }

    get lugarParams () {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        };
    }

    get climaParams () {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }
    
    async ciudad(lugar = '') {

        try {
            // Preticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.lugarParams
            });

            const resp = await instance.get();
    
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {

            // Instancia de axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {lat, lon, ...this.climaParams}
            });

            const resp = await instance.get();

            // resp.data
            return resp.data;

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = '') {
        if(this.historial.includes( lugar.toLocaleLowerCase() )) {
            return;
        }
        this.historial = this.historial.splice(0, 5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB () {
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB () {
        if(!fs.existsSync(this.dbPath)) {
            return;
        }

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Busquedas;