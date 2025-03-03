
import fastify from 'fastify';

const app = fastify({
    logger: true
})

import { otpStore } from '../controllers/authopera.js';  // Adjust the path based on your project structure

export const otpMiddleware = async (request, reply, done) => {
    // Get the first key from otpStore (assuming only one user exists at a time)
    const username = Object.keys(otpStore)[0];

    console.log("Extracted username from otpStore:", username);
    console.log("Stored OTP data:", otpStore);

    // Directly assign values from otpStore
    request.secretKey = otpStore[username]?.secretKey;
    request.user = otpStore[username]?.user;

    console.log("Middleware attached data:", request.secretKey, request.user);

    // Proceed to the next middleware or controller
    //done();
};
