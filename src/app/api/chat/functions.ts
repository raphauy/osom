import { CompletionCreateParams } from "openai/resources/chat/index.mjs";



export const functions: CompletionCreateParams.Function[] = [
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
];


export async function getProperties(description: string){
  //const apiUrl = 'http://localhost:3000/api/propiedades'
  const apiUrl = 'https://osom.rapha.uy/api/propiedades'
  const requestData = {
    apiToken: 'randomTokenCreatedByRC',
    clientId: 'clm865amy0009jepxozqh2ff9',
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


export async function runFunction(name: string, args: any) {
  switch (name) {
    case "getProperties":
      return getProperties(args["description"]);
        default:
      return null;
  }
}
