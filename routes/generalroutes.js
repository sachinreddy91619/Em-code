import fastify from 'fastify';

const app = fastify({
    logger: true
})

import { getAllEvents, mostbookings } from '../controllers/generalopera.js';

import { getallevents, Mostbookings } from '../docs/swagger.SchemaGeneral.js'


async function generalRoutes(fastify, options) {

    fastify.get('/allevents', {

        schema: getallevents.schema,

        preHandler: async (request, reply) => {


        }
    }, getAllEvents);



    fastify.get('/mostbookings', {

        schema: Mostbookings.schema,

        preHandler: async (request, reply) => {

        }
    },

        mostbookings);
};
export default generalRoutes
