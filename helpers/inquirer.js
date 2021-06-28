const inquirer = require("inquirer");
const { async } = require("rxjs");
require("colors");

const menuOpts = [
  {
    type: "list",
    name: "opcion",
    message: "¿Que desea hacer?\n",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const inquiererMenu = async () => {
  console.clear();
  console.log("=========================".green);
  console.log("          Clima".yellow);
  console.log("=========================\n".green);

  const { opcion } = await inquirer.prompt(menuOpts);
  return opcion;
};

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "descrip",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { descrip } = await inquirer.prompt(question);
  return descrip;
};

const pausa = async () => {
  console.log("\n");
  await inquirer.prompt([
    {
      type: "input",
      name: "enter",
      message: `Presione ${"ENTER".green} para continuar`,
    },
  ]);
};

const listarLugares = async (lugares = []) => {
  console.log();
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}. `.green;

    return {
      value: lugar.id,
      name: `${idx}${lugar.nombre}`,
    };
  });
  choices.unshift({
    value: 0,
    name: "0. ".green + "Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const confirmar = async (message) => {
  const pregunta = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(pregunta);
  return ok;
};

module.exports = {
  inquiererMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
};
