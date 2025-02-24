// import FastifySwagger from '@fastify/swagger';
// import FastifySwaggerUI from '@fastify/swagger-ui';



// // Step 1: Generate swagger_output.json using swagger-autogen
// const doc = {
//     info: {
//         title: 'Fastify API',
//         description: 'Generating API documentation using swagger-autogen',
//         version: '1.0.0',
//     },
//     host: 'localhost:3044',
//     basePath: '/',
//     schemes: ['http'],
// };

// const outputFile = './swagger_output.json';
// const endpointsFiles = ['./routes/authroutes.js', './routes/eventroutes.js']; // Add all your route files
//............................................................>



// import FastifySwagger from '@fastify/swagger';
// import FastifySwaggerUI from '@fastify/swagger-ui';

// export default async function setupSwagger(app) {
//     await app.register(FastifySwagger, {
//         swagger: {
//             info: {
//                 title: 'EVENT MANAGEMENT ROLE-BASED API',
//                 description: 'API Documentation for User Authentication and Event Management System',
//                 version: '1.0.0',
//             },
//             externalDocs: {
//                 url: 'https://swagger.io',
//                 description: 'Find more info here'
//             },
//             servers: [
//                 {
//                     url: 'http://localhost:3044',
//                     description: 'Local Server'
//                 }
//             ],
//             tags: [{
//                 name: "FOR REGISTRATION/LOGIN/LOGOUT", description: "Endpoints for the user/admin registartion and login  , logout"
//             }, {
//                 name: "EVENT-MANAGEMENT-ADMIN", description: "Admin endpoints for  managing events"
//             },
//             { name: "BOOKING-USER", description: "User endpoints for booking events" }],
//             securityDefinitions: {
//                 BearerAuth: {
//                     type: 'apiKey',
//                     name: 'Authorization',
//                     in: 'header',
//                     description: 'Enter JWT token as "Bearer <token>"'
//                 }
//             },
//             security: [{ BearerAuth: [] }]
//         }
//     });

//     await app.register(FastifySwaggerUI, {
//         routePrefix: '/docs',
//         staticCSP: true,
//         exposeRoute: true
//     });
// }

