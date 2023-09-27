import axios from 'axios';
import https from 'https';

const OSOM_ENDPOINT= process.env.OSOM_ENDPOINT;

export async function sendWapMessage(phone: string, body: string, notificarAgente: boolean): Promise<void> {
  const agente= notificarAgente ? 1 : 0

  if (notificarAgente)
    console.log("Notificando agente a Osom")
    

  if (!OSOM_ENDPOINT) throw new Error("OSOM_ENDPOINT is not defined")
  
  const headers = {
    'Content-Type': 'application/json',
  }
  const data = {
    phone,
    body,
    agente
  } 

  try {
    const response = await axios.post(OSOM_ENDPOINT, data, {
      headers: headers,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
