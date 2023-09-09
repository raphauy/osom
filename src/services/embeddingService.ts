import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PropertyDataToEmbed, getProperty, similaritySearch, updateEmbeddings } from "./propertyService";

require("dotenv").config()

/**
 * create table documents (
  id bigserial primary key,
  content text,
  metadata jsonb,
  embedding vector(1536)
);

 */

export async function start() {

    // await updateEmbeddings()
    // console.log("Finished updating embeddings");

    // const clientId= 'clm865amy0009jepxozqh2ff9'
    // const searchInput = "quiero comprar una casa en punta del este."
    // const results= await similaritySearch(clientId, searchInput, 5)
    // console.log(results)

    console.log("No debería salir esto");
    
}
