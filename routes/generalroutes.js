import fastify from 'fastify';
import { getAllEvents, mostbookings, demo } from '../controllers/generalopera.js';
import { getallevents, Mostbookings, demoSchema } from '../docs/swagger.SchemaGeneral.js'

const app = fastify({
    logger: true
})

/**
 * This module contains the routes for the general operations like  getting all events and most booked events.
 * @module routes/generalroutes.js
 */
async function generalRoutes(fastify, options) {


    /**
    * ---> This route is to get all the events.
    * ---> This route has the preHandler middleware to validate the request body
    * ---> THis route has the swagger schema attached to it.
    */
    fastify.get('/allevents', {

        schema: getallevents.schema,

        preHandler: async (request, reply) => {


        }
    }, getAllEvents);


    fastify.get('/demo', {
        schema: demoSchema.schema,
        preHandler: async (request, reply) => {

        }
    }, demo);


    /**
    * ---> This route is to get the most booked events.
    * ---> This route has the preHandler middleware to validate the request body
    * ---> THis route has the swagger schema attached to it.
    */
    fastify.get('/mostbookings', {

        schema: Mostbookings.schema,

        preHandler: async (request, reply) => {

        }
    },

        mostbookings);
};
export default generalRoutes
