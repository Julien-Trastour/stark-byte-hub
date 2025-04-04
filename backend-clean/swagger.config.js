import swaggerJSDoc from 'swagger-jsdoc'
import fs from 'node:fs'
import yaml from 'yaml'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stark Byte Hub API',
      version: '1.0.0',
      description: 'Documentation de l’API du backend Stark Byte Hub',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
      parameters: {
        userId: {
          name: 'userId',
          in: 'query',
          description: 'Filtrer par ID utilisateur',
          required: false,
          schema: {
            type: 'string',
          },
        },
        ip: {
          name: 'ip',
          in: 'query',
          description: 'Filtrer par adresse IP',
          required: false,
          schema: {
            type: 'string',
          },
        },
        since: {
          name: 'since',
          in: 'query',
          description: 'Date de début (ISO 8601)',
          required: false,
          schema: {
            type: 'string',
            format: 'date-time',
          },
        },
        until: {
          name: 'until',
          in: 'query',
          description: 'Date de fin (ISO 8601)',
          required: false,
          schema: {
            type: 'string',
            format: 'date-time',
          },
        },
        take: {
          name: 'take',
          in: 'query',
          description: 'Nombre d’éléments à retourner (pagination)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
          },
        },
        skip: {
          name: 'skip',
          in: 'query',
          description: 'Nombre d’éléments à ignorer (pagination)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 0,
          },
        },
        orderBy: {
          name: 'orderBy',
          in: 'query',
          description: 'Champ de tri (ex. : createdAt, timestamp)',
          required: false,
          schema: {
            type: 'string',
          },
        },
        sort: {
          name: 'sort',
          in: 'query',
          description: 'Ordre de tri (asc ou desc)',
          required: false,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
          },
        },
      },
    },
  },
  apis: ['./src/routes/v1/*.js'],
}

const openapiSpec = swaggerJSDoc(options)
const yamlString = yaml.stringify(openapiSpec)

fs.writeFileSync('./openapi.yaml', yamlString, 'utf8')

console.log('✅ openapi.yaml généré avec succès')
