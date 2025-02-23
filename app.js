// importing the Sentry module from the instrument.mjs file
import './instrument.js';

import * as Sentry from "@sentry/node";
import fastify from 'fastify';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import eventRou from './routes/eventroutes.js';
import authRou from './routes/authroutes.js';



import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';


import setupSwagger from './docs/swagger.js';  // Import the Swagger setup function


dotenv.config();

const app = fastify({
    logger: true,
    ajv: {
        customOptions: {
            strict: false, // to allow "example" field
        },
    },
});


// Register Swagger

//await setupSwagger(app);
setupSwagger(app);

// // Swagger Configuration
// app.register(swagger, {
//     swagger: {
//         info: {
//             title: 'Fastify Role-Based API',
//             description: 'API Documentation for User Authentication and Event Management System',
//             version: '1.0.0',
//         },
//         externalDocs: {
//             url: 'https://swagger.io',
//             description: 'Find more info here'
//         },
//         servers: [
//             {
//                 url: 'http://localhost:3044',
//                 description: 'Local Server'
//             }
//         ],
//         securityDefinitions: {
//             BearerAuth: {
//                 type: 'apiKey',
//                 name: 'Authorization',
//                 in: 'header',
//                 description: 'Enter JWT token as "Bearer <token>"'
//             }
//         },
//         security: [{ BearerAuth: [] }]
//     }
// });

// // Swagger UI setup
// app.register(swaggerUi, {
//     routePrefix: '/docs',
//     staticCSP: true,
//     exposeRoute: true
// });






//app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
Sentry.setupFastifyErrorHandler(app);

//console.log(Sentry);
console.log("the server started successfully");
mongoose.connect(process.env.MONGO_URL)
    .then(() => {

        app.log.info('Database connected successfully');

    })
    .catch((err) => {
        app.log.error('MongoDB not connected successfully', err);
        Sentry.captureException(err);


    });

app.register(eventRou, { prefix: '/event' });
app.register(authRou, { prefix: '/auth' });

app.setErrorHandler((error, request, reply) => {
    Sentry.captureException(error);
    app.log.error('Error:', error);

    reply.status(500).send({ error: error.message });
});

const PORT = process.env.PORT || 3000;

//const PORT = parseInt(process.env.PORT, 10) || 3000;

// app.listen(PORT, (err, address) => {
//     if (err) {
//         app.log.error(err);
//         process.exit(1);
//     }
//     app.log.info(`Server listening on ${address}`);
// });

app.listen({ port: PORT }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening on ${address}`);
});


console.log(`the server listening on port ${PORT}`);

export default app;