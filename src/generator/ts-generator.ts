import { promises as fs } from 'fs'
import inquirer from 'inquirer'
import { generateServicesFile } from './generate-services'
import { generateActionsFile } from './generate-actions'
import { generateFormFile } from './generate-forms'
import { generateDialogsFile } from './generate-dialogs'
import { generateTableFile } from './generate-table'
import { generateColumnsFile } from './generate-columns'
import { generatePageFile } from './generate-page-tsx'

// Define las constantes de los directorios de trabajo
const HOME = '/home/raphael/desarrollo/osom'
const FRONTEND_PATH= `/admin`
const SERVICES = `${HOME}/src/services`
const SCHEMA = `${HOME}/prisma/schema.prisma`

let abort= false

// Función principal del programa
async function main() {
  try {
    // Leer el contenido del archivo schema.prisma
    const schemaContent = await fs.readFile(SCHEMA, 'utf8')

    const modelNames = extractModelNames(schemaContent)

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedModel',
        message: 'Selecciona un modelo:',
        choices: modelNames
      }
    ])

    const modelDefinition = await getModelDefinition(answers.selectedModel, schemaContent)
    createPathIfNotExists(HOME + "/src/app" + FRONTEND_PATH + "/" + formatModelNameForFile(answers.selectedModel) + "s")

    const override= await generateServicesFile(SERVICES, answers.selectedModel, modelDefinition)
    if (!override) abort= true

    await generateActionsFile(HOME, FRONTEND_PATH, answers.selectedModel)
    await generateFormFile(HOME, FRONTEND_PATH, answers.selectedModel, modelDefinition)
    await generateDialogsFile(HOME, FRONTEND_PATH, answers.selectedModel)
    await generateTableFile(HOME, FRONTEND_PATH, answers.selectedModel, modelDefinition)
    await generateColumnsFile(HOME, FRONTEND_PATH, answers.selectedModel, modelDefinition)
    await generatePageFile(HOME, FRONTEND_PATH, answers.selectedModel)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Función para crear un directorio si no existe
async function createPathIfNotExists(path: string): Promise<void> {
  if (!(await fileExists(path))) {
    console.log(`Creando directorio ${path}`)    
    await fs.mkdir(path)
  } else {
    console.log(`El directorio ${path} ya existe`)
  }
}

function extractModelNames(schemaContent: string): string[] {
  const modelRegex = /model (\w+)/g
  let match
  const models = []

  while ((match = modelRegex.exec(schemaContent)) !== null) {
    models.push(match[1])
  }

  return models
}



// Función para extraer la definición del modelo del archivo schema.prisma
async function getModelDefinition(modelName: string, schemaContent: string): Promise<string> {
 
  // Expresión regular para encontrar la definición del modelo
  // Asume que no hay comentarios de bloque dentro de la definición del modelo
  const modelRegex = new RegExp(`model\\s+${modelName}\\s+{[^}]*}`, 's');
  
  // Buscar la definición del modelo
  const match = schemaContent.match(modelRegex);

  // Retornar la definición del modelo o una cadena vacía si no se encuentra
  return match ? match[0] : '';
}

export function formatModelNameForFile(modelName: string): string {
  return modelName.charAt(0).toLowerCase() + modelName.slice(1)
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

export function prismaToTsType(prismaType: string): string {
  const typeMapping: { [key: string]: string } = {
  String: 'string',
  'String?': 'string',
  Int: 'number',
  'Int?': 'number',
  Float: 'number',
  'Float?': 'number',
  Boolean: 'boolean',
  'Boolean?': 'boolean',
  DateTime: 'Date',
  'DateTime?': 'Date',
  Json: 'any',
}

return typeMapping[prismaType] || 'any'
}

export function parseModelFields(modelDefinition: string): Array<{ name: string, type: string }> {
  const lines = modelDefinition.split('\n')
  const fields = lines
    .filter((line) => !line.includes('[]') && !line.includes('@relation') && !line.includes('{') && !line.includes('}'))
    .map((line) => {
      //const [field, prismaTypeWithOptional] = line.trim().split(/\s+/)
      const optional = line.includes('?')
      //const prismaType = optional ? prismaTypeWithOptional.slice(0, -1) : prismaTypeWithOptional
      const field= line.trim().split(/\s+/)[0]
      const prismaType = line.trim().split(/\s+/)[1]
      const tsType = prismaToTsType(prismaType) // Convertir tipo de Prisma a TypeScript
      
      return `${field}${optional ? '?' : ''}: ${tsType}`
    })
    console.log(fields);

    const res= fields.map(field => {
      const [name, type] = field.split(':')
      return { name, type }
    })

  return res
}

export async function checkFile(filePath: string): Promise<boolean> {
  return !abort
}

main()
//mainTest()

async function mainTest() {
  const modelDefinition = `
  model User {                                                                                                                         [5/830]
  id            String    @id @default(cuid())                                                                                              
  name          String?                                                                                                                     
  email         String    @unique                                                                                                           
  role          String    @default("user")                                                                                                  
  emailVerified DateTime?                                                                                                                   
  image         String?
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  }  `
  const fields = parseModelFields(modelDefinition)
  console.log(fields);
}