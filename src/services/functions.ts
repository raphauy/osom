
export const functions= [
  {
    name: "getProperties",
    description:
      "Devuelve propiedades inmobiliarias a partir de una descripción de la propiedad. Ejemplo: 'Casa en venta de dos dormitorios en Pocitos'",
    parameters: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: "La descripción de la propiedad, puede incluir, tipo como casa o apartamento, zona como su barrio, departamento o ciudad, cantidad de dormitorios, si tiene piscina, si tiene parrillero, etc.",
        },
      },
      required: ["description"],
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


export async function getProperties(description: string, clientId: string){
  //const apiUrl = 'http://localhost:3000/api/propiedades'
  const apiUrl = 'https://osom.rapha.uy/api/propiedades'
  const requestData = {
    //apiToken: 'randomTokenCreatedByRC',
    apiToken: process.env.API_TOKEN,
    clientId,
    limit: '5',
    input: description
  }

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
      return getProperties(args["description"], clientId);
    case "notifyHuman":
      return notifyHuman(clientId);
          default:
      return null;
  }
}
