require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {

    const busquedas = new Busquedas();
    let opt = '';

    do {
        opt = await inquirerMenu();

        switch(opt) {
            case 1:
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad(lugar);
                
                // Selecionar el lugar
                const selId = await listarLugares(lugares);
                if(selId === '0') continue;
                const lugarSel = lugares.find( l => l.id === selId);
                // Guardar en historial
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const clima = await busquedas.climaLugar(lugarSel.latitud, lugarSel.longitud);

                // Mostrar resultados
                console.clear();
                console.log('\nInformacion del lugar\n'.cyan);
                console.log(`Ciudad: ${lugarSel.nombre}`);
                console.log(`Latitud: ${lugarSel.latitud}`);
                console.log(`Longitud: ${lugarSel.longitud}`);
                console.log(`Temperatura: ${clima.main.temp}°`);
                console.log(`Mínima: ${clima.main.temp_min}°`);
                console.log(`Máxima: ${clima.main.temp_max}°`);
                console.log('Como esta el ambiente: ', clima.weather[0].description)
            break;

            case 2:
                // Historial
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.cyan
                    console.log(`${idx} ${lugar}`);
                })
            break;
        }

        if(opt !== 0) await pausa();
    } while(opt !== 0)
}

main(); 