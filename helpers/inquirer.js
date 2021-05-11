const inquirer = require('inquirer');

require('colors');

const questions = [
    {
        type: 'list',
        name: 'Opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.cyan} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.cyan} Historial`
            },
            {
                value: 0,
                name: `${'0.'.cyan} Salir`
            }
        ]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('+++++++++++++++++++++++++++++++++++++'.cyan);
    console.log(`${'|'.cyan}       ${'Seleccione una Opción'.bgCyan.black}       ${'|'.cyan}`)
    console.log('+++++++++++++++++++++++++++++++++++++\n'.cyan);

    const {Opcion} = await inquirer.prompt(questions);

    return Opcion;
}

const pausa = async() => {
    const input = [
        {
            type: 'input',
            name: 'pausa',
            message: `Presione ${'ENTER'.cyan} para continuar`,
            choices: ['Enter']
        }
    ];

    console.log('\n');
    await inquirer.prompt(input);
}

const leerInput = async(mensaje) => {

    const question = [
        {
            type: 'input',
            name: 'descripcion',
            message: mensaje,
            validate(value) {
                if(value.length === 0) {
                    return 'Debe ingresar un valor';
                }

                return true;
            }
        }
    ];

    const {descripcion} = await inquirer.prompt(question);

    return descripcion;
}

const listarLugares = async(lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}`.yellow;

        return {
            value: lugar.id,
            name: `${idx}. ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.cyan + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione el lugar',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);

    return id;
}

const confirmarDelete = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const {ok} = await inquirer.prompt(question);

    return ok;
}

const mostrarChecklist = async(lugares = []) => {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}`.yellow;

        return {
            value: tarea.id,
            name: `${idx}. ${tarea.descripcion}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta);

    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    confirmarDelete,
    mostrarChecklist,
    listarLugares
}