import { getSourceUrl, getIdFromCasasymas, getIdFromML, getIdFromMLJson } from "./url-service"
//import { start } from "./osomService"

async function main() {
  //start()

  // https://casa.mercadolibre.com.uy/MLU-656335136-venta-casa-carrasco-3-dormitorios-jardin-barbacoa-_JM
  // https://casasymas.com.uy/propiedad/2_71_91194830_5812835
  // https://www.gallito.com.uy/venta-casa-con-local-comercial-centro-inmuebles-22318773
  // https://www.infocasas.com.uy/frente-a-montevideo-shopping-amplio-y-luminoso/190884613

  let url= "https://www.infocasas.com.uy/frente-a-montevideo-shopping-amplio-y-luminoso/190884613"
  let source = getSourceUrl(url)
  console.log(source)
  let code= getIdFromCasasymas(url)
  console.log(code)
  code= await getIdFromML(url)
  console.log(code)

  url= "https://www.gallito.com.uy/venta-casa-con-local-comercial-centro-inmuebles-22318773"
  source = getSourceUrl(url)
  console.log(source)
  code= getIdFromCasasymas(url)
  console.log(code)
  code= await getIdFromML(url)
  console.log(code)


  //url= "https://casasymas.com.uy/propiedad/2_71_91194830_5812835"
  url= "https://casasymas.com.uy/propiedad/2_71_89803769_746325"
  source = getSourceUrl(url)
  console.log(source)
  code= getIdFromCasasymas(url)
  console.log(code)
  code= await getIdFromML(url)
  console.log(code)

  url= "https://casa.mercadolibre.com.uy/MLU-656335136-venta-casa-carrasco-3-dormitorios-jardin-barbacoa-_JM"
  source = getSourceUrl(url)
  console.log(source)
  code= getIdFromCasasymas(url)
  console.log(code)
  code= await getIdFromML(url)
  console.log(code)

  code= await getIdFromMLJson("https://api.mercadolibre.com/items/MLU656335136#json")
  console.log("code from JSON:", code)

}
  
main()
  