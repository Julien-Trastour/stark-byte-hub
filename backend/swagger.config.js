import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'node:fs';
import yaml from 'yaml';

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
    },
  },
  apis: ['./src/routes/*.js'],
};

const openapiSpec = swaggerJSDoc(options);
const yamlString = yaml.stringify(openapiSpec);

fs.writeFileSync('./openapi.yaml', yamlString, 'utf8');

console.log('✅ openapi.yaml généré avec succès');