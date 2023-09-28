import axios from 'axios';
import https from 'https';
import { getClient } from './clientService';

export async function sendWapMessage(phone: string, body: string, notificarAgente: boolean, clientId: string): Promise<void> {
  const agente= notificarAgente ? 1 : 0

  if (notificarAgente)
    console.log("Notificando agente a Osom")

  const client= await getClient(clientId)
  if (!client) throw new Error("Client not found")

  const osomEndpoint= client.whatsappEndpoint

  if (!osomEndpoint) throw new Error("whatsappEndpoint not found")

  let text= quitarCorchetes(body)
  text= quitarParentesis(text)

  const headers = {
    'Content-Type': 'application/json',
  }
  const data = {
    phone,
    body: text,
    agente
  } 

  const attempts= 3
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await axios.post(osomEndpoint, data, {
        headers: headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      console.log('Success:', response.data);
      return
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

// modificar el texto para transformar enlaces en formato Markdown en texto en negrita en formato whatsapp (ejemplo: texto en *negrita*) seguido de la url exacta
export function transformText(text: string): string {
  const regex= /\[([^\]]+)\]\(([^)]+)\)/g
  const matches= text.matchAll(regex)
  let transformedText= text
  for (const match of matches as any) {
    const original= match[0]
    const url= match[2]
    const text= match[1]
    transformedText= transformedText.replace(original, `*${text}* ${url}`)
  }
  return transformedText
}

// función que quita los paréntesis curvos, ejemplo: este texto (tiene parentesis) y lo transforma en este texto tiene parentesis
export function quitarParentesis(text: string): string {
  const regex= /\(([^\)]+)\)/g
  const matches= text.matchAll(regex)
  let transformedText= text
  for (const match of matches as any) {
    const original= match[0]
    const text= match[1]
    transformedText= transformedText.replace(original, text)
  }
  return transformedText
}

// función que transforma el texto '[aquí]' en el texto 'aquí: '
export function quitarCorchetes(text: string): string {
  const regex= /\[([^\]]+)\]/g
  const matches= text.matchAll(regex)
  let transformedText= text
  for (const match of matches as any) {
    const original= match[0]
    const text= match[1]
    transformedText= transformedText.replace(original, `${text}: `)
  }
  return transformedText
}

// función test para quitarParentesis
export function start() {
  const text= "Hola [texto en negrita](https://www.google.com) [texto en negrita](https://www.google.com)"
  const text2= quitarCorchetes(text)
  const transformedText= quitarParentesis(text2)
  console.log(transformedText)
}
