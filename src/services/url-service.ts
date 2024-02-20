


export function getSourceUrl(url: string): "ML" | "CASAYMAS" | "INFOCASAS" | "GALLITO" | null {
    // type of urls:
    // https://casa.mercadolibre.com.uy/MLU-656335136-venta-casa-carrasco-3-dormitorios-jardin-barbacoa-_JM
    // https://casasymas.com.uy/propiedad/2_71_91194830_5812835
    // https://www.gallito.com.uy/venta-casa-con-local-comercial-centro-inmuebles-22318773
    // https://www.infocasas.com.uy/frente-a-montevideo-shopping-amplio-y-luminoso/190884613

    if (url.includes("mercadolibre")) {
        return "ML"
    } else if (url.includes("casasymas")) {
        return "CASAYMAS"
    } else if (url.includes("infocasas")) {
        return "INFOCASAS"
    } else if (url.includes("gallito")) {
        return "GALLITO"
    }

    return null
}

export async function getIdFromUrl(url: string): Promise<string | null> {
    const source = getSourceUrl(url)

    if (source === "CASAYMAS") {
        return getIdFromCasasymas(url)
    // } else if (source === "ML") {
    //     return await getIdFromML(url)
    }
    return null    
}

export function getIdFromCasasymas(url: string): string | null {
    // Verifica que la URL comience con el patrón específico
    const patronBase = 'https://casasymas.com.uy/propiedad';
    if (!url.startsWith(patronBase)) {
        console.log('La URL no sigue el patrón especificado.');
        return null; // Retorna null si la URL no cumple con el patrón
    }

    // Extrae la parte de la URL después del último guion bajo
    const partes = url.split('_');
    if (partes.length > 1) {
        const codigo = partes[partes.length - 1]; // Obtiene la última parte después del guion bajo
        return codigo;
    } else {
        console.log('No se encontró un código en la URL.');
        return null; // Retorna null si no se encuentra el guion bajo
    }
}

export async function getIdFromML(url: string): Promise<string | null> {
    // Verifica que la URL comience con el patrón específico de MercadoLibre
    const patronBase = 'https://casa.mercadolibre.com.uy/';
    if (!url.startsWith(patronBase)) {
        console.log('La URL no sigue el patrón especificado de MercadoLibre.');
        return null;
    }

    // Extrae la parte del identificador en la URL
    const regex = /MLU-\d+/;
    const coincidencia = url.match(regex);

    if (!coincidencia) {
        console.log('No se encontró un identificador válido en la URL.');
        return null;
    }

    // Elimina el guion del identificador encontrado
    const MLUId = coincidencia[0].replace('-', '');

    const propertyId = await getIdFromMLJson(`https://api.mercadolibre.com/items/${MLUId}#json`);

    return propertyId;
    
}

export async function getIdFromMLJson(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Error al realizar la solicitud:', response.statusText);
            return null;
        }
        const data = await response.json();
        
        // Buscar el atributo con el id 'PROPERTY_CODE'
        const attribute = data.attributes.find((attr: any) => attr.id === 'PROPERTY_CODE');
        if (attribute && attribute.value_name) {
            return attribute.value_name;
        } else {
            console.log('No se encontró el código de la propiedad.');
            return null;
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return null;
    }
}