require("colors");

const {
  inquiererMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  let opc;
  const busquedas = new Busquedas();
  do {
    opc = await inquiererMenu();
    switch (opc) {
      case 1:
        //mostrar mensaje
        const ciudad = await leerInput("Ciudad: ");

        // buscar lugares
        const lugares = await busquedas.ciudad(ciudad);

        // seleccionar lugar
        const idPlace = await listarLugares(lugares);

        //valida si no se cancelo el proceso
        if (idPlace === 0) continue;

        //obtiene la info del lugar
        const lugarSeleccionado = lugares.find((l) => l.id === idPlace);

        //guardar en DB
        busquedas.agregarHistoriar(lugarSeleccionado.nombre);

        //obtiene el clima del lugar
        const clima = await busquedas.clima(
          lugarSeleccionado.latitud,
          lugarSeleccionado.longitud
        );
        //info
        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Cuidad: ", `${lugarSeleccionado.nombre}`.yellow);
        console.log("Latitud: ", `${lugarSeleccionado.latitud}`.yellow);
        console.log("Longitud: ", `${lugarSeleccionado.longitud}`.yellow);
        console.log("Temperatura: ", `${clima.temp}`.yellow);
        console.log("Mínima: ", `${clima.min}`.yellow);
        console.log("Maxima: ", `${clima.max}`.yellow);
        console.log("Status: ", `${clima.desc}`.yellow);
        break;
      case 2:
        console.clear();
        console.log("\nHistorial de Busquedas\n".green);
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar} `);
        });
        break;
    }
    if (opc !== 0) await pausa();
  } while (opc !== 0);
};

main();
