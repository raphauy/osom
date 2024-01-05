import { getPropertyFromClientById, getPropertyFromClientByURL, similaritySearchProyecto, similaritySearchV2 } from "./propertyService";

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
  {
    name: "getPropertyByURL",
    description:
      "Devuelve la información de la propiedad a partir de la URL de la propiedad. Ejemplo: 'https://hardoy.com.uy/propiedad/478'. Si la URL no existe en la base de datos devuelve un mensaje a enviar al usuario.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL de la propiedad que el usuario está intentando consultar.",
        },
      },
      required: ["url"],
    },    
  },
  {
    name: "getPropertyByReference",
    description:
      "Devuelve la información de la propiedad a partir de la referencia de la propiedad. Ejemplos: '478', '1010', '1054517', '2DPPFM', etc. Si la referencia no existe en la base de datos devuelve un mensaje a enviar al usuario.",
    parameters: {
      type: "object",
      properties: {
        reference: {
          type: "string",
          description: "Referencia de la propiedad que el usuario está intentando consultar. Ejemplos: '478', '1010', '1054517', '2DPPFM', etc.",
        },
      },
      required: ["reference"],
    },    
  },
  {
    name: "getProyecto",
    description:
      "Devuelve la información de un Proyecto inmobiliario a partir de su nombre. También llamado Emprendimiento inmobiliario. Esta función utiliza una búsqueda semántica con Embedding, por lo que aunque el usuario no brinde el nombre completo, la búsqueda puede arrojar el resultado si hay coincidencia semántica.",
    parameters: {
      type: "object",
      properties: {
        nombre: {
          type: "string",
          description: "Referencia al nombre del proyecto que el usuario está intentando consultar. Ejemplos: 'Torre Arenas - Malvín', 'Edificio - Barrio Sur', 'VIA 21 - Punta Carretas', 'Gala Pop - Tres Cruces', 'Osaka Carrasco Norte - barrio privado', etc.",
        },
      },
      required: ["nombre"],
    },    
  },
];


export async function getProperties(tipo: string, operacion: string, presupuesto: string, zona: string, description: string, clientId: string){

  console.log('tipo: ' + tipo)
  console.log('operacion: ' + operacion)
  console.log('presupuesto: ' + presupuesto)
  console.log('zona: ' + zona)
  console.log('description: ' + description)

  let presupuestoNumber= 0
  try {
    presupuestoNumber= parseInt(presupuesto)
  } catch (error) {
    console.log("error: ", error)
  }

  const similarityArray= await similaritySearchV2(clientId, tipo, operacion, presupuestoNumber, description)
  const responseData: PropiedadResult[]= []
  similarityArray.forEach((item) => {
      const transformedItem= {
          url: item.url,
          titulo: item.titulo,
          caracteristicas: item.content,
          distance: item.distance
      }
      responseData.push(transformedItem)
  })            

  return responseData
}

export async function notifyHuman(clientId: string){
  console.log("notifyHuman")
  return "dile al usuario que un agente inmobiliario se va a comunicar con él, saluda y finaliza la conversación. No ofrezcas más ayuda, saluda y listo."
}

export async function getPropertyByURL(url: string, clientId: string){
  console.log("getPropertyByURL")
  const property= await getPropertyFromClientByURL(url, clientId)
  if (property) {
    const response: PropiedadResult= {
      url: property.url || "",
      titulo: property.titulo || "",
      caracteristicas: property.content || "",
      distance: 0
    }
    return response
  } else {
    console.log("Propiedad no encontrada")
    return "Propiedad no encontrada. Por favor responde esto al usuario: No encontré una propiedad con ese link. Te gustaría que te contacte un agente inmobiliario para ayudarte a encontrar la propiedad que estás buscando?"
  }
}

export async function getPropertyByReference(reference: string, clientId: string){
  console.log("getPropertyByReference")
  const property= await getPropertyFromClientById(reference, clientId)
  if (property) {
    const response: PropiedadResult= {
      url: property.url || "",
      titulo: property.titulo || "",
      caracteristicas: property.content || "",
      distance: 0
    }
    return response
  } else {
    console.log("Propiedad no encontrada")
    return "Propiedad no encontrada. Por favor responde esto al usuario: No encontré una propiedad con esa referencia. Te gustaría que te contacte un agente inmobiliario para ayudarte a encontrar la propiedad que estás buscando?"
  }
}

export async function getProyecto(nombre: string, clientId: string){
  console.log("**** getProyecto ****")
  console.log('nombre: ' + nombre)

  if (!nombre) {
    console.log("nombre no puede ser null")
    return "nombre no puede ser null"
  }

  const similarityArray= await similaritySearchProyecto(clientId, nombre)
  const responseData: PropiedadResult[]= []
  similarityArray.forEach((item) => {
      const transformedItem= {
          url: item.url,
          titulo: item.titulo,
          caracteristicas: item.content,
          distance: item.distance
      }
      responseData.push(transformedItem)
  })

  return responseData
}


export async function runFunction(name: string, args: any, clientId: string) {
  switch (name) {
    case "getProperties":
      return getProperties(args["tipo"], args["operacion"], args["presupuesto"], args["zona"], args["description"], clientId);
    case "notifyHuman":
      return notifyHuman(clientId);
    case "getPropertyByURL":
      return getPropertyByURL(args["url"], clientId);
    case "getPropertyByReference":
      return getPropertyByReference(args["reference"], clientId);
    case "getProyecto":
      return getProyecto(args["nombre"], clientId);
    default:
      return null;
  }
}

export type PropiedadResult= {
  url: string
  titulo: string
  caracteristicas: string
  distance: number
}
