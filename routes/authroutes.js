

import fastify from 'fastify';
import joi from 'joi';

const app = fastify({
    logger: true
});

import { register, login } from '../controllers/authopera.js';
import auth from '../middleware/authmiddle.js';
import registerUserSchema from '../schemas/registerUserSchema.js';
import loginUserSchema from '../schemas/loginUserSchema.js';

import { logout } from '../controllers/authopera.js';

import userRegisterValidation from '../validators/registration.js';

import userLoginvalidation from '../validators/login.js';

import userLogoutValidation from '../validators/logout.js';

async function authroutes(fastify, options) {


   

    fastify.post('/register', { schema: registerUserSchema ,preHandler:
        async(request ,reply)=>{
            const {error}=userRegisterValidation.validate(request.body);
            if(error){
                return reply.status(400).send({
                    error:'Bad Request',
                    message:error.details[0].message,
                });
            }
        }
    }, register); // register route


    fastify.post('/login', { schema: loginUserSchema ,preHandler:async(request,reply)=>{
        const {error}=userLoginvalidation.validate(request.body);
        if(error){
            return reply.status(400).send({
                error:'Bad Request',
                message:error.details[0].message,
            })
        }


    }}, login); // login route



    // fastify.post('/logout', { preHandler: auth }, async(request,reply)=>{
    //     const {error}=userLogoutValidation.validate(request.headers);
    //     if(error){
    //         return reply.status(400).send({

    //             error:'Bad Request',
    //             message:'The authorization header is required',
    //             })
    //     }
    // },logout); // logout route

    fastify.post('/logout', { preHandler: async(request,reply)=>{
            const {error}=userLogoutValidation.validate(request.headers);
            if(error){
                return reply.status(400).send({
    
                    error:'Bad Request',
                    message:'The authorization header is required',
                    });
            }

            await auth(request,reply);
        }
        },logout); // logout route
    


}

export default authroutes;
