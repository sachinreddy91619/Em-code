import fastify from 'fastify';

import joi from 'joi';

const app=fastify({
    logger:true
});

const passwordUpdateValidation=joi.object({
    username:joi.string().alphanum().min(3).max(15).required(),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\\d\\W_]{8,30}$')).required(),
    //password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    


});


export default passwordUpdateValidation