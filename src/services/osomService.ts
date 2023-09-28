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

  const headers = {
    'Content-Type': 'application/json',
  }
  const data = {
    phone,
    body,
    agente
  } 

  try {
    const response = await axios.post(osomEndpoint, data, {
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
