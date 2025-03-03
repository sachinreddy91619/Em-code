

import fastify from 'fastify';
import joi from 'joi';

const app = fastify({
    logger: true
});

import { register, login } from '../controllers/authopera.js';
import auth from '../middleware/authmiddle.js';
//import registerUserSchema from '../schemas/registerUserSchema.js';
import loginUserSchema from '../schemas/loginUserSchema.js';

import { logout } from '../controllers/authopera.js';

import userRegisterValidation from '../validators/registration.js';

import { registerSwagger } from '../docs/SwaggerSchemaAuth.js';

import userLoginvalidation from '../validators/login.js';

import { loginSwagger } from '../docs/SwaggerSchemaAuth.js';



import userLogoutValidation from '../validators/logout.js';

import { logoutSwagger } from '../docs/SwaggerSchemaAuth.js';


import { otpGeneration, passwordUpdation } from '../controllers/authopera.js';
import { otpMiddleware } from '../middleware/otpmiddleware.js'

async function authroutes(fastify, options) {




    fastify.post('/register', {
        schema: registerSwagger.schema,
        preHandler:
            async (request, reply) => {


                const { error: missingFieldsError } = userRegisterValidation.requiredFieldsValidation(request.body);
                if (missingFieldsError) {
                    return reply.status(400).send({
                        error: 'Bad Request',
                        message: 'Missing required fields in the body'
                    });
                }
                const { error: validationError } = userRegisterValidation.validate(request.body);
                if (validationError) {
                    return reply.status(401).send({
                        error: 'Bad Request',
                        message: 'Validation failed body requirement not matching has per the requirements'
                    });
                }
            }
    }, register); // register route







    fastify.post('/otpGeneration', {
        preHandler: async (request, reply) => {


        }
    }, otpGeneration);


    // this route is to updating the password
    fastify.post('/forgotPass',
        {
            // schema: updationPasswordSwagger.schema,
            preHandler:
                async (request, reply) => {

                    //const {error}=passwordUpdateValidation.validate(request.body);

                    // if(error){
                    //     return reply.status(400).send({
                    //         error:'Bad Request',
                    //         message:"Validation failed Body not matching the requirements check them once while updating the password"
                    //     })
                    // }

                    await otpMiddleware(request, reply)
                }
        }, passwordUpdation);


    fastify.post('/login', {

        schema: loginSwagger.schema,
        preHandler: async (request, reply) => {
            const { error: missingFieldsError } = userLoginvalidation.requiredFieldsValidation(request.body);
            if (missingFieldsError) {
                return reply.status(400).send({
                    error: 'Bad Request',
                    message: 'Missing required fields in the body'
                });
            }


            const { error: validationError } = userLoginvalidation.validate(request.body);
            if (validationError) {
                return reply.status(401).send({
                    error: 'Bad Request',
                    message: 'Validation failed body requirement not matching',
                })
            }


        }
    }, login); // login route



    // fastify.post('/logout', { preHandler: auth }, async(request,reply)=>{
    //     const {error}=userLogoutValidation.validate(request.headers);
    //     if(error){
    //         return reply.status(400).send({

    //             error:'Bad Request',
    //             message:'The authorization header is required',
    //             })
    //     }
    // },logout); // logout route

    fastify.post('/logout', {


        schema: logoutSwagger.schema,

        preHandler: async (request, reply) => {





            console.log(request.headers['authorization'], "this is the request header for me ");

            console.log(request.headers)
            const { error } = userLogoutValidation.validate({
                authorization: request.headers['authorization'], // Accessing the header value
            });


            if (error) {
                return reply.status(400).send({

                    error: 'Bad Request',
                    message: 'Validation failed in the header requirement not matching',
                });
            }

            await auth(request, reply);
        }
    }, logout); // logout route



}

export default authroutes;