



import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';

export default async function setupSwagger(app) {

    await app.register(FastifySwagger, {
        swagger: {
            info: {
                title: 'EVENT MANAGEMENT ROLE-BASED API',
                description: 'API Documentation for User Authentication and Event Management System',
                version: '1.0.0',
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here'
            },
            servers: [
                {
                    url: 'http://localhost:3044',
                    //url:'https://192.168.31.120:3044',
                    description: 'Local Server'
                }
            ],
            tags: [{
                name: "FOR REGISTRATION/LOGIN/LOGOUT", description: "Endpoints for the user/admin registartion and login  , logout ,forgotpassword"
            }, {
                name: "EVENT-MANAGEMENT-ADMIN", description: "Admin endpoints for  managing events"
            },
            { name: "BOOKING-USER", description: "User endpoints for booking events" },

            { name: "GENERAL OPERATIONS", description: "General info routes" }


            ],
            securityDefinitions: {
                BearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'Enter JWT token as "Bearer <token>"'
                }
            },
            //security: [{ BearerAuth: [] }],  // this is the global authentication which aoolies  to all routes
        }
    });

    await app.register(FastifySwaggerUI, {
        routePrefix: '/docs',
        staticCSP: true,
        exposeRoute: true,
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
            displayRequestDuration: true,
            examples: true,
        },
    });
}
