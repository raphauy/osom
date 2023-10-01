
export const functions= [
  {
    name: "getProperties",
    description:
      "Devuelve propiedades inmobiliarias a partir de una descripción de las características de la propiedad. Ejemplo: 'Casa en venta en Montevideo con dos dormitorios con valor aproximado de 200000 USD'. Otro ejemplo: 'Apartamento en alquiler en Pocitos con un dormitorio con valor de alquiler aproximado de 20000 pesos'.",
    parameters: {
      type: "object",
      properties: {
        tipo: {
          type: "string",
          description: "casa, apartamento, terreno, local, etc",
        },
        operacion: {
          type: "string",
          description: "alquilar o venta",
        },
        presupuesto: {
          type: "string",
          description: "valor aproximado de la propiedad si quiere comprar o valor aproximado de alquiler si quiere alquilar",
        },
        zona: {
          type: "string",
          description: "barrio, departamento o ciudad",
        },
        description: {
          type: "string",
          description: "La descripción contiene las características de la propiedad. Las características, deben incluir obligatoriamente: tipo (casa, apartamento, terreno, local, etc), operación (alquilar o venta), monto (valor aproximado para venta o alquiler según corresponda) y zona (barrio, departamento o ciudad). Opcionalmente se puede incluir cualquier otra característica como cantidad de dormitorios, si tiene piscina, si tiene parrillero, etc.",
        },
      },
      required: ["tipo","operacion","presupuesto","zona","description"],
    },    
  },
  {
    name: "notifyHuman",
    description:
      "Se debe invocar esta función para notificar a un agente inmobiliario cuando la intención del usuario es hablar con un humano o hablar con un agente inmobiliario o agendar una visita.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];


export async function getProperties(tipo: string, operacion: string, presupuesto: string, zona: string, description: string, clientId: string){
  const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/propiedades' : 'https://osom.rapha.uy/api/propiedades'
  const requestData = {
    apiToken: process.env.API_TOKEN,
    clientId,
    limit: '5',
    input: description
  }

  console.log('tipo: ' + tipo)
  console.log('operacion: ' + operacion)
  console.log('presupuesto: ' + presupuesto)
  console.log('zona: ' + zona)
  console.log('description: ' + description)

  const fetchResponse = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const responseData = await fetchResponse.json()
  return responseData
}

export async function notifyHuman(clientId: string){
  console.log("notifyHuman")
  return "dile al usuario que un agente inmobiliario se va a comunicar con él, saluda y finaliza la conversación. No ofrezcas más ayuda, saluda y listo."
}


export async function runFunction(name: string, args: any, clientId: string) {
  switch (name) {
    case "getProperties":
      return getProperties(args["tipo"], args["operacion"], args["presupuesto"], args["zona"], args["description"], clientId);
    case "notifyHuman":
      return notifyHuman(clientId);
          default:
      return null;
  }
}
