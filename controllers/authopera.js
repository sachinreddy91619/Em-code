import '../instrument.js';

import * as Sentry from "@sentry/node";

import app from '../app.js';
import fastify from 'fastify';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import Logs from '../models/Logs.js';
import jwt from 'jsonwebtoken';
import joi from 'joi';




// const app = fastify({
//     logger: true
// })

//Sentry.setupFastifyErrorHandler(app);


console.log("Starting authopera.js...");



// THE REGISTRATION CONTROLLER LOGIC 
export const register = async (request, reply) => {
    const { username, password, email, role } = request.body;



    try {

        const existingUser = await User.findOne({ username });
        console.log("Checking for existing user:", username, "Found:", existingUser);
        //DONE
        if (existingUser) {

            return reply.status(400).send({ error: 'Username already exists. Try with another username' });
        }

        const user = new User({ username, email, password, role });

        await user.save();
        //  reply.status(201).send({user})
        console.log("Sending success response: user created");
        //DONE
        reply.status(201).send({ message: 'user created successfully' });
        // reply.status(201).send({user})
    }
    catch (err) {
        //  console.error('Error creating the user',err);
        //  console.error("Error during user registration:", err);
        Sentry.captureException(err);

        return reply.status(500).send({ error: 'error creating the user' });

    }
}

// THE LOGIN CONTROLLER LOGIC 
export const login = async (request, reply) => {


    const { username, password } = request.body;
    // console.log("Login attempt:", { username });  // Debugging login request


    try {
        const user = await User.findOne({ username });
        console.log("User found for login:", user ? user._id : "No user found");
        //DONE
        if (!user) {
            return reply.status(400).send({ error: 'user not found' });
        }

        const ismatch = await bcrypt.compare(password, user.password);
        //DONE
        if (!ismatch) return reply.status(400).send({ error: 'invalid credentials' });

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.SEC);

        //  reply.status(200).send({token});
        console.log(token);
        const data = await User.findOne({ username });
        //console.log(data, "hey iam doing good hey iam doing good here ")
        // Userid=data._id;

        const existingLog = await Logs.findOne({ UserId: user._id })

        console.log(existingLog, "exisiting loger details here");
        //DONE
        if (existingLog) {
            console.log("Existing log found, updating log:", existingLog);
            existingLog.UserId = user._id,

                existingLog.logintime = Date.now(),

                existingLog.logouttime = null,

                existingLog.UserToken = token

            await existingLog.save();
            console.log("Existing log updated:", existingLog);
            // console.log("Existing log updated:", existingLog);
        }
        else {
            console.log("No existing log found, creating new log.");
            const user1 = new Logs({
                //Userid:user._id,
                UserId: user._id,

                logintime: Date.now(),

                logouttime: null,

                UserToken: token
            });

            await user1.save();
            console.log(user1, "document,done");

        }




        console.log("Sending login response with token:", token);
        // DONE
        reply.status(200).send({ token });

    }
    catch (err) {
        // Log the actual error message for debugging

        Sentry.captureException(err);

        reply.status(500).send({ error: 'Error while logging in the user' });
    }

};





// THE LOGOUT CONTROLLER LOGIC 
export const logout = async (request, reply) => {

    try {


        const authHeader = request.headers['authorization'];
        console.log("Logout attempt, received token:", authHeader);
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return reply.status(401).send({ error: 'token required for the logging' })
        };


        const decoded = jwt.verify(token, process.env.SEC);
        const userId = decoded.id;
        console.log(userId);

        const userlogs = await Logs.findOne({ UserId: userId });

        console.log("User logs for logout:", userlogs);

        if (!userlogs) {
            return reply.status(400).send({ message: 'No active session found for this token' });
        }


        console.log(userlogs, "user logs");
        userlogs.logouttime = Date.now();
        userlogs.UserToken = null;

        await userlogs.save();
        console.log("Logging out user, sending response.");
        reply.send({ message: 'user logged out successfully' });
    }

    catch (err) {
        //console.log('Error durign the logout', err);

        Sentry.captureException(err);
        reply.status(400).send({ error: 'error while logout of the current-user' });
    }

}