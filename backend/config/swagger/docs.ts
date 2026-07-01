import swaggerJSDoc from "swagger-jsdoc";
import { settings } from "../settings.js";

// Configuración de swagger
const config: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "VeloMMA API",
            version: '1.0.0',
            description: "API analítica con estadísticas avanzadas de eventos, peleadores y métricas de la UFC."
        },
        servers: [
            {
                url: `http://localhost:5300${settings.basePath}`,
                description: 'Servidor local'
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'API Key'
                }
            }
        },
    },
    apis: [
        './src/modules/**/*.ts', 
        './dist/modules/**/*.js', 
        './src/routes/**/*.ts', 
        './dist/routes/**/*.js'
    ]
}

export const swaggerSpec = swaggerJSDoc(config);